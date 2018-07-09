import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Abstract, TGroup } from '../../models/abstract';
import { BuildContext, GroupComponent, IPerformularOnInit } from '../../models/framework/decorator';
import { Group } from '../../models/group';

export const PERFORMULAR_FORMCOMPONENT_GROUP: 'group' = 'group';

export type CoreGroup = Group<any, ''>;

export function GroupBuilder(context: BuildContext<TGroup>): Abstract {
    return new Group(context.params);
}

@GroupComponent({
    name: PERFORMULAR_FORMCOMPONENT_GROUP,
    builder: GroupBuilder
})
@Component({
    selector: 'performular-group',
    template: `
    <ng-container *ngFor="let child of group?.children$ | async">
        <ng-container [performularRenderer]="child"></ng-container>
    </ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreGroupComponent implements IPerformularOnInit<CoreGroup> {

    public group: CoreGroup | undefined;

    public performularOnInit(field: CoreGroup): void {
        this.group = field;
    }
}
