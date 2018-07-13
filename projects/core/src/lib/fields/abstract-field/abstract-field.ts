import { Observable, of } from 'rxjs';

import { Effects } from '../../effects/effects';
import { use } from '../../utils/mixin';
import { State } from '../../utils/state';
import { RunContext } from '../../utils/types/run-context';
import { ValueMode } from '../../value/types/value-mode';
import { ValueState } from '../../value/types/value-state';
import { Value } from '../../value/value';
import { Abstract } from '../abstract/abstract';
import { AbstractFieldOptions } from './types/abstract-field-options';
import { AbstractFieldState } from './types/abstract-field-state';

export interface AbstractField<T extends AbstractFieldState = any>
    extends Value<T>,
        Effects<T> {}

export abstract class AbstractField<
    T extends AbstractFieldState = any
> extends Abstract<T> {
    protected abstract _state$: State<T>;

    @use(Value, Effects)
    public this?: AbstractField<T>;

    get childFields(): AbstractField[] {
        return this._getRecursiveChildFields();
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

    protected _initAbstractField(
        options: AbstractFieldOptions
    ): AbstractFieldState {
        return {
            ...this._initAbstract(options),
            ...this._initEffects(options),
            ...(<ValueState>{})
        };
    }

    protected abstract _buildValue(children: AbstractField[]): any;

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(); // Todo: add right actions
    }

    protected _onTreeUp(): void {
        // Todo: add right actions
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
