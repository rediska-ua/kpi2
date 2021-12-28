
import { fastify, FastifyReply, FastifyRequest, FastifyInstance} from 'fastify';
import Controller from './controllers/controller';

export class App {

    public controller: Controller;
    public fastifyServer: FastifyInstance;

    public constructor () {
        this.fastifyServer = fastify({
            logger: true
        });
        this.controller = new Controller(this.fastifyServer);
    }

    makeRoutes() {
        this.fastifyServer.get('/', (req: FastifyRequest, res: FastifyReply) => {
            res.send({hello: 'world'})
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