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
Object.defineProperty(exports, "__esModule", { value: true });
const setupFirstProviderServer = () => {
    const fastify = require('fastify')({
        logger: true
    });
    fastify.register(require('fastify-postgres'), {
        connectionString: 'postgres://postgres:Maksim2012@localhost/Provider1'
    });
    fastify.options('/*', (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Headers", "content-type, authorization");
        reply.code(200);
    }));
    fastify.get('/students', (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield fastify.pg.connect();
        const data = yield client.query("SELECT * from students");
        client.release();
        reply.send(data.rows);
    }));
    fastify.get('/students/details/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const studentId = parseInt(request.params.id);
        const client = yield fastify.pg.connect();
        const data = yield client.query("SELECT * from students WHERE studentid = $1", [studentId]);
        client.release();
        reply.send(data.rows);
    }));
    fastify.get('/students/pages/:id', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const pageId = parseInt(request.params.id);
        const offset = pageId === 1 ? 0 : (pageId - 1) * 5000;
        const limit = pageId * 5000;
        const client = yield fastify.pg.connect();
        const data = yield client.query(`SELECT * from students LIMIT ${limit} OFFSET ${offset}`);
        client.release();
        reply.send(data.rows);
    }));
    fastify.listen(8082, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(`server listening on ${address}`);
    });
};
setupFirstProviderServer();
