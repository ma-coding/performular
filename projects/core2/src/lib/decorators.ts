import { Metadata } from './metadata';
import { IRunDecoration } from './models/run';
import { ValidatorType } from './models/validation';
import { VisibleType } from './models/visibility';

export function Validator(options: IRunDecoration): ClassDecorator {
    return (target: Function): void => {
        Metadata.addValidator(options, <ValidatorType>target);
    };
}

export function Visible(options: IRunDecoration): ClassDecorator {
    return (target: Function): void => {
        Metadata.addVisible(options, <VisibleType>target);
    };
}
