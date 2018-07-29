import { InstanceDef } from '../../../util/types/instance-def';
import { VisibilityExecuter } from './visibility-executer';
import { VisibilityFunction } from './visibility-function';

export type VisibilityTarget =
    | string
    | InstanceDef<VisibilityExecuter>
    | VisibilityFunction;
