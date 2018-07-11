import { merge, Observable } from 'rxjs';

import { AbstractField } from '../abstract-field/abstract-field';
import { Value } from '../value/value';
import { GroupFieldOptions } from './types/group-field-options';
import { GroupFieldState } from './types/group-field-state';

export class GroupField extends AbstractField<GroupFieldState> {

    protected _valueApi: Value;

    get children(): AbstractField[] {
        return this._select('children');
    }

    get children$(): Observable<AbstractField[]> {
        return this._select$('children');
    }

    constructor(options: GroupFieldOptions) {
        super(options);
        options.children.forEach((child: AbstractField) => child.setParent(this));
        this._valueApi = new Value({
            initialValue: this._buildValue(options.children),
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
            .filter((child: AbstractField) => child.id in value)
            .forEach((child: AbstractField) => {
                child.setValue(value[child.id]);
            });
    }

    public patchValue(value: any): void {
        this.children
            .filter((child: AbstractField) => child.id in value)
            .forEach((child: AbstractField) => {
                child.patchValue(value[child.id]);
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
        return children.reduce((prev: any, child: AbstractField) => {
            prev[child.id] = child.value;
            return prev;
        }, {});
    }

}
