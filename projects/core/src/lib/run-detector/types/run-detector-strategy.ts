import { RunContext } from '../../utils/types/run-context';

export interface RunDetectorStrategy {
    strategy(context: RunContext, params: any): boolean;
}
