import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatSliderChange, ThemePalette } from '@angular/material';
import {
    ControlFieldModel,
    ControlFieldModelOptions,
    Model,
    RemoveKey
} from '@performular/core';
import { PerformularModel } from '@performular/ng-common';
import { MaterialCheckbox } from './checkbox.component';

export const PERFORMULAR_MODEL_MATERIALSLIDER: string =
    'PERFORMULAR_MODEL_MATERIALSLIDER';

export interface MaterialSliderAttrs {
    color?: ThemePalette;
    thumbLabel?: boolean;
    invert?: boolean;
    step?: number;
    tickInterval?: 'auto' | number;
    vertical?: boolean;
    max: number;
    min: number;
}

export class MaterialSlider extends ControlFieldModel<MaterialSliderAttrs> {
    constructor(
        options: RemoveKey<
            ControlFieldModelOptions<MaterialSliderAttrs>,
            'model'
        >
    ) {
        super({
            ...options,
            model: MaterialSliderComponent
        });
    }
}

export function MaterialSliderBuilder(
    options: ControlFieldModelOptions<MaterialSliderAttrs>
): MaterialSlider {
    return new MaterialSlider(options);
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALSLIDER,
    builder: MaterialSliderBuilder
})
@Component({
    selector: 'performular-material-slider',
    template: `
        <mat-slider
            [disabled]="(field?.disabled$ | async)"
            [invert]="(field?.attrs$ | async)?.invert"
            [max]="(field?.attrs$ | async)?.max"
            [min]="(field?.attrs$ | async)?.min"
            [step]="(field?.attrs$ | async)?.step"
            [thumbLabel]="(field?.attrs$ | async)?.thumbLabel"
            [tickInterval]="(field?.attrs$ | async)?.tickInterval"
            [value]="field.value$ | async"
            [vertical]="(field?.attrs$ | async)?.vertical"
            (change)="change($event)">
        </mat-slider>
        `,
    styles: [
        `
            :host {
                width: 100%;
                display: block;
            }
            mat-slider {
                width: 100%;
                display: block;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialSliderComponent {
    constructor(@Inject(PerformularModel) public field: MaterialCheckbox) {}

    public change(event: MatSliderChange): void {
        this.field.setValue(event.value);
    }
}
