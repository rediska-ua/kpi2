"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyDormitoryNoSeats = exports.FacultyDormitoryHasSeats = void 0;
class AbstractHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}
class FacultyDormitoryHasSeats extends AbstractHandler {
    handle(request) {
        const { student, facultyDormitories, otherDormitories, freeSeats, studentBenefits } = request;
        for (const dorm of facultyDormitories) {
            if (freeSeats[dorm.dormitoryid - 1] > 0) {
                return { studentid: student.studentid, dormitoryid: dorm.dormitoryid };
            }
        }
        const requestObj = {
            student: student,
            otherDormitories: otherDormitories,
            freeSeats: freeSeats,
            studentBenefits: studentBenefits
        };
        return super.handle(requestObj);
    }
}
exports.FacultyDormitoryHasSeats = FacultyDormitoryHasSeats;
class FacultyDormitoryNoSeats extends AbstractHandler {
    handle(request) {
        const { student, otherDormitories, freeSeats, studentBenefits } = request;
        if (studentBenefits === true) {
            for (const dorm of otherDormitories) {
                if (freeSeats[dorm.dormitoryid - 1]) {
                    console.log('here');
                    return { studentid: student.studentid, dormitoryid: dorm.dormitoryid };
                }
            }
        }
        return { studentid: student.studentid, dormitoryid: 0 };
    }
}
exports.FacultyDormitoryNoSeats = FacultyDormitoryNoSeats;
