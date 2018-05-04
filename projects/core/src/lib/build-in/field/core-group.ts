import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IOnInitField } from '../../core/loaders/component-loader';
import { RemoveKeys } from '../../core/misc/remove-keys';
import { FormField } from '../../decorators/field.decorator';
import { GroupField, IGroupFieldInitState } from '../../fields/group-field';

@FormField({
    key: 'CORE_GROUP'
})
@Component({
    selector: 'performular-core-goup',
    template: `
    <ng-container *ngFor="let child of group?.children$ | async">
        <ng-container performularField [field]="child"></ng-container>
    </ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreGroupComponent implements IOnInitField<CoreGroup> {

    public group: CoreGroup | undefined;

    public performularOnInit(field: CoreGroup): void {
        this.group = field;
    }
}

export type ICoreGroup = RemoveKeys<IGroupFieldInitState<undefined>, 'component' | 'bindings'>;

export class CoreGroup extends GroupField<undefined> {
    constructor(initial: ICoreGroup) {
        super({
            ...initial,
            bindings: undefined,
            component: CoreGroupComponent
        });
    }
}
