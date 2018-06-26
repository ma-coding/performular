import { ChangeDetectionStrategy, Component, ContentChildren, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Abstract } from '../models/abstract';
import { TemplateDirective, TemplatePosition } from './template';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'performular',
    template: '<ng-container [performularRenderer]="field"></ng-container>',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnDestroy {

    private _form: Abstract | undefined;
    private _updateSubscription: Subscription | undefined;
    private _templates: TemplateDirective[] | undefined;

    @ContentChildren(TemplateDirective) set templates(t: TemplateDirective[] | undefined) {
        this._templates = t;
    }

    get templates(): TemplateDirective[] | undefined {
        return this._templates;
    }

    @Input()
    set form(form: Abstract | undefined) {
        if (!form) {
            return;
        }
        this._onSetForm(form);
    }

    get form(): Abstract | undefined {
        return this._form;
    }

    constructor() { }

    public ngOnDestroy(): void {
        this._destroyForm();
    }

    public getTemplate(id: string, field: string, position: TemplatePosition): TemplateDirective | undefined {
        return (this._templates || []).find((t: TemplateDirective) => t.id === id && t.position === position) ||
            (this._templates || []).find((t: TemplateDirective) => t.field === field && t.position === position);
    }

    private _onSetForm(field: Abstract): void {
        this._destroyForm();
        this._updateSubscription = field.updates$.subscribe();
        field.update(
            field.all.map((f: Abstract) => {
                return f;
            })
        );
        this._form = field;
    }

    private _destroyForm(): void {
        if (this._updateSubscription) {
            this._updateSubscription.unsubscribe();
        }
    }
}
