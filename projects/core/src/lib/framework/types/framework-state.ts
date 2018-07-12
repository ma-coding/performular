import { FrameworkType } from './framework-type';

export interface FrameworkState {
    type: FrameworkType;
    field: any;
    attrs: any;
    instance: any | undefined;
}
