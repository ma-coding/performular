import { VisibleExecuter } from './types/visible-executer';

export function isVisibleExecuter(value: any): value is VisibleExecuter {
    return value && 'execute' in value;
}
