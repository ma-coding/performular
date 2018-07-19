import { RunContext } from '../../../util/types/run-context';

export interface RunDetectionStrategy {
    strategy(context: RunContext, params?: any): boolean;
}
