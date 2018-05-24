
export interface IViewScales<T> {
    main: T;
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    gtXs?: T;
    gtSm?: T;
    gtMd?: T;
    gtLg?: T;
    ltSm?: T;
    ltMd?: T;
    ltLg?: T;
    ltXl?: T;
}

export interface MapType<T> {
    [key: string]: T;
}

export type Constructable<T = any, A = any> = new (args: A) => T;
