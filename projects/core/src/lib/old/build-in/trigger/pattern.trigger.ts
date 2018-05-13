import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Trigger, TriggerStrategy } from '../../decorators';
import { IOnTrigger } from '../../loaders';
import { FieldSchema } from '../../schemas';

@Trigger({
    id: 'Pattern',
    strategy: TriggerStrategy.Self
})
@Injectable()
export class PatternTrigger implements IOnTrigger {

    public trigger(field: FieldSchema, params: string | RegExp): boolean | Observable<boolean> {
        if (!params) {
            return false;
        }
        let regex: RegExp;
        let regexStr: string;
        if (typeof params === 'string') {
            regexStr = '';

            if (params.charAt(0) !== '^') {
                regexStr += '^';
            }

            regexStr += params;

            if (params.charAt(params.length - 1) !== '$') {
                regexStr += '$';
            }

            regex = new RegExp(regexStr);
        } else {
            regexStr = params.toString();
            regex = params;
        }
        return !regex.test(field.value);
    }
}
