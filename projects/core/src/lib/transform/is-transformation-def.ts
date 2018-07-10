import { InstanceDef } from '../utils/types/instance-def';
import { Transformation } from './types/transformation';

export function isTransformationDef(
    value: any
): value is InstanceDef<Transformation> {
    return (
        value &&
        value.prototype &&
        'to' in value.prototype &&
        'from' in value.prototype
    );
}
