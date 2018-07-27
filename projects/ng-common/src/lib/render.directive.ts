import {
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Injector,
    Input,
    OnDestroy,
    ViewContainerRef
} from '@angular/core';

import { Subscription } from 'rxjs';

import { AbstractFieldRenderer, AbstractModel } from '@performular/core';

import { PerformularModel } from './performular.model';

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
        private _viewContainerRef: ViewContainerRef
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
        componentRef.changeDetectorRef.detectChanges();
    }

    protected _destroyField(): void {
        this._viewContainerRef.clear();
    }
}
