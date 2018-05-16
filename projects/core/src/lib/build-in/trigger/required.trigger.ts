import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IOnTrigger, Trigger, TriggerStrategy } from '../../handler/trigger.handler';
import { AbstractFieldSchema } from '../../schemas/abstract-field.schema';

@Trigger({
    id: 'Required',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class RequiredTrigger implements IOnTrigger {

    public onTrigger(field: AbstractFieldSchema, data: string): boolean | Observable<boolean> {
        const value: any = field.get('value');
        if (value === null || value === undefined || value.length === 0) {
            return true;
        }
        return false;
    }
}
