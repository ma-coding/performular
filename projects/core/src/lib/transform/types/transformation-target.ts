import { InstanceDef } from '../../utils/types/instance-def';
import { Transformation } from './transformation';

export type TransformationTarget =
    | string
    | InstanceDef<Transformation>
    | Transformation;
