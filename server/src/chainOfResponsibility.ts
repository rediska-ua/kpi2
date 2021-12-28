export interface Handler {
    setNext(handler: Handler): Handler;
    handle(request: string): string | null;
}

abstract class AbstractHandler implements Handler {

    private nextHandler!: Handler;

    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }

    public handle(request: any): any{
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}


export class FacultyDormitoryHasSeats extends AbstractHandler {
    public handle(request: any): any {

        const { student, facultyDormitories, otherDormitories, freeSeats, studentBenefits } = request;


        for (const dorm of facultyDormitories) {
            if (freeSeats[dorm.dormitoryid - 1] > 0) {
                return { studentid: student.studentid, dormitoryid: dorm.dormitoryid }
            }
        }

        const requestObj = {
            student: student,
            otherDormitories: otherDormitories,
            freeSeats: freeSeats,
            studentBenefits: studentBenefits
        }

        return super.handle(requestObj);
    }
}

export class FacultyDormitoryNoSeats extends AbstractHandler {
    public handle(request: any): any {
        const { student, otherDormitories, freeSeats, studentBenefits } = request;

        if (studentBenefits === true) {
            for (const dorm of otherDormitories) {
                if (freeSeats[dorm.dormitoryid - 1]) {
                    console.log('here')
                    return { studentid: student.studentid, dormitoryid: dorm.dormitoryid }
                }
            }
        }
        return { studentid: student.studentid, dormitoryid: 0};
    }
}

