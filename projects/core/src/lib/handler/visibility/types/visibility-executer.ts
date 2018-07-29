import { MaybeObservable } from '../../../util/types/maybe-observable';
import { RunContext } from '../../../util/types/run-context';

export interface VisibilityExecuter {
    execute(
        context: RunContext,
        params: any
    ): MaybeObservable<boolean>;
}
