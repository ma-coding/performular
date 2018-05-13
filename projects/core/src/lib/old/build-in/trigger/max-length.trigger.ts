import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Trigger, TriggerStrategy } from '../../decorators';
import { IOnTrigger } from '../../loaders';
import { FieldSchema } from '../../schemas';

@Trigger({
    id: 'MaxLength',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class MaxLengthTrigger implements IOnTrigger {

    public trigger(field: FieldSchema, params: number): boolean | Observable<boolean> {
        if (typeof params !== 'number') {
            return false;
        }
        const length: number = field.value ? field.value.length : 0;
        if (length > params) {
            return true;
        }
        return false;
    }
}
