export interface IStyleSchema<S extends string> {
    styles?: Record<S | 'host', CSSStyleDeclaration>;
}
