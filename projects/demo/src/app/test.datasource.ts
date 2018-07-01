import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { AbstractField, ControlDatasource, IControlDatasource } from '@performular/core';

export interface ITest {
    k: string;
    v: string;
}

@Injectable()
@ControlDatasource({
    name: 'test'
})
export class TestDatasource implements IControlDatasource<ITest> {

    public loadData(params: any): ITest[] | Observable<ITest[]> {
        return of([
            { k: '1', v: '123' },
            { k: '2', v: '1234' },
            { k: '3', v: '12345' },
        ]);
    }

    public getValue(data: ITest, params: any): any {
        return data.v;
    }

    public getViewValue(data: ITest, params: any): string {
        return data.k;
    }

    public isOptionDisabled(field: AbstractField, option: any, params: any): boolean {
        return field.rootField.value.test === 11 && option.k === '2';
    }

    public isOptionHidden(field: AbstractField, option: any, params: any): boolean {
        return field.rootField.value.test === 12 && option.k === '3';
    }
}
