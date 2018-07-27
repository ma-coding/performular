import { AbstractHandlerWithFunc } from '../abstract-handler-with-func';
import { DataConnectionStrategy } from './types/data-connection-strategy';
import { DataConnectionOptions } from './types/data-connection-options';
import { DataOption } from './types/data-option';
import { AbstractFieldModel } from '../../model/abstract-field-model';
import { Observable, of } from 'rxjs';
import { makeObservable } from '../../util/make-observable';
import { map, tap, skip } from 'rxjs/operators';

export class DataConnection extends AbstractHandlerWithFunc<
    DataConnectionStrategy,
    any
> {
    public resetInvisibleValue: boolean;

    constructor(options: DataConnectionOptions) {
        super(
            'datasources',
            'loadData',
            options.target,
            ['loadData', 'getValue', 'getViewValue'],
            options.params
        );
        this.resetInvisibleValue = !!options.resetInvisibleValue;
    }

    public getData$(field: AbstractFieldModel): Observable<DataOption[]> {
        return makeObservable(this.instance.loadData(this.params)).pipe(
            map((options: any[]) => {
                return options.map((option: any) => {
                    return {
                        value: this.instance.getValue(option, this.params),
                        viewValue: this.instance.getViewValue(
                            option,
                            this.params
                        ),
                        disabled$: this._getDisabledOption$(field, option),
                        hidden$: this._getHiddenOption$(field, option)
                    };
                });
            })
        );
    }

    private _getDisabledOption$(
        field: AbstractFieldModel,
        option: any
    ): Observable<boolean> {
        return field.rootField.value$.pipe(
            skip(1),
            map(
                () =>
                    this.instance.isOptionDisabled
                        ? this.instance.isOptionDisabled(
                              field,
                              option,
                              this.params
                          )
                        : false
            ),
            tap(this._resetValue(field, option).bind(this))
        );
    }

    private _getHiddenOption$(
        field: AbstractFieldModel,
        option: any
    ): Observable<boolean> {
        return field.rootField.value$.pipe(
            map(
                () =>
                    this.instance.isOptionHidden
                        ? this.instance.isOptionHidden(
                              field,
                              option,
                              this.params
                          )
                        : false
            ),
            tap(this._resetValue(field, option).bind(this))
        );
    }

    private _resetValue(
        field: AbstractFieldModel,
        option: any
    ): (cond: boolean) => void {
        return (cond: boolean): void => {
            if (!this.resetInvisibleValue || !cond) {
                return;
            }
            const isMultiple: boolean = Array.isArray(field.value);
            const values: any[] = isMultiple ? field.value : [field.value];
            const filteredValues: any[] = values.filter(
                (val: any) =>
                    val !== this.instance.getValue(option, this.params)
            );
            if (filteredValues.length !== values.length) {
                field.setValue(isMultiple ? filteredValues : null, true);
            }
        };
    }
}
