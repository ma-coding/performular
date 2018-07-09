import { RunContext } from '../../utils/types/run-context';
import { ValidatorResult } from './validator-result';

export interface ValidatorExecuter {
    execute(context: RunContext): ValidatorResult;
}
