import { MetadataStore } from '../metadata/metadata-store';
import { CDecorator } from '../utils/types/c-decorator';
import { InstanceDef } from '../utils/types/instance-def';
import { ValidatorExecuter } from './types/validator-executer';
import { ValidatorOptions } from './types/validator-options';

export function Validator(
    options: ValidatorOptions
): CDecorator<InstanceDef<ValidatorExecuter>> {
    return (target: InstanceDef<ValidatorExecuter>): void => {
        MetadataStore.setItem('validators', {
            ...options,
            target: target
        });
    };
}
