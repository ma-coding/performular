import { Directionality } from '@angular/cdk/bidi';
import {
    ChangeDetectorRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    ViewContainerRef,
} from '@angular/core';
import {
    FlexAlignDirective,
    FlexDirective,
    FlexOffsetDirective,
    FlexOrderDirective,
    LayoutDirective,
    MediaMonitor,
    StyleUtils,
} from '@angular/flex-layout';

import { Observable, Subscription } from 'rxjs';

import { Abstract } from './models/abstract';
import { Container } from './models/container';
import { Field } from './models/field';

@Directive({
    selector: '[performularRenderer]',
    exportAs: 'renderer'
})
export class RendererDirective implements OnDestroy {

    private _field: Abstract | undefined;
    private _hiddenSubscription: Subscription | undefined;
    private _layoutSubscription: Subscription | undefined;
    private _itemSubscription: Subscription | undefined;
    private _componentRef: ComponentRef<any> | undefined;

    private _layoutHandler: LayoutDirective | undefined;
    private _flexHandler: FlexDirective | undefined;
    private _flexOrderHandler: FlexOrderDirective | undefined;
    private _flexOffsetHandler: FlexOffsetDirective | undefined;
    private _flexAlignHandler: FlexAlignDirective | undefined;

    @Input() set performularRenderer(f: Abstract | undefined) {
        if (!f) {
            return;
        }
        this._onSetField(f);
    }

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _cd: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _viewRef: ViewContainerRef,
        private _monitor: MediaMonitor,
        private _styleUtils: StyleUtils,
        private _zone: NgZone,
        private _directionality: Directionality
    ) { }

    public ngOnDestroy(): void {
        this._clearSubscriptions();
        this._clearComponent();
    }

    private _onSetField(field: Abstract): void {
        this._field = field;

        this._clearSubscriptions();
        this._startHiddenSubscription();
    }

    private _startHiddenSubscription(): void {
        if (this._field) {
            const hidden$: Observable<boolean> = this._field.isContainer ? (<Container>this._field).hidden$ : (<Field>this._field).hidden$;
            this._hiddenSubscription = hidden$
                .subscribe((hidden: boolean) => {
                    this._calculateComponent(hidden);
                });
        }
    }

    private _clearSubscriptions(): void {
        if (this._hiddenSubscription) {
            this._hiddenSubscription.unsubscribe();
        }
        if (this._layoutSubscription) {
            this._layoutSubscription.unsubscribe();
        }
        if (this._itemSubscription) {
            this._itemSubscription.unsubscribe();
        }
    }

    private _insertComponent(): void {
        this._clearComponent();
        if (!this._field) {
            return;
        }
        const factory: ComponentFactory<any> =
            this._componentFactoryResolver.resolveComponentFactory(this._field.field);
        this._componentRef = this._viewRef.createComponent(factory);
        if ('onInitFramework' in this._componentRef.instance) {
            this._componentRef.instance.onInitFramework(this._field);
        }
        this._field.registerFramework(this._componentRef.location, this._componentRef.instance);
    }

    private _getLayoutHandler(field: Abstract): LayoutDirective | undefined {
        if (this._layoutHandler) {
            return this._layoutHandler;
        } else {
            if (field.parent && field.parent.in) {

            }
        }
    }

    private _clearComponent(): void {
        if (this._componentRef) {
            this._componentRef.destroy();
            this._viewRef.clear();
            (this._field as any).clearInstance();
        }
    }

    private _calculateComponent(hidden: boolean): void {
        if (hidden) {
            this._clearComponent();
        } else {
            this._insertComponent();
        }
    }
}
