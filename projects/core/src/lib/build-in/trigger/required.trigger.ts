import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Trigger, TriggerStrategy } from '../../decorators';
import { IOnTrigger } from '../../loaders';
import { FieldSchema } from '../../schemas';

@Trigger({
    id: 'Required',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class RequiredTrigger implements IOnTrigger {

    public trigger(field: FieldSchema, data: string): boolean | Observable<boolean> {
        if (field.value === null || field.value === undefined || field.value.length === 0) {
            return true;
        }
        return false;
    }
}
