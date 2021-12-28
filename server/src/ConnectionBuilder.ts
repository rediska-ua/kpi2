"use strict";

interface Builder {
    setUser(user: string): ConnectionBuilder,
    setPassword(password: string): ConnectionBuilder,
    setHost(host: string): ConnectionBuilder,
    setPort(port: number): ConnectionBuilder,
    setDatabase(db: string): ConnectionBuilder
}

export class ConnectionBuilder implements Builder {

    private connectionString: string;

    constructor() {
        this.reset();
        this.connectionString = 'postgres://';
    }

    public reset(): void {
        this.connectionString = '';
    }

    public setUser(user: string): ConnectionBuilder {
        this.connectionString = this.connectionString + `${user}` + ":";
        return this;
    }

    public setPassword(password: string): ConnectionBuilder {
        this.connectionString = this.connectionString + `${password}` + "@";
        return this;
    }

    public setHost(host: string): ConnectionBuilder {
        this.connectionString = this.connectionString + `${host}` + ":";
        return this;
    }

    public setPort(port: number): ConnectionBuilder {
        this.connectionString = this.connectionString + `${port}` + "/";
        return this;
    }

    public setDatabase(db: string): ConnectionBuilder {
        this.connectionString = this.connectionString + `${db}`;
        return this;
    }

    public getConnectionString(): string {
        const result = this.connectionString;
        this.reset();
        return result;
    }
}
 

