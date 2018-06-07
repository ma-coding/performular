import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    Injector,
    Input,
    OnDestroy,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { Abstract } from './models/abstract';
import { Performular } from './performular';
import { TemplateDirective, TemplatePosition } from './template';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'performular',
    template: '<ng-container [performularRenderer]="field"></ng-container>',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnDestroy {

    private _field: Abstract | undefined;
    private _updateSubscription: Subscription | undefined;
    private _templates: TemplateDirective[] | undefined;

    @ContentChildren(TemplateDirective) set templates(t: TemplateDirective[] | undefined) {
        this._templates = t;
    }

    get templates(): TemplateDirective[] | undefined {
        return this._templates;
    }

    @Input()
    set form(form: Performular<any>) {
        if (!form) {
            return;
        }
        this._onSetField(form.form);
    }

    get field(): Abstract | undefined {
        return this._field;
    }

    constructor(
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) { }

    public ngOnDestroy(): void {
        this._destroyField();
    }

    public getTemplate(id: string, field: string, position: TemplatePosition): TemplateDirective | undefined {
        return (this._templates || []).find((t: TemplateDirective) => t.id === id && t.position === position) ||
            (this._templates || []).find((t: TemplateDirective) => t.field === field && t.position === position);
    }

    private _onSetField(field: Abstract): void {
        this._destroyField();
        this._updateSubscription = field.updates$.subscribe();
        field.update(
            field.getChildListRecursive().map((f: Abstract) => {
                f.setForm(this);
                return f;
            })
        );
        this._field = field;
    }

    private _destroyField(): void {
        if (this._updateSubscription) {
            this._updateSubscription.unsubscribe();
        }
    }
}
