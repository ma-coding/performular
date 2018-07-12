import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataStore } from '../factory/metadata/metadata-store';
import { MergeTarget } from '../factory/metadata/types/merge-target';
import { RunDetection } from '../run-detection/run-detection';
import { isFunction } from '../utils/is-function';
import { isString } from '../utils/is-string';
import { makeObservable } from '../utils/make-observable';
import { InstanceDef } from '../utils/types/instance-def';
import { RunContext } from '../utils/types/run-context';
import { isVisibleExecuter } from '../visible/is-visible-executer';
import { isVisibleExecuterDef } from '../visible/is-visible-executer-def';
import { VisibleExecuter } from '../visible/types/visible-executer';
import { VisibleFunction } from '../visible/types/visible-function';
import { VisibleOptions } from '../visible/types/visible-options';
import { VisibleResult } from '../visible/types/visible-result';
import { VisibilityOptions } from './types/visibility-options';

export class Visibility {
    public runDetection: RunDetection | undefined;
    public target: VisibleExecuter | VisibleFunction;
    public params: any;
    public result: boolean | undefined;

    constructor(options: VisibilityOptions) {
        this.params = options.params;
        if (isString(options.target)) {
            const metadata: MergeTarget<
                VisibleOptions,
                InstanceDef<VisibleExecuter>
            > = MetadataStore.getItem('visibles', options.target);
            this._setRunDetection(options);
            this.target = MetadataStore.getInjector().createInstance(
                metadata.target
            );
            return;
        } else if (isVisibleExecuterDef(options.target)) {
            this._setRunDetection(options);
            this.target = MetadataStore.getInjector().createInstance(
                options.target
            );
            return;
        } else if (isFunction<VisibleFunction>(options.target)) {
            this._setRunDetection(options);
            this.target = options.target;
            return;
        }
        throw new Error('');
    }

    public evaluate(context: RunContext): Observable<void> {
        if (
            (this.runDetection && this.runDetection.evaluate(context)) ||
            !this.runDetection
        ) {
            return makeObservable(this._runVisible(context)).pipe(
                map(this._mapResult.bind(this))
            );
        } else {
            return of(undefined);
        }
    }

    private _setRunDetection(options: VisibilityOptions): void {
        if (options.runDetection) {
            this.runDetection = new RunDetection(options.runDetection);
        }
    }

    private _mapResult(result: boolean): void {
        this.result = result;
    }

    private _runVisible(context: RunContext): VisibleResult {
        if (isVisibleExecuter(this.target)) {
            return this.target.executeVisible(context, this.params);
        } else if (isFunction<VisibleFunction>(this.target)) {
            return this.target(context, this.params);
        }
        throw new Error('');
    }
}
