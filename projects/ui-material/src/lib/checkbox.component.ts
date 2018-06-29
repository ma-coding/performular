import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCheckboxChange, ThemePalette } from '@angular/material';

import { Abstract, BuildContext, Control, ControlComponent, IPerformularOnInit, TControl } from '@performular/core';

export const PERFORMULAR_FORMCOMPONENT_MATCHECKBOX: 'matCheckbox' = 'matCheckbox';

export interface MatCheckboxAttrs {
    ariaLabel?: string;
    ariaLabelledby?: string;
    disableRipple?: boolean;
    labelPosition?: 'before' | 'after';
    name?: string | null;
    placeholder?: string;
    color?: ThemePalette;
}

export type MatCheckboxStyles = 'checkbox' | 'placeholder';

export class MatCheckbox extends Control<MatCheckboxAttrs, MatCheckboxStyles> { }

export function MatCheckboxBuilder(context: BuildContext<TControl>): Abstract {
    return new MatCheckbox(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_MATCHECKBOX,
    builder: MatCheckboxBuilder
})
@Component({
    selector: 'performular-mat-checkbox',
    template: `<mat-checkbox
    [ngStyle]="(field?.styles$ | async)?.checkbox"
    [disabled]="(field?.disabled$ | async)"
    [aria-label]="(field?.attrs$ | async)?.ariaLabel"
    [aria-labelledby]="(field?.attrs$ | async)?.ariaLabelledby"
    [disableRipple]="(field?.attrs$ | async)?.disableRipple"
    [color]="(field?.attrs$ | async)?.color"
    [labelPosition]="(field?.attrs$ | async)?.labelPosition"
    [name]="(field?.attrs$ | async)?.name"
    (change)="change($event)"
    [value]="field?.value"
    [checked]="field?.value">
        <span
            [ngStyle]="(field?.styles$ | async)?.placeholder">
            {{(field?.attrs$ | async)?.placeholder}}
        </span>
</mat-checkbox>`,
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
        mat-checkbox {
            width: 100%;
            display: block;
            padding-top: 12px;
            padding-bottom: 12px;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PerformularMatCheckboxComponent implements IPerformularOnInit<MatCheckbox> {

    public field: MatCheckbox = <any>undefined;

    public performularOnInit(field: MatCheckbox): void {
        this.field = field;
    }

    public change(event: MatCheckboxChange): void {
        if (this.field) {
            this.field.setValue(event.checked);
        }
    }
}
