import {
    Component,
    Input,
    OnDestroy,
    ContentChildren,
    QueryList
} from '@angular/core';

import { Subscription } from 'rxjs';

import { AbstractForm, AbstractModel } from '@performular/core';
import { TemplateService } from './template.service';
import { TemplateDirective } from './template.directive';

@Component({
    selector: 'performular-form',
    template: `<ng-container *ngIf="!!form" [performularRenderer]="form"></ng-container>`,
    styles: [``],
    providers: [TemplateService]
})
export class PerformularComponent extends AbstractForm implements OnDestroy {
    private _form: AbstractModel | undefined;

    @Input()
    set form(form: AbstractModel | undefined) {
        this._form = form;
        if (this._form) {
            this._init(this._form);
        }
    }

    get form(): AbstractModel | undefined {
        return this._form;
    }

    @ContentChildren(TemplateDirective)
    set templates(t: QueryList<TemplateDirective>) {
        this._templateService.templates = t.toArray();
    }

    constructor(private _templateService: TemplateService) {
        super();
    }

    public ngOnDestroy(): void {
        this._destory();
    }
}
