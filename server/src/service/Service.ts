
import { FacultyDormitoryNoSeats , FacultyDormitoryHasSeats  } from '../chainOfResponsibility';
import { Connection } from '../dbConnection';
import { config } from '../config';
import {FastifyInstance} from "fastify";
import {StudentHasBenefits, IsStudentWaiting, AndSpecification} from "../specification";
import NodeCache from "node-cache";
// @ts-ignore
import fetch from "node-fetch";
import {release} from "os";


export default class Service {

    private facultyDormHandler: FacultyDormitoryHasSeats;
    private otherDormHandler: FacultyDormitoryNoSeats;
    private connection: Connection;
    private readonly server: FastifyInstance;
    private cache;

    constructor(server: FastifyInstance) {
        this.server = server;
        this.facultyDormHandler = new FacultyDormitoryHasSeats();
        this.otherDormHandler = new FacultyDormitoryNoSeats();
        this.connection = Connection.getInstance(server, config);
        this.cache = new NodeCache({ stdTTL: 200} );
    }

    async selectAllStudents(tableName: string): Promise<any> {
        if (this.cache.has("student_info")) {
            console.log('returned from cache')
            return this.cache.get("student_info");
        } else {
            const data = await this.connection.query(this.server, `SELECT * FROM ${tableName}`);
            const responseFirstProvider = await fetch('http://localhost:8081/students');
            const secondProviderData = [];
            for (let index = 1; index < 6; index++) {
                const responseSecondProvider = await fetch(`http://localhost:8082/students/pages/${index}`);
                const dataSecondProvider = await responseSecondProvider.json();
                secondProviderData.push(...dataSecondProvider)
            }
            const dataFirstProvider = await responseFirstProvider.json();
            const result = data.rows.concat(dataFirstProvider, secondProviderData);
            this.cache.set("student_info", result);
            console.log('returned without cache')
            return result;
        }
    }

    selectAll(tableName: string): any {
        const sqlQuery = `SELECT * FROM ${tableName}`
        return this.connection.query(this.server, sqlQuery);
    }

    select(query: string, table: string, condition: string | number): any {
        const sqlQuery = `SELECT ${query} FROM ${table} WHERE ${condition}`;
        return this.connection.query(this.server, sqlQuery);
    }

    postInfo(table: string, columns: string, values: string, args: Array<any>): any {
        const sqlQuery = `INSERT INTO ${table} ${columns} VALUES ${values}`;
        return this.connection.query(this.server, sqlQuery, args);
    }

    deleteInfo(table: string, condition: string | number): any {
        const sqlQuery = `DELETE FROM ${table} WHERE ${condition}`
        return this.connection.query(this.server, sqlQuery)
    }

    updateInfo(table: string, value: string, condition: string): any {
        const sqlQuery = `UPDATE ${table} SET ${value} WHERE ${condition}`;
        return this.connection.query(this.server, sqlQuery)
    }

    selectFacultyDormitories(): any {
        const sqlQuery = `SELECT * FROM dormitories d JOIN facultydormitories fd ON d.dormitoryid = fd.dormitoryid`;
        return this.connection.query(this.server, sqlQuery)
    }

    async makeWarrantList(): Promise<any> {

        const benefitsCheck = new StudentHasBenefits();
        const waitingCheck = new IsStudentWaiting();
        const studentsData = await this.selectAllStudents('students');
        const waitingList = studentsData.filter((student: any) => waitingCheck.IsSatisfiedBy(student));

        this.facultyDormHandler.setNext(this.otherDormHandler);

        const warrants = [];

        const allDormitories = await this.selectFacultyDormitories();
        const numberOfFreeSeats: any[] = [];
        allDormitories.rows.forEach((dorm: any) => {
            numberOfFreeSeats.push(dorm.numberofseats)
        });
        console.log(numberOfFreeSeats)

        for (const student of waitingList) {
            const facultyDormitories = allDormitories.rows.filter((relation: any) => relation.facultyid === student.facultyid);
            const otherDormitories = allDormitories.rows.filter((relation: any) => relation.facultyid !== student.facultyid);
            const request = {
                student: student,
                facultyDormitories: facultyDormitories,
                otherDormitories: otherDormitories,
                freeSeats: numberOfFreeSeats,
                studentBenefits: benefitsCheck.IsSatisfiedBy(student)
            }
            const result = this.facultyDormHandler.handle(request);
            if (result.dormitoryid !== 0) {
                numberOfFreeSeats[result.dormitoryid - 1] -= 1;
            }
            warrants.push(result)
        }
        console.log(numberOfFreeSeats)

        return warrants;

    }

}