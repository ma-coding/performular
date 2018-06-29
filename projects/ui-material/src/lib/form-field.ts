import { OnDestroy, ViewChild } from '@angular/core';
import { FloatLabelType, MatFormFieldAppearance, MatInput, MatSelect, ThemePalette } from '@angular/material';

import { Subscription } from 'rxjs';

import { Control, IPerformularOnInit } from '@performular/core';

export const PERFORMULAR_FORMCOMPONENT_MATCHECKBOX: 'matCheckbox' = 'matCheckbox';

export interface MatFormFieldAttrs {
    appearance?: MatFormFieldAppearance;
    color?: ThemePalette;
    floatLabel?: FloatLabelType;
    hideRequiredMarker?: boolean;
    startHintLabel?: string;
    endHintLabel?: string;
    placeholder?: string;
    label?: string;
}

export type MatFormFieldStyles = 'formfield' | 'prefix' | 'suffix' | 'control' | 'hint' | 'error';

export function MatFormFieldTemplate(content: string): string {
    return `
    <mat-form-field
        [color]="(field?.attrs$ | async)?.color"
        [appearance]="(field?.attrs$ | async)?.appearance"
        [floatLabel]="(field?.attrs$ | async)?.floatLabel"
        [hideRequiredMarker]="(field?.attrs$ | async)?.hideRequiredMarker"
        [ngStyle]="(field?.styles$ | async)?.formfield">

        <mat-label>{{(field?.attrs$ | async)?.label}}</mat-label>

        <span matPrefix
            [ngStyle]="(field?.styles$ | async)?.prefix"
            *ngIf="(field?.attrs$ | async)?.prefix as prefix">
            {{prefix}}
        </span>

            ${content}

        <span matSuffix
            [ngStyle]="(field?.styles$ | async)?.suffix"
            *ngIf="(field?.attrs$ | async)?.suffix as suffix">
            {{suffix}}
        </span>

        <mat-hint align="start"
            [ngStyle]="(field?.styles$ | async)?.hint">
            {{(field?.attrs$ | async)?.startHintLabel}}
        </mat-hint>

        <mat-hint align="end"
            [ngStyle]="(field?.styles$ | async)?.hint">
            {{(field?.attrs$ | async)?.endHintLabel}}
        </mat-hint>

        <mat-error
            [ngStyle]="(field?.styles$ | async)?.error"
            *ngFor="let error of field.errors$ | async; let i = index">
            <ng-container *ngIf="i === 0">
                {{error}}
            </ng-container>
        </mat-error>

    </mat-form-field>`;
}

export abstract class MatFormField<F extends Control> implements IPerformularOnInit<F>, OnDestroy {
    private _errorStateSubscription: Subscription | undefined;
    public field: F | undefined;

    @ViewChild(MatInput) public matInput: MatInput | undefined;
    @ViewChild(MatSelect) public matSelect: MatSelect | undefined;

    public performularOnInit(field: F): void {
        this.field = field;
        this._errorStateSubscription = this.field.errorState$.subscribe((errorState: boolean) => {
            if (this.matInput) {
                this.matInput.errorState = errorState;
            }
            if (this.matSelect) {
                this.matSelect.errorState = errorState;
            }
        });
    }

    public ngOnDestroy(): void {
        if (this._errorStateSubscription) {
            this._errorStateSubscription.unsubscribe();
        }
    }

}
