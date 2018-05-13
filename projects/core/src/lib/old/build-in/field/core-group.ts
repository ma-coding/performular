import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Schema, SchemaType } from '../../decorators';
import { IOnSchemaInit } from '../../loaders';
import { GroupSchema } from '../../schemas';

@Schema({
    id: 'Group',
    type: SchemaType.Group
})
@Component({
    selector: 'performular-core-goup',
    template: `
    <ng-container *ngFor="let child of group?.children$ | async">
        <ng-container [performularSchema]="child"></ng-container>
    </ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreGroupComponent implements IOnSchemaInit {

    public group: GroupSchema | undefined;

    public onSchemaInit(field: GroupSchema): void {
        this.group = field;
    }
}
