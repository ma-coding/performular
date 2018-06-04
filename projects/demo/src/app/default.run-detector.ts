import { IEffectContext, IRunDetector, RunDetector } from '@performular/core';

@RunDetector('default')
export class DefaultRunDetector implements IRunDetector {
    public strategy(context: IEffectContext): boolean {
        return true;
    }
}
