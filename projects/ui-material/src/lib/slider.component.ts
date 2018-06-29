import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSliderChange, ThemePalette } from '@angular/material';

import { Abstract, BuildContext, Control, ControlComponent, IPerformularOnInit, TControl } from '@performular/core';

export const PERFORMULAR_FORMCOMPONENT_MATSLIDER: 'matSlider' = 'matSlider';

export interface MatSliderAttrs {
    color?: ThemePalette;
    thumbLabel?: boolean;
    invert?: boolean;
    step?: number;
    tickInterval?: 'auto' | number;
    vertical?: boolean;
    max: number;
    min: number;
}

export type MatSliderStyles = 'slider';

export class MatSlider extends Control<MatSliderAttrs, MatSliderStyles> { }

export function MatSliderBuilder(context: BuildContext<TControl>): Abstract {
    return new MatSlider(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_MATSLIDER,
    builder: MatSliderBuilder
})
@Component({
    selector: 'performular-mat-slider',
    template: `
        <mat-slider
            [ngStyle]="(field?.styles$ | async)?.slider"
            [disabled]="(field?.disabled$ | async)"
            [invert]="(field?.attrs$ | async)?.invert"
            [max]="(field?.attrs$ | async)?.max"
            [min]="(field?.attrs$ | async)?.min"
            [step]="(field?.attrs$ | async)?.step"
            [thumbLabel]="(field?.attrs$ | async)?.thumbLabel"
            [tickInterval]="(field?.attrs$ | async)?.tickInterval"
            [value]="field.value"
            [vertical]="(field?.attrs$ | async)?.vertical"
            (change)="change($event)">
        </mat-slider>
        `,
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
        mat-slider {
            width: 100%;
            display: block;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PerformularMatSliderComponent implements IPerformularOnInit<MatSlider> {

    public field: MatSlider = <any>undefined;

    public performularOnInit(field: MatSlider): void {
        this.field = field;
    }

    public change(event: MatSliderChange): void {
        if (this.field) {
            this.field.setValue(event.value);
        }
    }
}
