import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatRadioChange, ThemePalette } from '@angular/material';

import { Observable } from 'rxjs';

import {
    Abstract,
    BuildContext,
    Control,
    ControlComponent,
    ControlDatasourceHandler,
    IControlDatasourceParams,
    IControlProperty,
    IPerformularOnInit,
    TControl,
} from '@performular/core';

export const PERFORMULAR_FORMCOMPONENT_RADIO: 'matRadio' = 'matRadio';

export interface MatRadioAttrs {
    labelPosition?: 'before' | 'after';
    name?: string;
    color?: ThemePalette;
    buttonDirection?: 'vertical' | 'horizontal';
    options: IControlDatasourceParams;
}

export type MatRadioStyles = 'radio' | 'placeholder';

export class MatRadio extends Control<MatRadioAttrs, MatRadioStyles> {
    public datasource: ControlDatasourceHandler;

    constructor(property: IControlProperty<typeof PERFORMULAR_FORMCOMPONENT_RADIO, MatRadioAttrs>) {
        super(property);
        this.datasource = new ControlDatasourceHandler(property.attrs.options);
    }
}

export function MatRadioBuilder(context: BuildContext<TControl>): Abstract {
    return new MatRadio(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_RADIO,
    builder: MatRadioBuilder
})
@Component({
    selector: 'performular-mat-radio',
    template: `
    <mat-radio-group
        (change)="change($event)"
        [name]="(field?.attrs$ | async)?.name"
        [value]="field?.value"
        [disabled]="field.disabled$ | async"
        [fxLayout]="field?.attrs.buttonDirection === 'vertical' ? 'column' : 'row'">
            <ng-container *ngFor="let option of options | async">
                <mat-radio-button [ngClass]="field?.attrs.buttonDirection === 'vertical' ? 'vertical' : 'horizontal'"
                    *ngIf="!(option.hidden$ | async)"
                    [disabled]="option.disabled$ | async"
                    [color]="(field?.attrs$ | async)?.color"
                    [value]="option.value">
                    <span>{{ option.viewValue }}</span>
                </mat-radio-button>
            </ng-container>
    </mat-radio-group>
    `,
    styles: [`
        :host {
            width: 100%;
            display: block;
        }
        mat-radio-group {
            width: 100%;
            display: block;
            padding-top: 12px;
            padding-bottom: 12px;
        }
        .vertical {
            padding-bottom: 9px;
        }
        .horizontal {
            padding-right: 9px;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformularMatRadioComponent implements IPerformularOnInit<MatRadio> {

    public field: MatRadio = <any>undefined;
    public options: Observable<any[]> = <any>undefined;

    public performularOnInit(field: MatRadio): void {
        this.field = field;
        this.options = this.field.datasource.getData$(this.field);
    }

    public change(event: MatRadioChange): void {
        if (this.field) {
            this.field.setValue(event.value);
        }
    }

}
