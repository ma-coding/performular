import {
    DataConnectionStrategy,
    MaybeObservable,
    Datasource,
    AbstractFieldModel
} from '@performular/core';

@Datasource({
    name: 'TEST_DATASOURCE'
})
export class TestDatasource implements DataConnectionStrategy {
    public loadData(params: any): MaybeObservable<any[]> {
        return [
            { id: 1, value: 'test1' },
            { id: 2, value: 'test2' },
            { id: 3, value: 'test3' },
            { id: 4, value: 'test4' }
        ];
    }

    public getValue(data: any, params: any): any {
        return data.id;
    }

    public getViewValue(data: any, params: any): string {
        return data.value;
    }

    public isOptionDisabled(
        field: AbstractFieldModel,
        data: any,
        params: any
    ): boolean {
        return field.rootField.value.checkbox && data.id > 2;
    }
}
