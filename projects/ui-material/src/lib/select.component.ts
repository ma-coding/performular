import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material';

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

import { MatFormField, MatFormFieldAttrs, MatFormFieldStyles, MatFormFieldTemplate } from './form-field';

export const PERFORMULAR_FORMCOMPONENT_SELECT: 'matSelect' = 'matSelect';

export interface MatSelectAttrs extends MatFormFieldAttrs {
    addNoneValue?: boolean;
    ariaLabel?: string;
    ariaLabelledby?: string;
    disableOptionCentering?: boolean;
    disableRipple?: boolean;
    multiple?: boolean;
    panelClass?: string | string[] | Set<string> | { [key: string]: any };
    options: IControlDatasourceParams;
}

export type MatSelectStyles = MatFormFieldStyles | 'option';

export class MatSelect extends Control<MatSelectAttrs, MatSelectStyles> {
    public datasource: ControlDatasourceHandler;

    constructor(property: IControlProperty<typeof PERFORMULAR_FORMCOMPONENT_SELECT, MatSelectAttrs>) {
        super(property);
        this.datasource = new ControlDatasourceHandler(property.attrs.options);
    }
}

export function MatSelectBuilder(context: BuildContext<TControl>): Abstract {
    return new MatSelect(context.params);
}

@ControlComponent({
    name: PERFORMULAR_FORMCOMPONENT_SELECT,
    builder: MatSelectBuilder
})
@Component({
    selector: 'performular-mat-select',
    template: MatFormFieldTemplate(`
            <mat-select
                (selectionChange)="change($event)"
                [ngStyle]="(field?.styles$ | async)?.control"
                [disabled]="(field?.disabled$ | async)"
                [value]="field?.value"
                [disableOptionCentering]="(field?.attrs$ | async)?.disableOptionCentering"
                [disableRipple]="(field?.attrs$ | async)?.disableRipple"
                [multiple]="(field?.attrs$ | async)?.multiple"
                [panelClass]="(field?.attrs$ | async)?.panelClass"
                [placeholder]="(field?.attrs$ | async)?.placeholder">
                <mat-option *ngIf="(field?.attrs$ | async)?.addNoneValue && !(field?.attrs$ | async)?.multiple">--</mat-option>
                <ng-container *ngFor="let option of options | async">
                    <mat-option
                        *ngIf="!(option.hidden$ | async)"
                        [ngStyle]="(field?.styles$ | async)?.option"
                        [disabled]="option.disabled$ | async"
                        [value]="option.value">
                        <span>{{ option.viewValue }}</span>
                    </mat-option>
                </ng-container>
            </mat-select>
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
export class PerformularMatSelectComponent extends MatFormField<MatSelect> implements IPerformularOnInit<MatSelect>, OnDestroy {

    public options: Observable<any[]> = <any>undefined;

    public performularOnInit(field: MatSelect): void {
        super.performularOnInit(field);
        if (this.field) {
            this.options = this.field.datasource.getData$(this.field);
        }
    }

    public change(event: MatSelectChange): void {
        if (this.field) {
            this.field.setValue(event.value);
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}
