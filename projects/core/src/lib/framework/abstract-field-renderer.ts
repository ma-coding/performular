import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AbstractModel } from '../model/abstract-model';

export abstract class AbstractFieldRenderer {
    protected abstract _createField(): void;

    protected abstract _destroyField(): void;

    protected _init(field: AbstractModel): Subscription {
        return field.hidden$
            .pipe(
                tap((hidden: boolean) => {
                    if (hidden) {
                        this._destroyField();
                    } else {
                        this._createField();
                    }
                })
            )
            .subscribe();
    }

    protected _destroy(subscription: Subscription | undefined): void {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
}
