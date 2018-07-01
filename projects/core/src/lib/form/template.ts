import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { Abstract } from '../models/abstract';

export type TemplatePosition = 'before' | 'after'; // | 'wrap';
@Directive({
    selector: '[performularTemplate]'
})
export class TemplateDirective {

    private _field: string | undefined;
    private _id: string | undefined;
    private _position: TemplatePosition = 'before';

    @Input() set field(f: string | undefined) {
        this._field = f;
    }
    get field(): string | undefined {
        return this._field;
    }

    @Input() set id(i: string | undefined) {
        this._id = i;
    }
    get id(): string | undefined {
        return this._id;
    }

    @Input() set position(p: TemplatePosition) {
        this._position = p;
    }
    get position(): TemplatePosition {
        return this._position;
    }

    constructor(
        private _templateRef: TemplateRef<any>,
        private _viewContainerRef: ViewContainerRef
    ) {
    }

    public createView(field: Abstract | undefined): EmbeddedViewRef<any> {
        const embView: EmbeddedViewRef<any> = this._viewContainerRef.createEmbeddedView(
            this._templateRef,
            { $implicit: field }
        );
        embView.detectChanges();
        return embView;
    }

}
