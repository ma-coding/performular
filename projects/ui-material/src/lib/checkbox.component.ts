import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

import { Abstract, BuildContext, Control, ControlComponent, IPerformularOnInit, TControl } from '@performular/core';

export const PERFORMULAR_FORMCOMPONENT_MATCHECKBOX: 'matCheckbox' = 'matCheckbox';

export interface MatCheckboxAttrs {
    labelPosition?: 'before' | 'after';
    name?: string | null;
    placeholder?: string;
    color?: string;
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
