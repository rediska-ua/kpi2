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
exports.Connection = void 0;
const fastify_postgres_1 = __importDefault(require("fastify-postgres"));
const ConnectionBuilder_1 = require("./ConnectionBuilder");
class Connection {
    constructor(server, config) {
        const { user, host, database, password, port } = config;
        const builder = new ConnectionBuilder_1.ConnectionBuilder();
        builder.setUser(user).setPassword(password).setHost(host).setPort(port).setDatabase(database);
        const connectionString = builder.getConnectionString();
        server.register(fastify_postgres_1.default, {
            connectionString: connectionString.toString()
        });
    }
    static getInstance(server, config) {
        if (!Connection._instance) {
            Connection._instance = new Connection(server, config);
        }
        return Connection._instance;
    }
    query(server, sqlQuery, args = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield server.pg.connect();
            return client.query(sqlQuery, args);
        });
    }
}
exports.Connection = Connection;
