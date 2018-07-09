import { Type } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Store } from '../../form/store';
import { createObservable } from '../../utils/misc';
import { AbstractField } from '../abstract-field';

export interface IControlDatasource<D = any, P = any> {
    loadData(params: P): D[] | Observable<D[]>;
    getValue(data: D, params: P): any;
    getViewValue(data: D, params: P): string;
    isOptionDisabled?(field: AbstractField, data: D, params: P): boolean;
    isOptionHidden?(field: AbstractField, data: D, params: P): boolean;
}

export type ControlDatasourceType = Type<IControlDatasource>;

export interface IControlDatasourceDecoration {
    name: string;
}

export function ControlDatasource(decoration: IControlDatasourceDecoration): ClassDecorator {
    return (target: Function): void => {
        Store.addControlDatasource(decoration, <ControlDatasourceType>target);
    };
}

export interface IControlDatasourceParams {
    datasource: string;
    params?: any;
    resetInvisibleValue?: boolean;
}

export interface IOption {
    viewValue: string;
    value: any;
    disabled$: BehaviorSubject<boolean>;
    hidden$: BehaviorSubject<boolean>;
}

export class ControlDatasourceHandler {

    private _source: IControlDatasource;
    private _params: any;
    private _resetInvisibleValue: boolean;

    constructor(state: IControlDatasourceParams) {
        this._source = Store.getControlDatasource(state.datasource).instance;
        this._params = state.params;
        this._resetInvisibleValue = state.resetInvisibleValue || false;
    }

    public getData$(field: AbstractField): Observable<{ viewValue: string, value: any }[]> {

        return createObservable(this._source.loadData(this._params)).pipe(
            map((options: any[]) => {
                return options.map((option: any) => {
                    return {
                        value: this._source.getValue(option, this._params),
                        viewValue: this._source.getViewValue(option, this._params),
                        disabled$: this._getDisabledOption$(field, option),
                        hidden$: this._getHiddenOption$(field, option),
                    };
                });
            })
        );
    }

    private _getDisabledOption$(field: AbstractField, option: any): Observable<boolean> {
        return field.rootField.value$.pipe(
            map(() => this._source.isOptionDisabled ? this._source.isOptionDisabled(field, option, this._params) : false),
            tap(this._resetValue(field, option).bind(this))
        );
    }

    private _getHiddenOption$(field: AbstractField, option: any): Observable<boolean> {
        return field.rootField.value$.pipe(
            map(() => this._source.isOptionHidden ? this._source.isOptionHidden(field, option, this._params) : false),
            tap(this._resetValue(field, option).bind(this))
        );
    }

    private _resetValue(field: AbstractField, option: any): (cond: boolean) => void {
        return (cond: boolean): void => {
            if (!this._resetInvisibleValue || !cond) {
                return;
            }
            const isMultiple: boolean = Array.isArray(field.value);
            const values: any[] = isMultiple ? field.value : [field.value];
            const filteredValues: any[] = values.filter((val: any) => val !== this._source.getValue(option, this._params));
            if (filteredValues.length !== values.length) {
                field.setValue(isMultiple ? filteredValues : null, true);
            }
        };
    }
}
