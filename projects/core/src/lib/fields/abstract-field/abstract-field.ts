import { Observable, of } from 'rxjs';

import { Effects } from '../../effects/effects';
import { use } from '../../utils/mixin';
import { State } from '../../utils/state';
import { RunContext } from '../../utils/types/run-context';
import { ValueMode } from '../../value/types/value-mode';
import { Value } from '../../value/value';
import { Abstract } from '../abstract/abstract';
import { AbstractFieldOptions } from './types/abstract-field-options';
import { AbstractFieldState } from './types/abstract-field-state';

export interface AbstractField<T extends AbstractFieldState = any> extends Value<T>, Effects<T> { }

export abstract class AbstractField<T extends AbstractFieldState = any> extends Abstract<T> {

    protected abstract _state$: State<T>;
    protected abstract _field: AbstractField;

    @use(Value, Effects) public this?: AbstractField<T>;

    protected _initAbstractField(options: AbstractFieldOptions): AbstractFieldState {
        return {
            ...this._initAbstract(options),
            ...this._initEffects(options),
            ...this._initValue(options)
        };
    }

    protected abstract _buildValue(children: AbstractField[]): any;

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of();
    }

    protected _onTreeUp(): void { }

    protected _updateParentValue(
        checklist: AbstractField[] = [this],
        mode: ValueMode
    ): void {
        const parent: AbstractField | undefined = this.parentField;
        if (parent) {
            parent.updateValue(mode, parent._buildValue(parent.childFields));
            parent._updateParentValue([...checklist, parent], mode);
        } else {
            (<any>this.root)._manualUpdates$.next(checklist);
        }
    }

}
