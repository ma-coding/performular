import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormComponent, FormTypes, Group, IGroup, IOnInitFramework } from '@performular/core';

export type CoreGroupProperty<P extends FormTypes> = IGroup<'coregroup', undefined, '', P>;
export type CoreGroup = Group<'coregroup', undefined, ''>;

@FormComponent({
    name: 'coregroup'
})
@Component({
    selector: 'app-core-goup',
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
