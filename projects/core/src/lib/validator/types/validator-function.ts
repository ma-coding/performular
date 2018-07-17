import { RunContext } from '../../utils/types/run-context';
import { ValidatorResult } from './validator-result';

export type ValidatorFunction = (
    context: RunContext,
    params: any
) => ValidatorResult;
