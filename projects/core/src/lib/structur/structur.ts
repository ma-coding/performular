import { forkJoin, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { AbstractField } from '../fields/abstract-field/abstract-field';
import { Abstract } from '../fields/abstract/abstract';
import { flatten } from '../utils/flatten';
import { State } from '../utils/state';
import { RunContext } from '../utils/types/run-context';
import { StructurOptions } from './types/structur-options';
import { StructurState } from './types/structur-state';

export abstract class Structur<T extends StructurState> {
    protected abstract _state$: State<T>;
    protected abstract _field: Abstract;

    get parent(): Abstract | undefined {
        return this._state$.select('parent');
    }

    get root(): Abstract {
        let field: Abstract = this._field;
        while (field.parent) {
            field = field.parent;
        }
        return field;
    }

    get parentField(): AbstractField | undefined {
        let field: Abstract | undefined = this.parent;
        while (field) {
            if (field instanceof AbstractField) {
                return field;
            }
            field = field.parent;
        }
        return undefined;
    }

    get all(): Abstract[] {
        return [
            this._field,
            ...flatten(this.children.map((child: Abstract) => child.all))
        ];
    }

    get children(): Abstract[] {
        return this._state$.select('children');
    }

    get childFields(): AbstractField[] {
        return this._getRecursiveChildFields();
    }

    public setParent(parent: Abstract): void {
        this._state$.updateKey('parent', parent);
    }

    protected _getRecursiveChildFields(
        children: Abstract[] = this.children
    ): AbstractField[] {
        const erg: AbstractField[] = [];
        children.forEach((child: Abstract) => {
            if (child instanceof AbstractField) {
                erg.push(child);
            } else {
                erg.push(...this._getRecursiveChildFields(child.children));
            }
        });
        return erg;
    }

    protected _initStructur(options: StructurOptions): StructurState {
        return {
            ...options,
            parent: undefined
        };
    }

    protected abstract _onTreeDown(context: RunContext): Observable<void>;
    protected abstract _onTreeUp(): void;

    protected _treeUp(): void {
        this._onTreeUp();
        const p: Abstract | undefined = this.parent;
        if (p) {
            p._treeUp();
        }
    }

    protected _treeDown(checkedFields: Abstract[]): Observable<void> {
        const context: RunContext = this._buildRunContext(checkedFields);
        const children: Abstract[] = this.children;
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
            checked: checkedFields.indexOf(this._field) >= 0,
            field: this._field
        };
    }
}
