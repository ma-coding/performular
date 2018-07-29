import {
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Injector,
    Input,
    OnDestroy,
    ViewContainerRef,
    Renderer2
} from '@angular/core';

import { Subscription } from 'rxjs';

import { AbstractFieldRenderer, AbstractModel } from '@performular/core';

import { PerformularModel } from './performular.model';
import { TemplateService } from './template.service';
import { TemplatePosition, TemplateDirective } from './template.directive';

@Directive({
    selector: '[performularRenderer]'
})
export class PerformularRendererDirective extends AbstractFieldRenderer
    implements OnDestroy {
    private _field: AbstractModel | undefined;
    private _subscription: Subscription | undefined;

    @Input()
    set performularRenderer(field: AbstractModel) {
        this._field = field;
        this._destroy(<any>this._subscription);
        this._subscription = this._init(this._field);
    }

    constructor(
        private _cfr: ComponentFactoryResolver,
        private _injector: Injector,
        private _renderer: Renderer2,
        private _viewContainerRef: ViewContainerRef,
        private _templateService: TemplateService
    ) {
        super();
    }

    public ngOnDestroy(): void {
        this._destroy(this._subscription);
    }

    protected _createField(): void {
        if (!this._field) {
            return;
        }
        const injector: Injector = Injector.create(
            [
                {
                    provide: PerformularModel,
                    useValue: this._field
                }
            ],
            this._injector
        );

        const componentFactory: ComponentFactory<
            any
        > = this._cfr.resolveComponentFactory(this._field.model);

        const componentRef: ComponentRef<
            any
        > = this._viewContainerRef.createComponent(
            componentFactory,
            0,
            injector
        );

        this._field.setInstance(
            componentRef.instance,
            componentRef.location.nativeElement
        );

        this._renderTemplate(this._field, componentRef, 'before');
        this._renderTemplate(this._field, componentRef, 'after');
        componentRef.changeDetectorRef.detectChanges();
    }

    protected _destroyField(): void {
        this._viewContainerRef.clear();
    }

    private _renderTemplate(
        field: AbstractModel,
        componentRef: ComponentRef<any>,
        position: TemplatePosition
    ): void {
        const template:
            | TemplateDirective
            | undefined = this._templateService.getTemplate(
            field.id,
            field.modelDef.metadata.name,
            position
        );
        if (template) {
            const h: HTMLElement = componentRef.location.nativeElement;
            if (position === 'before') {
                template
                    .createView(field)
                    .rootNodes.reverse()
                    .forEach((node: any) =>
                        this._renderer.insertBefore(h, node, h.firstChild)
                    );
            } else {
                template
                    .createView(field)
                    .rootNodes.forEach((node: any) =>
                        this._renderer.appendChild(h, node)
                    );
            }
        }
    }
}
