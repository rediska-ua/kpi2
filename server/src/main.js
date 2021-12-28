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
const app_1 = require("./app");
const app = new app_1.App();
const PORT = process.env.PORT || 8080;
const server = app.fastifyServer;
app.makeRoutes();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen(PORT, '127.0.0.1');
        const address = server.server.address();
        server.log.info(`server is listening on ${address.port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
