import { Observable, of } from 'rxjs';

import { RunContext } from '../../utils/types/run-context';
import { ValueMode } from '../../value/types/value-mode';
import { Abstract } from '../abstract/abstract';

export abstract class AbstractField extends Abstract {
    get childFields(): AbstractField[] {
        return this._getRecursiveChildFields();
    }

    get parentField(): AbstractField | undefined {
        return this._facade.parentField;
    }

    get value(): any {
        return this._facade.value;
    }

    get initialValue(): any {
        return this._facade.initialValue;
    }

    public updateValue(mode: ValueMode, value: any): void {
        this._facade.updateValue(mode, value);
    }

    protected abstract _buildValue(children: AbstractField[]): any;

    protected _onTreeDown(context: RunContext): Observable<void> {
        return of();
    }

    protected _onTreeUp(): void {}

    protected _updateParentValue(
        checklist: AbstractField[] = [this],
        mode: ValueMode
    ): void {
        const parent: AbstractField | undefined = this.parentField;
        if (parent) {
            parent.updateValue(mode, parent._buildValue(parent.childFields));
            parent._updateParentValue([...checklist, parent], mode);
        } else {
            (<any>this._facade.root)._manualUpdates$.next(checklist);
        }
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
}
