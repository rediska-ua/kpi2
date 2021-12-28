import Service from '../service/Service';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default class Controller {

    public service: Service;
    private readonly server: FastifyInstance

    constructor(server: FastifyInstance) {
        this.server = server;
        this.service = new Service(this.server);
    }

    async getDormitoryList(request: FastifyRequest, reply: FastifyReply) {
        const data = await this.service.selectAll('dormitories');
        reply.code(200);
        reply.send(data);
    }

    async getAllFaculties(request: FastifyRequest, reply: FastifyReply) {
        const data = await this.service.selectAll('faculties');
        reply.code(200);
        reply.send(data);
    }

    async getStudentsList(request: any, reply: FastifyReply) {
        const result = await this.service.selectAllStudents('students');
        console.log(result);
        reply.code(200);
        reply.send(result);
    }

    async getStudentInfo(request: any, reply: FastifyReply) {
        const studentId = parseInt(request.params.id);
        const result = await this.service.select('*', 'students', `studentid = ${studentId}`);
        reply.code(200);
        reply.send(result.rows);
    }

    async postStudentInfo(request: any, reply: FastifyReply) {
        const {studentid, facultyId, dormitoryStatusId, firstName, middleName, lastName, yearOfStudy, dateOfBirth, studentGroup, gender, hasbenefits} = request.body;
        const result = await this.service.postInfo("students", "(studentid, facultyId, dormitoryStatusId, firstName, middleName, lastName, yearOfStudy, dateOfBirth, studentGroup, gender, hasbenefits)", "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [studentid, facultyId, dormitoryStatusId, firstName, middleName, lastName, yearOfStudy, dateOfBirth, studentGroup, gender, hasbenefits]);
        reply.code(201);
        reply.send(result.rows);
    }


    async deleteStudent(request: any, reply: FastifyReply) {
        const studentId = parseInt(request.params.id);
        const result = await this.service.deleteInfo('students', `studentid = ${studentId}`);
        reply.code(204);
        reply.send(result.rows);
    }

    async updateStudent(request: any, reply: FastifyReply) {
        const queryString = Object.keys(request.query).map(key => key + ' = ' + request.query[key]).join(' & ');
        const studentId = parseInt(request.params.id);
        const result = await this.service.updateInfo('students', `${queryString}`, `studentid=${studentId}`);
        reply.code(201);
        reply.send(result.rows);
    }

    async getWarrantList(request: FastifyRequest, reply: FastifyReply) {
        const data = await this.service.makeWarrantList();
        console.log(data)
        reply.code(200);
        reply.send(data);
    }

}