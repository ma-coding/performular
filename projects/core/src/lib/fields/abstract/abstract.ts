import { forkJoin, merge, Observable, Subject } from 'rxjs';
import { buffer, concatMap, debounceTime, map } from 'rxjs/operators';

import { Facade } from '../../facade/facade';
import { flatten } from '../../utils/flatten';
import { RunContext } from '../../utils/types/run-context';

export abstract class Abstract {
    protected abstract _facade: Facade;
    protected _manualUpdates$: Subject<Abstract[]> = new Subject();

    get id(): string {
        return this._facade.id;
    }

    get all(): Abstract[] {
        return [
            this,
            ...flatten(this.children.map((c: Abstract) => c.all))
        ];
    }

    get root(): Abstract {
        let field: Abstract | undefined = this;
        while (field.parent) {
            field = field.parent;
        }
        return field;
    }

    get parent(): Abstract | undefined {
        return this._facade.parent;
    }

    get children(): Abstract[] {
        return this._facade.children;
    }

    get updates$(): Observable<void> {
        return this._getUpdates$();
    }

    public setParent(parent: Abstract): void {
        this._facade.setParent(parent);
    }

    protected abstract _onTreeDown(context: RunContext): Observable<void>;
    protected abstract _onTreeUp(): void;

    private _treeUp(): void {
        this._onTreeUp();
        const p: Abstract | undefined = this._facade.parent;
        if (p) {
            p._treeUp();
        }
    }

    private _treeDown(checkedFields: Abstract[]): Observable<void> {
        const context: RunContext = this._buildRunContext(checkedFields);
        const children: Abstract[] = this._facade.children;
        if (children.length === 0) {
            return this._onTreeDown(context).pipe(map(() => this._treeUp()));
        }
        return this._onTreeDown(context).pipe(
            concatMap(() =>
                forkJoin(
                    ...children.map((c: Abstract) => c._treeDown(checkedFields))
                )
            )
        );
    }

    private _buildRunContext(checkedFields: Abstract[]): RunContext {
        return {
            checkedFields: checkedFields,
            checked: checkedFields.indexOf(this) >= 0,
            field: this
        };
    }

    private _getUpdates$(): Observable<void> {
        return this._getUpdateHandler(
            merge(
                ...this.root.all.map((c: Abstract) => c._getUpdateWhen()),
                this.root._manualUpdates$
            )
        );
    }

    private _getUpdateWhen(): Observable<Abstract[]> {
        return merge(
            this._facade.validations$,
            this._facade.visibilities$,
            this._facade.forcedDisable$,
            this._facade.forcedError$,
            this._facade.forcedHidden$
            // Todo: Maybe add more at the end
        ).pipe(map(() => [this]));
    }

    private _getUpdateHandler(obs: Observable<Abstract[]>): Observable<void> {
        return obs.pipe(
            buffer(obs.pipe(debounceTime(200))),
            map(flatten),
            concatMap((checkList: Abstract[]) => this._treeDown(checkList))
        );
    }
}
