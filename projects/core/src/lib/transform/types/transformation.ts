export interface Transformation {
    to(value: any): any;
    from(value: any): any;
}
