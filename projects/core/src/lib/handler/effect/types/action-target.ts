import { InstanceDef } from '../../../util/types/instance-def';
import { Action } from './action';

export type ActionTarget = InstanceDef<Action> | string | Action['action'];
