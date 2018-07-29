import { ValidationExecuter } from '../../handler/validation/types/validation-executer';
import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { InstanceDef } from '../../util/types/instance-def';
import { ValidatorOptions } from '../types/validator.options';

export function Validator(
    options: ValidatorOptions
): CDecorator<InstanceDef<ValidationExecuter>> {
    return (target: InstanceDef<ValidationExecuter>): void => {
        Metadata.addItem('validators', {
            ...options,
            target: target
        });
    };
}
