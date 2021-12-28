"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const fastify_1 = require("fastify");
const controller_1 = __importDefault(require("./controllers/controller"));
class App {
    constructor() {
        this.fastifyServer = (0, fastify_1.fastify)({
            logger: true
        });
        this.controller = new controller_1.default(this.fastifyServer);
    }
    makeRoutes() {
        this.fastifyServer.get('/', (req, res) => {
            res.send({ hello: 'world' });
        });
        this.fastifyServer.get('/students', this.controller.getStudentsList.bind(this.controller));
        this.fastifyServer.get('/students/:id', this.controller.getStudentInfo.bind(this.controller));
        this.fastifyServer.post('/students', this.controller.postStudentInfo.bind(this.controller));
        this.fastifyServer.get('/dormitories', this.controller.getDormitoryList.bind(this.controller));
        this.fastifyServer.get('/faculties', this.controller.getAllFaculties.bind(this.controller));
        this.fastifyServer.delete('/delete_students/:id', this.controller.deleteStudent.bind(this.controller));
        this.fastifyServer.put('/update_student/:id', this.controller.updateStudent.bind(this.controller));
        this.fastifyServer.get('/warrant_list', this.controller.getWarrantList.bind(this.controller));
    }
}
exports.App = App;
