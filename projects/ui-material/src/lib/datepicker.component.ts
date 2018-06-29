import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ThemePalette } from '@angular/material';

import { Subscription } from 'rxjs';

import {
    Abstract,
    BuildContext,
    Control,
    ControlComponent,
    IControlProperty,
    InputValueHandler,
    IPerformularOnInit,
    TControl,
} from '@performular/core';

import { MatFormField, MatFormFieldAttrs, MatFormFieldStyles, MatFormFieldTemplate } from './form-field';

export const PERFORMULAR_FORMCOMPONENT_MATDATEPICKER: 'matDatepicker' = 'matDatepicker';

export interface MatDatepickerAttrs extends MatFormFieldAttrs {
    readonly?: boolean;
    debounce?: number;
    calendarColor?: ThemePalette;
    calendarDisabled?: boolean;
    buttonDisabled?: boolean;
    opened?: boolean;
    panelClass?: string | string[];
    startAt?: Date | null;
    startView?: 'month' | 'year';
    touchUi?: boolean;
}

export type MatDatepickerStyles = MatFormFieldStyles;

export class MatDatepicker extends Control<MatDatepickerAttrs, MatDatepickerStyles> {
    constructor(params: IControlProperty<any, MatDatepickerAttrs>) {
        super({
            ...params,
            attrs: {
                ...params.attrs,
                startView: params.attrs.startView || 'month'
            }
        });
    }
}

export function MatDatepickerBuilder(context: BuildContext<TControl>): Abstract {
    return new MatDatepicker(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_MATDATEPICKER,
    builder: MatDatepickerBuilder
})
@Component({
    selector: 'performular-mat-datepicker',
    template: MatFormFieldTemplate(`
        <input matInput
        [matDatepicker]="picker"
        [ngStyle]="(field?.styles$ | async)?.control"
        (dateChange)="datepickerValueHandler?.setValue($event.value)"
        [value]="field?.value"
        [placeholder]="(field?.attrs$ | async)?.placeholder"
        [disabled]="field?.disabled$ | async"
        [readonly]="(field?.attrs$ | async)?.readonly">
        <mat-datepicker-toggle matSuffix
            [disabled]="(field?.attrs$ | async)?.buttonDisabled || (field?.disabled$ | async)"
            [for]="picker">
        </mat-datepicker-toggle>
        <mat-datepicker #picker
                   [opened]="(field?.attrs$ | async)?.opened"
                   [startView]="(field?.attrs$ | async)?.startView"
                   [panelClass]="(field?.attrs$ | async)?.panelClass"
                   [touchUi]="(field?.attrs$ | async)?.touchUi"
                   [disabled]="(field?.attrs$ | async)?.calendarDisabled || (field?.disabled$ | async)"
                   [startAt]="(field?.attrs$ | async)?.startAt">
        </mat-datepicker>
        `),
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
        mat-form-field {
            width: 100%;
            display: block;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PerformularMatDatepickerComponent extends MatFormField<MatDatepicker> implements IPerformularOnInit<MatDatepicker>, OnDestroy {
    private _datepickerSub: Subscription | undefined;

    public datepickerValueHandler: InputValueHandler = <any>undefined;

    public performularOnInit(field: MatDatepicker): void {
        super.performularOnInit(field);
        this.datepickerValueHandler = new InputValueHandler('date', field.attrs.debounce || 0);
        this._datepickerSub = this.datepickerValueHandler.valueChanges
            .subscribe((value: any) => {
                if (this.field) {
                    this.field.setValue(value);
                }
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this._datepickerSub) {
            this._datepickerSub.unsubscribe();
        }
    }
}
