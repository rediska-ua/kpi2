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
const Service_1 = __importDefault(require("../service/Service"));
class Controller {
    constructor(server) {
        this.server = server;
        this.service = new Service_1.default(this.server);
    }
    getDormitoryList(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.selectAll('dormitories');
            reply.code(200);
            reply.send(data);
        });
    }
    getAllFaculties(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.selectAll('faculties');
            reply.code(200);
            reply.send(data);
        });
    }
    getStudentsList(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.service.selectAllStudents('students');
            console.log(result);
            reply.code(200);
            reply.send(result);
        });
    }
    getStudentInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(request.params.id);
            const result = yield this.service.select('*', 'students', `studentid = ${studentId}`);
            reply.code(200);
            reply.send(result.rows);
        });
    }
    postStudentInfo(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentid, facultyId, dormitoryStatusId, firstName, middleName, lastName, yearOfStudy, dateOfBirth, studentGroup, gender, hasbenefits } = request.body;
            const result = yield this.service.postInfo("students", "(studentid, facultyId, dormitoryStatusId, firstName, middleName, lastName, yearOfStudy, dateOfBirth, studentGroup, gender, hasbenefits)", "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [studentid, facultyId, dormitoryStatusId, firstName, middleName, lastName, yearOfStudy, dateOfBirth, studentGroup, gender, hasbenefits]);
            reply.code(201);
            reply.send(result.rows);
        });
    }
    deleteStudent(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = parseInt(request.params.id);
            const result = yield this.service.deleteInfo('students', `studentid = ${studentId}`);
            reply.code(204);
            reply.send(result.rows);
        });
    }
    updateStudent(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = Object.keys(request.query).map(key => key + ' = ' + request.query[key]).join(' & ');
            const studentId = parseInt(request.params.id);
            const result = yield this.service.updateInfo('students', `${queryString}`, `studentid=${studentId}`);
            reply.code(201);
            reply.send(result.rows);
        });
    }
    getWarrantList(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.makeWarrantList();
            console.log(data);
            reply.code(200);
            reply.send(data);
        });
    }
}
exports.default = Controller;
