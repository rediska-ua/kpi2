
interface ISpecification<T> {
    IsSatisfiedBy(candidate: T): boolean;
}

export interface ICompositeSpecification<T> extends ISpecification<T> {
    and(other: ICompositeSpecification<T>): ICompositeSpecification<T>;
    or(other: ICompositeSpecification<T>): ICompositeSpecification<T>;
    not(): ICompositeSpecification<T>;
}

export abstract class CompositeSpecification<T> implements ICompositeSpecification<T> {
    abstract IsSatisfiedBy(candidate: T): boolean;

    and(other: ICompositeSpecification<T>) : ICompositeSpecification<T> {
        return new AndSpecification<T>(this, other);
    }

    or(other: ICompositeSpecification<T>) : ICompositeSpecification<T> {
        return new OrSpecification<T>(this, other);
    }

    not() : ICompositeSpecification<T>{
        return new NotSpecification<T>(this);
    }
}

export class AndSpecification<T> extends CompositeSpecification<T> {
    constructor(public left:ICompositeSpecification<T>, public right:ICompositeSpecification<T>) {
        super()
    }

    IsSatisfiedBy(candidate: T) : boolean {
        return this.left.IsSatisfiedBy(candidate) && this.right.IsSatisfiedBy(candidate);
    }
}

export class OrSpecification<T> extends CompositeSpecification<T> {
    constructor(public left:ICompositeSpecification<T>, public right:ICompositeSpecification<T>) {
        super();
    }

    IsSatisfiedBy(candidate: T) : boolean{
        return this.left.IsSatisfiedBy(candidate) || this.right.IsSatisfiedBy(candidate);
    }
}

export class NotSpecification<T> extends CompositeSpecification<T> {
    constructor(public spec:ICompositeSpecification<T>) {
        super();
    }

    IsSatisfiedBy(candidate: T) : boolean{
        return !this.spec.IsSatisfiedBy(candidate);
    }
}

export class StudentHasBenefits extends CompositeSpecification<any> {

    IsSatisfiedBy(candidate: any): boolean {
        return candidate.hasbenefits === true;
    }
}



export class IsStudentWaiting extends CompositeSpecification<any> {
    IsSatisfiedBy(candidate: any): boolean {
        return candidate.dormitorystatusid === 3;
    }
}




