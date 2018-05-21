import { IField } from './field.interface';

export interface FieldType {
    new(...args: any[]): IField;
}
