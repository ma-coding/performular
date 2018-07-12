import { RunContext } from '../../../utils/types/run-context';

export type RunDetectorFunction = (context: RunContext, params: any) => boolean;
