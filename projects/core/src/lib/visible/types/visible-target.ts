import { InstanceDef } from '../../../utils/types/instance-def';
import { VisibleExecuter } from './visible-executer';
import { VisibleFunction } from './visible-function';

export type VisibleTarget =
    | string
    | InstanceDef<VisibleExecuter>
    | VisibleFunction;
