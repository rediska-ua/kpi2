"use strict";


import { FastifyInstance } from 'fastify'
import {Config} from './config';
import pg from 'fastify-postgres';
import {ConnectionBuilder} from "./ConnectionBuilder";

export class Connection {

    private static _instance: Connection;

    private constructor (server: FastifyInstance, config: Config) {
        const {user, host, database, password, port} = config;
        const builder = new ConnectionBuilder();
        builder.setUser(user).setPassword(password).setHost(host).setPort(port).setDatabase(database);
        const connectionString = builder.getConnectionString();
        server.register(pg, {
            connectionString: connectionString.toString()
        })
    }

    public static getInstance(server: FastifyInstance, config: Config): Connection {
        if (!Connection._instance) {
            Connection._instance = new Connection(server, config);
        }
        return Connection._instance;
    }


    public async query(server: FastifyInstance, sqlQuery: string, args: Array<string | number> = []) {
        const client = await server.pg.connect()
        return client.query(sqlQuery, args);
    }
}
