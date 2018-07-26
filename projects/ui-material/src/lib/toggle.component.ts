import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatSlideToggleChange, ThemePalette } from '@angular/material';
import {
    ControlFieldModel,
    ControlFieldModelOptions,
    Model,
    RemoveKey
} from '@performular/core';
import { PerformularModel } from '@performular/ng-common';
import { MaterialCheckbox } from './checkbox.component';

export const PERFORMULAR_MODEL_MATERIALTOGGLE: string =
    'PERFORMULAR_MODEL_MATERIALTOGGLE';

export interface MaterialToggleAttrs {
    ariaLabel?: string;
    ariaLabelledby?: string;
    disableRipple?: boolean;
    placeholder?: string;
    color?: ThemePalette;
    name?: string;
    labelPosition?: 'before' | 'after';
}

export class MaterialToggle extends ControlFieldModel<MaterialToggleAttrs> {
    constructor(
        options: RemoveKey<
            ControlFieldModelOptions<MaterialToggleAttrs>,
            'model'
        >
    ) {
        super({
            ...options,
            model: MaterialToggleComponent
        });
    }
}

export function MaterialToggleBuilder(
    options: ControlFieldModelOptions<MaterialToggleAttrs>
): MaterialToggle {
    return new MaterialToggle(options);
}

@Model({
    name: PERFORMULAR_MODEL_MATERIALTOGGLE,
    builder: MaterialToggleBuilder
})
@Component({
    selector: 'performular-mat-toggle',
    template: `
        <mat-slide-toggle
        [disabled]="(field?.disabled$ | async)"
        [aria-label]="(field?.attrs$ | async)?.ariaLabel"
        [aria-labelledby]="(field?.attrs$ | async)?.ariaLabelledby"
        [disableRipple]="(field?.attrs$ | async)?.disableRipple"
        [color]="(field?.attrs$ | async)?.color"
        [labelPosition]="(field?.attrs$ | async)?.labelPosition"
        [name]="(field?.attrs$ | async)?.name"
        (change)="change($event)"
        [checked]="field?.value$ | async">
            <span>
                {{(field?.attrs$ | async)?.placeholder}}
            </span>
        </mat-slide-toggle>
        `,
    styles: [
        `
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
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialToggleComponent {
    constructor(@Inject(PerformularModel) public field: MaterialCheckbox) {}

    public change(event: MatSlideToggleChange): void {
        this.field.setValue(event.checked);
    }
}
