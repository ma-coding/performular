export abstract class EntityClass {
    public abstract id: string;
    constructor() {}

    public clone(props: any): any {
        const instance: any = Object.create(Object.getPrototypeOf(this));
        Object.assign(instance, this, props);
        return instance;
    }
}
