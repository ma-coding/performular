import {
    ChangeDetectorRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    ViewContainerRef,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { AbstractSchema } from './schemas';

@Directive({
    selector: '[performularSchema]'
})
export class SchemaDirective implements OnDestroy {

    private _field: AbstractSchema | undefined;
    private _hiddenSubscription: Subscription | undefined;
    private _componentRef: ComponentRef<any> | undefined;
    private _subscriptions: Subscription[] = [];

    @Input() set performularSchema(f: AbstractSchema | undefined) {
        if (!f) {
            return;
        }
        this._onSetField(f);
    }

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _cd: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _viewRef: ViewContainerRef) { }

    public ngOnDestroy(): void {
        this._clearHiddenSubscription();
        this._clearComponent();
    }

    private _onSetField(field: AbstractSchema): void {
        this._field = field;

        this._clearHiddenSubscription();
        this._startHiddenSubscription();
    }

    private _startHiddenSubscription(): void {
        if (this._field) {
            this._hiddenSubscription = this._field.hidden$
                .subscribe(() => {
                    this._calculateComponent();
                });
        }
    }

    private _clearHiddenSubscription(): void {
        if (this._hiddenSubscription) {
            this._hiddenSubscription.unsubscribe();
        }
    }

    private _insertComponent(): void {
        this._clearComponent();
        if (!this._field) {
            return;
        }
        const factory: ComponentFactory<any> =
            this._componentFactoryResolver.resolveComponentFactory(this._field.component.target);
        this._componentRef = this._viewRef.createComponent(factory);
        if ('onSchemaInit' in this._componentRef.instance) {
            this._componentRef.instance.onSchemaInit(this._field);
        }
        this._field.setInstance(this._componentRef.instance, this._componentRef.location);
    }

    private _clearComponent(): void {
        this._subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this._subscriptions = [];
        if (this._componentRef) {
            this._componentRef.destroy();
            this._viewRef.clear();
            (this._field as any).clearInstance();
        }
    }

    private _calculateComponent(): void {
        if (!this._field) {
            return;
        }
        if (this._field.hidden) {
            this._clearComponent();
        } else {
            this._insertComponent();
        }
    }
}
