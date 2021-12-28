"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chainOfResponsibility_1 = require("../chainOfResponsibility");
const dbConnection_1 = require("../dbConnection");
const config_1 = require("../config");
const specification_1 = require("../specification");
const node_cache_1 = __importDefault(require("node-cache"));
// @ts-ignore
const node_fetch_1 = __importDefault(require("node-fetch"));
class Service {
    constructor(server) {
        this.server = server;
        this.facultyDormHandler = new chainOfResponsibility_1.FacultyDormitoryHasSeats();
        this.otherDormHandler = new chainOfResponsibility_1.FacultyDormitoryNoSeats();
        this.connection = dbConnection_1.Connection.getInstance(server, config_1.config);
        this.cache = new node_cache_1.default({ stdTTL: 200 });
    }
    selectAllStudents(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache.has("student_info")) {
                console.log('returned from cache');
                return this.cache.get("student_info");
            }
            else {
                const data = yield this.connection.query(this.server, `SELECT * FROM ${tableName}`);
                const responseFirstProvider = yield (0, node_fetch_1.default)('http://localhost:8081/students');
                const secondProviderData = [];
                for (let index = 1; index < 6; index++) {
                    const responseSecondProvider = yield (0, node_fetch_1.default)(`http://localhost:8082/students/pages/${index}`);
                    const dataSecondProvider = yield responseSecondProvider.json();
                    secondProviderData.push(...dataSecondProvider);
                }
                const dataFirstProvider = yield responseFirstProvider.json();
                const result = data.rows.concat(dataFirstProvider, secondProviderData);
                this.cache.set("student_info", result);
                console.log('returned without cache');
                return result;
            }
        });
    }
    selectAll(tableName) {
        const sqlQuery = `SELECT * FROM ${tableName}`;
        return this.connection.query(this.server, sqlQuery);
    }
    select(query, table, condition) {
        const sqlQuery = `SELECT ${query} FROM ${table} WHERE ${condition}`;
        return this.connection.query(this.server, sqlQuery);
    }
    postInfo(table, columns, values, args) {
        const sqlQuery = `INSERT INTO ${table} ${columns} VALUES ${values}`;
        return this.connection.query(this.server, sqlQuery, args);
    }
    deleteInfo(table, condition) {
        const sqlQuery = `DELETE FROM ${table} WHERE ${condition}`;
        return this.connection.query(this.server, sqlQuery);
    }
    updateInfo(table, value, condition) {
        const sqlQuery = `UPDATE ${table} SET ${value} WHERE ${condition}`;
        return this.connection.query(this.server, sqlQuery);
    }
    selectFacultyDormitories() {
        const sqlQuery = `SELECT * FROM dormitories d JOIN facultydormitories fd ON d.dormitoryid = fd.dormitoryid`;
        return this.connection.query(this.server, sqlQuery);
    }
    makeWarrantList() {
        return __awaiter(this, void 0, void 0, function* () {
            const benefitsCheck = new specification_1.StudentHasBenefits();
            const waitingCheck = new specification_1.IsStudentWaiting();
            const studentsData = yield this.selectAllStudents('students');
            const waitingList = studentsData.filter((student) => waitingCheck.IsSatisfiedBy(student));
            this.facultyDormHandler.setNext(this.otherDormHandler);
            const warrants = [];
            const allDormitories = yield this.selectFacultyDormitories();
            const numberOfFreeSeats = [];
            allDormitories.rows.forEach((dorm) => {
                numberOfFreeSeats.push(dorm.numberofseats);
            });
            console.log(numberOfFreeSeats);
            for (const student of waitingList) {
                const facultyDormitories = allDormitories.rows.filter((relation) => relation.facultyid === student.facultyid);
                const otherDormitories = allDormitories.rows.filter((relation) => relation.facultyid !== student.facultyid);
                const request = {
                    student: student,
                    facultyDormitories: facultyDormitories,
                    otherDormitories: otherDormitories,
                    freeSeats: numberOfFreeSeats,
                    studentBenefits: benefitsCheck.IsSatisfiedBy(student)
                };
                const result = this.facultyDormHandler.handle(request);
                if (result.dormitoryid !== 0) {
                    numberOfFreeSeats[result.dormitoryid - 1] -= 1;
                }
                warrants.push(result);
            }
            console.log(numberOfFreeSeats);
            return warrants;
        });
    }
}
exports.default = Service;
