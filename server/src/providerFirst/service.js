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
        connectionString: 'postgres://postgres:Maksim2012@localhost/Provider2'
    });
    fastify.options('/*', (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Headers", "content-type, authorization");
        reply.code(200);
    }));
    fastify.get('/students', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const queryString = Object.keys(request.query).map(key => key + ' = ' + request.query[key]).join(' AND ');
        let condition = '';
        if (queryString) {
            condition = "WHERE " + queryString;
        }
        console.log(condition);
        const client = yield fastify.pg.connect();
        const data = yield client.query(`SELECT * FROM students ${condition}`);
        setTimeout(() => {
            client.release();
            reply.send(data.rows);
        }, 20000);
    }));
    fastify.listen(8081, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
        fastify.log.info(`server listening on ${address}`);
    });
};
setupFirstProviderServer();
