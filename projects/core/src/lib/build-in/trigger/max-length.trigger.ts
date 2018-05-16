import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IOnTrigger, Trigger, TriggerStrategy } from '../../handler/trigger.handler';
import { AbstractFieldSchema } from '../../schemas/abstract-field.schema';

@Trigger({
    id: 'MaxLength',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class MaxLengthTrigger implements IOnTrigger {

    public onTrigger(field: AbstractFieldSchema, params: number): boolean | Observable<boolean> {
        if (typeof params !== 'number') {
            return false;
        }
        const length: number = field.get('value') ? field.get('value').length : 0;
        if (length > params) {
            return true;
        }
        return false;
    }
}
