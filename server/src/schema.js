const {buildSchema} = require('graphql');

const schema = buildSchema(`

     type Student {
        studentid: Int,
        facultyid: Int,
        dormitorystatus: Int,
        firstname: String,
        middlename: String,
        lastname: String,
        yearofstudy: Int,
        dateofbirth: String,
        studentgroup: String,
        gender: String,
        hasbenefits: Boolean
     }

    type Dormitory {
        dormitoryid: Int,
        dormitorynumber: Int,
        address: String,
        numberofseats: Int
    }
    
    type Faculty {
        facultyid: Int,
        facultyname: String
    }
    
    type Warrant {
        studentid: Int,
        dormitoryid: Int
    }
    
    type Query {
        hello: Int,
        getAllDormitories: [Dormitory],
        getAllStudents: [Student],
        getAllFaculties: [Faculty],
        getStudentById(id: Int): Student,
        getStudentByDormitoryStatus(id: Int): Student,
        getWarrantList: [Warrant]
    }
    
    
    input StudentInput {
        studentid: Int!,
        facultyid: Int!,
        dormitorystatusid: Int!,
        firstname: String!,
        middlename: String!,
        lastname: String!,
        yearofstudy: Int!,
        dateofbirth: String!,
        studentgroup: String!,
        gender: String!,
        hasbenefits: Boolean!
    }
    
    input StudentUpdateInput {
        studentid: Int!,
        facultyid: Int,
        dormitorystatusid: Int,
        firstname: String,
        middlename: String,
        lastname: String,
        yearofstudy: Int,
        dateofbirth: String,
        studentgroup: String,
        gender: String,
        hasbenefits: Boolean
    }
    
    input StudentDeleteInput {
        studentid: Int!
    }
    
    input DormitoryInput {
        dormitoryid: Int!,
        dormitorynumber: Int!,
        address: String!,
        numberofseats: Int!
    }
    
    type Mutation {
        createStudent(input: StudentInput): String
        updateStudent(input: StudentUpdateInput): String
        deleteStudent(input: StudentDeleteInput): String
    }
`);

module.exports = schema;