import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Schema, SchemaType } from '../../decorators';
import { IOnSchemaInit } from '../../loaders';
import { LayoutSchema } from '../../schemas';

export interface ICoreFieldset {
    legend?: string;
}

@Schema({
    id: 'Fieldset',
    type: SchemaType.Layout
})
@Component({
    selector: 'performular-core-fieldset',
    template: `
    <fieldset>
        <legend>{{(layout?.bindings$ | async)?.legend}}</legend>
        <ng-container *ngFor="let child of layout?.children$ | async">
            <ng-container [performularSchema]="child"></ng-container>
        </ng-container>
    </fieldset>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreFieldsetComponent implements IOnSchemaInit {

    public layout: LayoutSchema | undefined;

    public onSchemaInit(field: LayoutSchema): void {
        this.layout = field;
    }
}
