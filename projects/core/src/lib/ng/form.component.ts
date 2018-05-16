import { ChangeDetectionStrategy, Component, Input, NgZone, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AbstractSchema } from '../schemas/abstract.schema';

@Component({
    selector: 'performular-form',
    template: '<ng-container [performularSchema]="field"></ng-container>',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnDestroy {

    private _field: AbstractSchema | undefined;
    private _updateSubscription: Subscription | undefined;

    constructor(private _zone: NgZone) { }

    @Input()
    set form(field: AbstractSchema) {
        if (!field) {
            return;
        }
        this._onSetField(field);
    }

    get field(): AbstractSchema | undefined {
        return this._field;
    }

    public ngOnDestroy(): void {
        this._destroyField();
    }

    private _onSetField(field: AbstractSchema): void {
        this._destroyField();
        this._field = field;
        this._updateSubscription = this._field.updates$.subscribe();
        this._field.update(
            this._field.getChildListRecursive().map((f: AbstractSchema) => f.get('uuid'))
        );
    }

    private _destroyField(): void {
        if (this._updateSubscription) {
            this._updateSubscription.unsubscribe();
        }
    }
}
