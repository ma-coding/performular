import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Schema, SchemaType } from '../../decorators';
import { IOnSchemaInit } from '../../loaders';
import { ControlSchema } from '../../schemas';

export interface ICoreTextarea {
    placeholder?: string;
    cols?: number;
    rows?: number;
    readonly?: boolean;
}

@Schema({
    id: 'Textarea',
    type: SchemaType.Control
})
@Component({
    selector: 'performular-core-textarea',
    template: `
        <textarea
            [id]="control?.id$ | async"
            [performularAutoFocus]="control?.focus$ | async"
            [value]="control?.value$ | async"
            [disabled]="control?.disabled$ | async"
            [placeholder]="(control?.bindings$ | async)?.placeholder"
            [cols]="(control?.bindings$ | async)?.cols"
            [rows]="(control?.bindings$ | async)?.rows"
            [readonly]="(control?.bindings$ | async)?.readonly"
            (input)="onInput($event)"></textarea>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTextareaComponent implements IOnSchemaInit, OnDestroy {

    private _valueChanged$: Subject<any> = new Subject();
    private _valueChangedSubscription: Subscription | undefined;
    public control: ControlSchema | undefined;

    constructor() {
        this._valueChangedSubscription = this._valueChanged$.pipe(
            // tslint:disable-next-line:no-magic-numbers
            debounceTime(200)
        ).subscribe((value: any) => this.control ? this.control.setValue(value) : null);
    }

    public onSchemaInit(control: ControlSchema): void {
        this.control = control;
    }

    public ngOnDestroy(): void {
        if (this._valueChangedSubscription) {
            this._valueChangedSubscription.unsubscribe();
        }
    }

    public onInput(event: KeyboardEvent): void {
        const newValue: any = (<any>event.target).value;
        this._valueChanged$.next(newValue);
    }
}
