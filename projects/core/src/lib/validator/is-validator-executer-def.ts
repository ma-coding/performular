import { InstanceDef } from '../../utils/types/instance-def';
import { ValidatorExecuter } from './types/validator-executer';

export function isValidatorExecuterDef(
    value: any
): value is InstanceDef<ValidatorExecuter> {
    return value && value.prototype && 'executeValidator' in value.prototype;
}
