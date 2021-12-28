"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.Config = void 0;
class Config {
    constructor(user, host, database, password, port) {
        this.user = user;
        this.host = host;
        this.database = database;
        this.password = password;
        this.port = port;
    }
}
exports.Config = Config;
exports.config = new Config("postgres", "localhost",5432);
