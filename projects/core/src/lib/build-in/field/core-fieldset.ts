import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Field, IOnInitField } from '../../handler/field.handler';
import { LayoutSchema } from '../../schemas/schemas';

export interface ICoreFieldset {
    legend?: string;
}

@Field({
    id: 'Fieldset'
})
@Component({
    selector: 'performular-core-fieldset',
    template: `
    <fieldset>
        <legend>{{(layout?.get$('bindings') | async)?.legend}}</legend>
        <ng-container *ngFor="let child of layout?.get$('children') | async">
            <ng-container [performularSchema]="child"></ng-container>
        </ng-container>
    </fieldset>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreFieldsetComponent implements IOnInitField {

    public layout: LayoutSchema<ICoreFieldset> | undefined;

    public onInitField(field: LayoutSchema<ICoreFieldset>): void {
        this.layout = field;
    }
}
