import { AbstractFieldModel } from '../../../model/abstract-field-model';
import { MaybeObservable } from '../../../util/types/maybe-observable';

export interface DatasourceStrategy {
    loadData(params: any): MaybeObservable<any[]>;
    getValue(data: any, params: any): any;
    getViewValue(data: any, params: any): string;
    isOptionDisabled?(
        field: AbstractFieldModel,
        data: any,
        params: any
    ): boolean;
    isOptionHidden?(field: AbstractFieldModel, data: any, params: any): boolean;
}
