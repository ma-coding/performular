import { RunContext } from '../../utils/types/run-context';
import { VisibleResult } from './visible-result';

export type VisibleFunction = (context: RunContext) => VisibleResult;
