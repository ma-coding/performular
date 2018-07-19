import { MaybeObservable } from '../../../util/types/maybe-observable';
import { RunContext } from '../../../util/types/run-context';

export interface ValidationExecuter {
    execute(context: RunContext, params: any): MaybeObservable<any>;
}
