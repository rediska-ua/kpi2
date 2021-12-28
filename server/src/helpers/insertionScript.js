
const getRandomName = (length) => {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const randomBenefits = () => {
    const values = [true, false];
    const index = Math.floor(Math.random() * values.length);
    return values[index];
}

const randomFaculty = () => {
    return Math.floor(Math.random() * 4) + 1;
}

const randomGroup = () => {
    const groups = ["IP", "OM", "IK", "BI", "XI"];
    const index = Math.floor(Math.random() * groups.length);
    return `${groups[index]}-${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
}

const randomDormitoryStatus = () => {
    const statuses = [1, 2, 3, 4, 5];
    const index = Math.floor(Math.random() * statuses.length);
    return statuses[index];
}

const randomGender = () => {
    const genders = ['female', 'male'];
    const index = Math.floor(Math.random() * genders.length);
    return genders[index];
}


const insertionScript = () => {

    const fastify = require('fastify')({
        logger: true
    });

    fastify.register(require('fastify-postgres'), {
        connectionString: 'postgres://postgres:Maksim2012@localhost/Dormitory'
    })

    fastify.options('/*', async (req, reply) => {
        reply.header("Access-Control-Allow-Origin", "*")
        reply.header("Access-Control-Allow-Headers", "content-type, authorization")
        reply.code(200)
    })


    fastify.post('/load_students', async (request, reply) => {

        const client = await fastify.pg.connect();

        for (let index = 0; index < 10000; index++) {
            const studentid = 100000 + index;
            const yearOfStudy = 1
            const date = randomDate(new Date(2001, 0, 1), new Date(2003, 12, 1));
            const { rows } = await client.query(`INSERT INTO students (studentid, facultyid, dormitorystatusid, 
                      firstname, middlename, lastname, yearofstudy, dateofbirth, studentgroup, gender, 
                      hasbenefits) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [studentid, randomFaculty(), randomDormitoryStatus(), getRandomName(8), getRandomName(8),
                getRandomName(8), yearOfStudy, date, randomGroup(), randomGender(), randomBenefits()]
            )
        }
        reply.code(204)
        client.release()
    })

    fastify.get('/students', async (request, reply) => {
        const client = await fastify.pg.connect();
        const { rows } = await client.query(`SELECT * FROM students`);
        reply.send(rows)
    })


    fastify.listen(8084, (err, address) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`server listening on ${address}`)
    })

}

insertionScript()