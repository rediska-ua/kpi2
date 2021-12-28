"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsStudentWaiting = exports.StudentHasBenefits = exports.NotSpecification = exports.OrSpecification = exports.AndSpecification = exports.CompositeSpecification = void 0;
class CompositeSpecification {
    and(other) {
        return new AndSpecification(this, other);
    }
    or(other) {
        return new OrSpecification(this, other);
    }
    not() {
        return new NotSpecification(this);
    }
}
exports.CompositeSpecification = CompositeSpecification;
class AndSpecification extends CompositeSpecification {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    IsSatisfiedBy(candidate) {
        return this.left.IsSatisfiedBy(candidate) && this.right.IsSatisfiedBy(candidate);
    }
}
exports.AndSpecification = AndSpecification;
class OrSpecification extends CompositeSpecification {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    IsSatisfiedBy(candidate) {
        return this.left.IsSatisfiedBy(candidate) || this.right.IsSatisfiedBy(candidate);
    }
}
exports.OrSpecification = OrSpecification;
class NotSpecification extends CompositeSpecification {
    constructor(spec) {
        super();
        this.spec = spec;
    }
    IsSatisfiedBy(candidate) {
        return !this.spec.IsSatisfiedBy(candidate);
    }
}
exports.NotSpecification = NotSpecification;
class StudentHasBenefits extends CompositeSpecification {
    IsSatisfiedBy(candidate) {
        return candidate.hasbenefits === true;
    }
}
exports.StudentHasBenefits = StudentHasBenefits;
class IsStudentWaiting extends CompositeSpecification {
    IsSatisfiedBy(candidate) {
        return candidate.dormitorystatusid === 3;
    }
}
exports.IsStudentWaiting = IsStudentWaiting;
