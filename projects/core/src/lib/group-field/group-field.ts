import { Observable } from 'rxjs';

import { AbstractField } from '../abstract-field/abstract-field';
import { Value } from '../value/value';
import { GroupFieldOptions } from './types/group-field-options';
import { GroupFieldState } from './types/group-field-state';

export class GroupField extends AbstractField<GroupFieldState> {

    protected _valueState: Value;

    get children(): AbstractField[] {
        return this.select('children');
    }

    get children$(): Observable<AbstractField[]> {
        return this.select$('children');
    }

    constructor(options: GroupFieldOptions) {
        super(options);
        this._valueState = new Value({
            initialValue: this.select('transformer').executeTo(this._buildValue(options.children))
        });
    }

    public forEachChildren(cb: (child: AbstractField<any>) => void): void {
        this.children.forEach((child: AbstractField) => {
            cb(child);
        });
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
