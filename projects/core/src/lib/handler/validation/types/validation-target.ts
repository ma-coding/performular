import { InstanceDef } from '../../../util/types/instance-def';
import { ValidationExecuter } from './validation-executer';
import { ValidationFunction } from './validation-function';

export type ValidationTarget =
    | string
    | InstanceDef<ValidationExecuter>
    | ValidationFunction;
