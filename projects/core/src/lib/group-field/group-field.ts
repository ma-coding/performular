import { Observable, of } from 'rxjs';

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
        this._valueApi = new Value({
            initialValue: this._buildValue(options.children),
            transformer: this._transformer
        });
    }

    public updated$(): Observable<void> {
        return of(undefined);
    }

    public setValue(value: any): void {
    }

    public patchValue(value: any): void {
    }

    public resetValue(): void {
    }

    protected _buildValue(children?: AbstractField<any>[] | undefined): any {
    }

}
