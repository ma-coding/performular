import { RunContext } from '../../../utils/types/run-context';
import { VisibleResult } from './visible-result';

export interface VisibleExecuter {
    executeVisible(context: RunContext, params: any): VisibleResult;
}
