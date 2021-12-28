const express  = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const fetch = require('node-fetch');

const pgp = require('pg-promise')();
const db = pgp("postgres://postgres:Maksim2012@localhost:5432/Dormitory");

const rootValue = {
    getAllDormitories: async () => {
        return db.any("SELECT * FROM dormitories");
    },
    getAllStudents: async () => {
        return db.any("SELECT * FROM students");
    },
    getAllFaculties: async () => {
        return db.any("SELECT * FROM faculties");
    },
    getStudentById: async (id) => {
        const data = await db.any(`SELECT * FROM students WHERE studentid = ${id.id}`);
        return data[0]
    },
    getStudentByDormitoryStatus: async (id) => {
        const data = await db.any(`SELECT * FROM students WHERE dormitorystatusid = ${id.id}`);
        return data[0]
    },
    createStudent: async ({input}) => {
        const data = await db.any(`INSERT INTO students VALUES($1 ,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [
            input.studentid, input.facultyid, input.dormitorystatusid, input.firstname, input.middlename, input.lastname,
            input.yearofstudy, input.dateofbirth, input.studentgroup, input.gender, input.hasbenefits])
        console.log(data);
        return 'Inserted'

    },
    updateStudent: async ({input}) => {
        const keys = Object.keys(input);
        const values = [];
        for (let i = 1; i < keys.length; i++) {
            values.push(`${keys[i]} = '${input[keys[i]]}'`)
        }
        const setQuery = values.join(',');
        console.log(setQuery)
        const data = await db.any(`UPDATE students SET ${setQuery} WHERE ${keys[0]} = ${input.studentid}`);
        console.log(data)
        return 'Updated'
    },
    deleteStudent: async({input}) => {
        const data = await db.any(`DELETE FROM students WHERE studentid = ${input.studentid}`);
        console.log(data)
        return 'Deleted'
    },
    getWarrantList: async () => {
        const data = await fetch('http://127.0.0.1:8080/warrant_list');
        const someResult = await data.json()
        console.log(someResult)
        return someResult;

    }

};

const app = express();
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        rootValue,
        graphiql: { headerEditorEnabled: true },
    }),
);
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');