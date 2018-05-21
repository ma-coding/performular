import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { IEffectContext } from './models/effect-context.interface';

export abstract class EffectState<StateType, ResType> extends BehaviorSubject<StateType> {

    public structureChange: Subject<void>;

    constructor(state: StateType) {
        super(state);
        this.structureChange = new Subject();
    }

    public abstract run(context: IEffectContext): Observable<void>;

    protected abstract _updateState(newResults: { [name: string]: ResType | undefined }): void;

    protected _convertResult(results: (undefined | ResType)[]): { [name: string]: ResType | undefined } {
        return results.reduce((prev: {}, current: undefined | ResType) => {
            if (current) {
                prev[(<any>current).name] = current;
            }
            return prev;
        }, {});
    }

    protected _mergeResults(newResults: { [name: string]: ResType | undefined }): { [name: string]: ResType | undefined } {
        return {
            ...(<any>this.getValue()).results,
            ...newResults
        };
    }

}
