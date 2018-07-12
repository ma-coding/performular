export interface AbstractRenderer {
    setAttribute(el: any, name: string, value: string): void;
    removeAttribute(el: any, name: string): void;
}
