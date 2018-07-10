import { TransformFunction } from './transform-function';

export interface TransformObject {
    from: TransformFunction;
    to: TransformFunction;
}
