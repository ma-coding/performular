import { Transformation } from './types/transformation';

export function isTransformation(value: any): value is Transformation {
    return value && 'to' in value && 'from' in value;
}
