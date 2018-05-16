import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IOnTrigger, Trigger, TriggerStrategy } from '../../handler/trigger.handler';
import { AbstractFieldSchema } from '../../schemas/abstract-field.schema';

@Trigger({
    id: 'MinLength',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class MinLengthTrigger implements IOnTrigger {

    public onTrigger(field: AbstractFieldSchema, params: number): boolean | Observable<boolean> {
        if (typeof params !== 'number') {
            return false;
        }
        const value: any = field.get('value');
        const length: number = value ? value.length : 0;
        if (length < params) {
            return true;
        }
        return false;
    }
}
