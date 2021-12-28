import {FastifyRequest, FastifyReply} from "fastify";

const setupFirstProviderServer = (): void => {

    const fastify = require('fastify')({
        logger: true
    });

    fastify.register(require('fastify-postgres'), {
        connectionString: 'postgres://postgres:Maksim2012@localhost/Provider1'
    })

    fastify.options('/*', async (req: FastifyRequest, reply: FastifyReply) => {
        reply.header("Access-Control-Allow-Origin", "*")
        reply.header("Access-Control-Allow-Headers", "content-type, authorization")
        reply.code(200)
    })


    fastify.get('/students', async (req: FastifyRequest, reply: FastifyReply) => {
        const client = await fastify.pg.connect()
        const data = await client.query(
            "SELECT * from students"
        )
        client.release()
        reply.send(data.rows)
    })

    fastify.get('/students/details/:id', async (request: any, reply: FastifyReply) => {
        const studentId = parseInt(request.params.id);
        const client = await fastify.pg.connect()
        const data = await client.query(
            "SELECT * from students WHERE studentid = $1", [studentId]
        )
        client.release()
        reply.send(data.rows)
    })

    fastify.get('/students/pages/:id', async (request: any, reply: FastifyReply) => {
        const pageId = parseInt(request.params.id);
        const offset = pageId === 1 ? 0 : (pageId - 1) * 5000;
        const limit = pageId * 5000;
        const client = await fastify.pg.connect();
        const data = await client.query(
            `SELECT * from students LIMIT ${limit} OFFSET ${offset}`
        )
        client.release()
        reply.send(data.rows)
    })

    fastify.listen(8082, (err: Error, address: string) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`server listening on ${address}`)
    })

}

setupFirstProviderServer()