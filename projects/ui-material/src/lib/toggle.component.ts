import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSlideToggleChange, ThemePalette } from '@angular/material';

import { Abstract, BuildContext, Control, ControlComponent, IPerformularOnInit, TControl } from '@performular/core';

export const PERFORMULAR_FORMCOMPONENT_MATTOGGLE: 'matToggle' = 'matToggle';

export interface MatToggleAttrs {
    ariaLabel?: string;
    ariaLabelledby?: string;
    disableRipple?: boolean;
    placeholder?: string;
    color?: ThemePalette;
    name?: string;
    labelPosition?: 'before' | 'after';
}

export type MatToggleStyles = 'toggle' | 'placeholder';

export class MatToggle extends Control<MatToggleAttrs, MatToggleStyles> { }

export function MatToggleBuilder(context: BuildContext<TControl>): Abstract {
    return new MatToggle(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_MATTOGGLE,
    builder: MatToggleBuilder
})
@Component({
    selector: 'performular-mat-toggle',
    template: `
        <mat-slide-toggle
        [ngStyle]="(field?.styles$ | async)?.toggle"
        [disabled]="(field?.disabled$ | async)"
        [aria-label]="(field?.attrs$ | async)?.ariaLabel"
        [aria-labelledby]="(field?.attrs$ | async)?.ariaLabelledby"
        [disableRipple]="(field?.attrs$ | async)?.disableRipple"
        [color]="(field?.attrs$ | async)?.color"
        [labelPosition]="(field?.attrs$ | async)?.labelPosition"
        [name]="(field?.attrs$ | async)?.name"
        (change)="change($event)"
        [checked]="field?.value">
            <span [ngStyle]="(field?.styles$ | async)?.placeholder">
                {{(field?.attrs$ | async)?.placeholder}}
            </span>
        </mat-slide-toggle>
        `,
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
        mat-slide-toggle {
            width: 100%;
            display: block;
            padding-top: 12px;
            padding-bottom: 12px;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PerformularMatToggleComponent implements IPerformularOnInit<MatToggle> {

    public field: MatToggle = <any>undefined;

    public performularOnInit(field: MatToggle): void {
        this.field = field;
    }

    public change(event: MatSlideToggleChange): void {
        if (this.field) {
            this.field.setValue(event.checked);
        }
    }
}
