import { IVisible } from './visible.interface';

export interface VisibleType {
    new(...args: any[]): IVisible;
}
