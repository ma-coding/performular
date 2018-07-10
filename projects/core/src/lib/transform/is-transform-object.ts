import { TransformObject } from './types/transform-object';

export function isTransformObject(value: any): value is TransformObject {
    return value && 'to' in value && 'from' in value;
}
