import {FastifyRequest, FastifyReply} from "fastify";

const setupFirstProviderServer = (): void => {

    const fastify = require('fastify')({
        logger: true
    });

    fastify.register(require('fastify-postgres'), {
        connectionString: 'postgres://postgres:Maksim2012@localhost/Provider2'
    })

    fastify.options('/*', async (req: FastifyRequest, reply: FastifyReply) => {
        reply.header("Access-Control-Allow-Origin", "*")
        reply.header("Access-Control-Allow-Headers", "content-type, authorization")
        reply.code(200)
    })


    fastify.get('/students', async (request: any, reply: FastifyReply) => {
        const queryString = Object.keys(request.query).map(key => key + ' = ' + request.query[key]).join(' AND ');
        let condition = '';
        if (queryString) {
            condition = "WHERE " + queryString;
        }
        console.log(condition)
        const client = await fastify.pg.connect();
        const data = await client.query(
            `SELECT * FROM students ${condition}`
        )

        setTimeout(() => {
            client.release()
            reply.send(data.rows)
        }, 20000)
    })


    fastify.listen(8081, (err: Error, address: string) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`server listening on ${address}`)
    })

}

setupFirstProviderServer()