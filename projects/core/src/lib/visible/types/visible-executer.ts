import { RunContext } from '../../utils/types/run-context';
import { VisibleResult } from './visible-result';

export interface VisibleExecuter {
    execute(context: RunContext): VisibleResult;
}
