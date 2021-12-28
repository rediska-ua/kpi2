"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionBuilder = void 0;
class ConnectionBuilder {
    constructor() {
        this.reset();
        this.connectionString = 'postgres://';
    }
    reset() {
        this.connectionString = '';
    }
    setUser(user) {
        this.connectionString = this.connectionString + `${user}` + ":";
        return this;
    }
    setPassword(password) {
        this.connectionString = this.connectionString + `${password}` + "@";
        return this;
    }
    setHost(host) {
        this.connectionString = this.connectionString + `${host}` + ":";
        return this;
    }
    setPort(port) {
        this.connectionString = this.connectionString + `${port}` + "/";
        return this;
    }
    setDatabase(db) {
        this.connectionString = this.connectionString + `${db}`;
        return this;
    }
    getConnectionString() {
        const result = this.connectionString;
        this.reset();
        return result;
    }
}
exports.ConnectionBuilder = ConnectionBuilder;
