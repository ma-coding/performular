import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Trigger, TriggerStrategy } from '../../decorators';
import { IOnTrigger } from '../../loaders';
import { FieldSchema } from '../../schemas';

@Trigger({
    id: 'Max',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class MaxTrigger implements IOnTrigger {

    public trigger(field: FieldSchema, params: number): boolean | Observable<boolean> {
        if (typeof params !== 'number') {
            return false;
        }
        if (field.value === null || field.value === undefined || field.value === NaN || field.value > params) {
            return true;
        }
        return false;
    }
}
