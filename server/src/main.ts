import { App } from "./app";

const app = new App();
const PORT = process.env.PORT || 8080

const server = app.fastifyServer;
app.makeRoutes()


const start = async () => {
    try {
        await server.listen(PORT, '127.0.0.1');
        const address: any = server.server.address();
        server.log.info(`server is listening on ${address.port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();