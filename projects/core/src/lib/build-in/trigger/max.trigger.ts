import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IOnTrigger, Trigger, TriggerStrategy } from '../../handler/trigger.handler';
import { AbstractFieldSchema } from '../../schemas/abstract-field.schema';

@Trigger({
    id: 'Max',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class MaxTrigger implements IOnTrigger {

    public onTrigger(field: AbstractFieldSchema, params: number): boolean | Observable<boolean> {
        if (typeof params !== 'number') {
            return false;
        }
        const value: any = field.get('value');
        if (value === null || value === undefined || value === NaN || value > params) {
            return true;
        }
        return false;
    }
}
