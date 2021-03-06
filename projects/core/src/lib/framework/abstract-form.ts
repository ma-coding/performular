import { Subscription } from 'rxjs';

import { AbstractModel } from '../model/abstract-model';

export abstract class AbstractForm {
    protected _subscription: Subscription | undefined;
    protected _reactionSubscription: Subscription | undefined;

    protected _init(form: AbstractModel): void {
        this._destory();
        this._subscription = form.updates$.subscribe();
        this._reactionSubscription = form.reactions$.subscribe();
        form.runUpdate(form.all);
    }

    protected _destory(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        if (this._reactionSubscription) {
            this._reactionSubscription.unsubscribe();
        }
    }
}
