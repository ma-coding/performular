import { Subscription } from 'rxjs';

import { AbstractModel } from '../model/abstract-model';

export abstract class AbstractForm {
    protected _init(form: AbstractModel): Subscription {
        const subscription: Subscription = form.updates$.subscribe();
        form.runUpdate(form.all);
        return subscription;
    }

    protected _destory(subscription: Subscription | undefined): void {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
}
