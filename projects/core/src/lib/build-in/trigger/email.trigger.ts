import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IOnTrigger, Trigger, TriggerStrategy } from '../../handler/trigger.handler';
import { AbstractFieldSchema } from '../../schemas/abstract-field.schema';

const EMAIL_REGEXP: RegExp =
    // tslint:disable-next-line:max-line-length
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

@Trigger({
    id: 'Email',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class EmailTrigger implements IOnTrigger {

    public onTrigger(field: AbstractFieldSchema, params: number): boolean | Observable<boolean> {
        return !EMAIL_REGEXP.test(field.get('value'));
    }
}
