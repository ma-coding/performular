import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormComponent, FormTypes, IList, IOnInitFramework, List } from '@performular/core';

export type CoreListProperty<P extends FormTypes> = IList<'corelist', undefined, '', P>;
export type CoreList = List<'corelist', undefined, ''>;

@FormComponent({
    name: 'corelist'
})
@Component({
    selector: 'app-core-list',
    template: `
    <ng-container *ngFor="let child of list?.children$ | async">
        <ng-container [performularRenderer]="child"></ng-container>
    </ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreListComponent implements IOnInitFramework<CoreList> {

    public list: CoreList | undefined;

    public onInitFramework(field: CoreList): void {
        this.list = field;
    }
}
