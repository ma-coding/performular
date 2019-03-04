import { Action } from './types/action';
import { ActionOptions } from './types/action-options';
import { AbstractHandlerWithFunc } from '../abstract-handler-with-func';
import { isInstance } from '../../util/is-instance';
import { Observable } from 'rxjs';
import { AbstractModel } from '../../model/abstract-model';
import { isFunction } from '../../util/is-function';

export class Effect extends AbstractHandlerWithFunc<Action, Action['action']> {
    constructor(options: ActionOptions) {
        super('actions', 'action', options.target, ['action'], options.params);
    }

    public runEffect(field: AbstractModel): Observable<void> {
        if (isInstance<Action>(this.instance, [this.runKey])) {
            return this.instance.action(field, this.params);
        } else if (isFunction<Action['action']>(this.instance)) {
            return this.instance(field, this.params);
        } else {
            throw new Error('Todo:');
        }
    }
}
