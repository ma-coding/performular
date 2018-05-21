export interface IAbstractProperty<T extends string, F extends string, B extends object> {
    type: T;
    field: F;
    bindings: B;
}
