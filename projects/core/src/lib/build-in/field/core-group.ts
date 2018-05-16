import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Field, IOnInitField } from '../../handler/field.handler';
import { GroupSchema } from '../../schemas/schemas';

@Field({
    id: 'Group'
})
@Component({
    selector: 'performular-core-goup',
    template: `
    <ng-container *ngFor="let child of group?.get$('children') | async">
        <ng-container [performularSchema]="child"></ng-container>
    </ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreGroupComponent implements IOnInitField {

    public group: GroupSchema<never> | undefined;

    public onInitField(field: GroupSchema<never>): void {
        this.group = field;
    }
}
