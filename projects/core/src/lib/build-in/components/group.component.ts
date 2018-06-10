import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Abstract, TGroup } from '../../models/abstract';
import { FormComponent, IBuildContext, IOnInitFramework } from '../../models/framework';
import { Group, IGroup } from '../../models/group';
import { FormTypes } from '../../performular';

export const PERFORMULAR_FORMCOMPONENT_GROUP: 'group' = 'group';

export type ICoreGroup<P extends FormTypes> = IGroup<typeof PERFORMULAR_FORMCOMPONENT_GROUP, undefined, '', P>;
export type CoreGroup = Group<typeof PERFORMULAR_FORMCOMPONENT_GROUP, undefined, ''>;

@FormComponent<TGroup>({
    name: PERFORMULAR_FORMCOMPONENT_GROUP,
    builder: (context: IBuildContext<TGroup>): Abstract => {
        return new Group(context.params);
    }
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
export class CoreGroupComponent implements IOnInitFramework<CoreGroup> {

    public group: CoreGroup | undefined;

    public onInitFramework(field: CoreGroup): void {
        this.group = field;
    }
}
