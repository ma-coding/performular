import { ChangeDetectionStrategy, Component, Input, NgZone, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AbstractSchema } from '../core/schemas/abstract/abstract-schema';

@Component({
    selector: 'performular-form',
    template: '<ng-container performularField [field]="field"></ng-container>',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnDestroy {

    private _field: AbstractSchema<any> | undefined;
    private _updateSubscription: Subscription | undefined;

    constructor(private _zone: NgZone) { }

    @Input()
    set form(field: AbstractSchema<any>) {
        if (!field) {
            return;
        }
        this._onSetField(field);
    }

    get field(): AbstractSchema<any> | undefined {
        return this._field;
    }

    public ngOnDestroy(): void {
        this._destroyField();
    }

    private _onSetField(field: AbstractSchema<any>): void {
        this._destroyField();
        this._field = field;
        this._updateSubscription = this._field.updates$.subscribe();
        (this._field as any)._updateSubject.next(
            this._field.getChildListRecursive().map((f: AbstractSchema<any>) => f.uuid)
        );
    }

    private _destroyField(): void {
        if (this._updateSubscription) {
            this._updateSubscription.unsubscribe();
        }
    }
}
