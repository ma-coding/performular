import { InstanceDef } from '../../utils/types/instance-def';
import { ValidatorExecuter } from './validator-executer';
import { ValidatorFunction } from './validator-function';

export type ValidatorTarget =
    | string
    | InstanceDef<ValidatorExecuter>
    | ValidatorFunction;
