import { merge, Observable } from 'rxjs';

import { AbstractField } from '../abstract-field/abstract-field';
import { Value } from '../value/value';
import { ListFieldOptions } from './types/list-field-options';
import { ListFieldState } from './types/list-field-state';

export class ListField extends AbstractField<ListFieldState> {

    protected _valueApi: Value;

    get children(): AbstractField[] {
        return this._select('children');
    }

    get children$(): Observable<AbstractField[]> {
        return this._select$('children');
    }

    constructor(options: ListFieldOptions) {
        const children: AbstractField[] = options.values.map(options.childGenerator);
        children.forEach((child: AbstractField) => child.setParent(this));
        super(options);
        // TODO ADD CHILDREN OTHERWISE
        this._updateKey('children', children);
        this._valueApi = new Value({
            initialValue: this._buildValue(children),
            transformer: this._transformer
        });
    }

    public getUpdates$(): Observable<void> {
        return merge(
            this.effectsApi.getUpdates$,
            this.children$
        );
    }

    public setValue(value: any): void {
        this.children
            .forEach((child: AbstractField, index: number) => {
                child.setValue(value[index]);
            });
    }

    public patchValue(value: any): void {
        this.children
            .forEach((child: AbstractField, index: number) => {
                child.patchValue(value[index]);
            });
    }

    public resetValue(): void {
        this.children.forEach((child: AbstractField) => {
            child.resetValue();
        });
    }

    protected _forEachChildren(cb: (child: AbstractField) => void): void {
        this.children.forEach(cb);
    }

    protected _buildValue(children: AbstractField[]): any {
        return children.map((child: AbstractField) => child.value);
    }

}
