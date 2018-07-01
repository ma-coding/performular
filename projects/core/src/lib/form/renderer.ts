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
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import {
    FlexAlignDirective,
    FlexDirective,
    FlexOffsetDirective,
    FlexOrderDirective,
    Layout,
    LayoutAlignDirective,
    LayoutDirective,
    LayoutGapDirective,
    MediaMonitor,
    StyleUtils,
} from '@angular/flex-layout';

import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Abstract } from '../models/abstract';
import { AbstractField } from '../models/abstract-field';
import { Container } from '../models/container';
import { Control } from '../models/control';
import { TemplateDirective, TemplatePosition } from './template';

@Directive({
    selector: '[performularRenderer]'
})
export class RendererDirective implements OnDestroy {

    private _field: Abstract | undefined;
    private _subscription: Subscription | undefined;

    private _componentRef: ComponentRef<any> | undefined;

    private _layoutHandler: LayoutDirective | undefined;
    private _layoutGapHandler: LayoutGapDirective | undefined;
    private _layoutAlignHandler: LayoutAlignDirective | undefined;

    private _flexHandler: FlexDirective | undefined;
    private _flexOrderHandler: FlexOrderDirective | undefined;
    private _flexOffsetHandler: FlexOffsetDirective | undefined;
    private _flexAlignHandler: FlexAlignDirective | undefined;

    @Input() set performularRenderer(f: Abstract | undefined) {
        if (!f) {
            return;
        }
        this._createField(f);
    }

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _cd: ChangeDetectorRef,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private _viewRef: ViewContainerRef,
        private _monitor: MediaMonitor,
        private _styleUtils: StyleUtils,
        private _zone: NgZone,
        private _directionality: Directionality
    ) {
    }

    public ngOnDestroy(): void {
        this._destroyField();
    }

    private _createField(field: Abstract): void {
        this._destroyField();
        this._field = field;
        this._field.setRenderer(this);
        this._field.setNgRenderer(this._renderer);
        const hiddenObs: Observable<boolean> = field instanceof Container ? (<Container>field).hidden$ : (<AbstractField>field).hidden$;
        this._subscription = hiddenObs.pipe(
            tap((hidden: boolean) => {
                hidden ? this._destroyComponent() : this._createComponent(field);
            }),
            switchMap(() => combineLatest(
                field.itemChanges$.pipe(
                    switchMap(() => this._createItem(field))
                ),
                field instanceof Control ? of(undefined) :
                    (<Container>field).layoutChanges$.pipe(
                        switchMap(() => this._createLayout(<Container>field))
                    )
            ))
        ).subscribe();
    }

    private _destroyField(): void {
        this._destroyComponent();
        this._field = undefined;
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    private _createComponent(field: Abstract): void {
        this._destroyComponent();
        const componentRef: ComponentRef<any> = this._renderDefaultComponent(field);
        field.setElementRef(componentRef.location);
        field.setInstance(componentRef.instance);
        this._renderTemplate(field, componentRef, 'before');
        this._renderTemplate(field, componentRef, 'after');
    }

    private _renderDefaultComponent(field: Abstract): ComponentRef<any> {
        const factory: ComponentFactory<any> =
            this._componentFactoryResolver.resolveComponentFactory(field.fieldCmp);
        this._componentRef = this._viewRef.createComponent(factory);
        if ('performularOnInit' in this._componentRef.instance) {
            this._componentRef.instance.performularOnInit(this._field);
        }
        this._componentRef.changeDetectorRef.markForCheck();
        return this._componentRef;
    }

    private _renderTemplate(field: Abstract, componentRef: ComponentRef<any>, position: TemplatePosition): void {
        if (field.hostForm) {
            const template: TemplateDirective | undefined = field.hostForm.getTemplate(field.id, field.fieldDef, position);
            if (template) {
                const h: HTMLElement = componentRef.location.nativeElement;
                if (position === 'before') {
                    template.createView(field).rootNodes.reverse().forEach(
                        (node: any) => this._renderer.insertBefore(h, node, h.firstChild)
                    );
                } else {
                    template.createView(field).rootNodes.forEach(
                        (node: any) => this._renderer.appendChild(h, node)
                    );
                }
            }
        }
    }

    private _destroyComponent(): void {
        this._destroyLayout();
        this._destroyItem();
        if (this._componentRef) {
            this._componentRef.destroy();
            this._viewRef.clear();
        }
        if (this._field) {
            this._field.setElementRef(undefined);
            this._field.setInstance(undefined);
        }
    }

    private _createItem(field: Abstract): Observable<void> {
        const p: Abstract | undefined = field.parent;
        if (!p) {
            return of(undefined);
        }
        return p.renderer$.pipe(
            map((renderer: RendererDirective | undefined) => {
                this._destroyItem();
                if (!renderer || !field.elementRef || !renderer._layoutHandler) {
                    return;
                }

                this._flexHandler = new FlexDirective(this._monitor, field.elementRef, renderer._layoutHandler, this._styleUtils, null);
                this._flexHandler = Object.assign(this._flexHandler, field.flex);

                this._flexOrderHandler = new FlexOrderDirective(this._monitor, field.elementRef, this._styleUtils);
                this._flexOrderHandler = Object.assign(this._flexOrderHandler, field.flexOrder);

                this._flexOffsetHandler =
                    new FlexOffsetDirective(
                        this._monitor, field.elementRef, renderer._layoutHandler, this._directionality, this._styleUtils
                    );
                this._flexOffsetHandler = Object.assign(this._flexOffsetHandler, field.flexOffset);

                this._flexAlignHandler =
                    new FlexAlignDirective(this._monitor, field.elementRef, this._styleUtils);
                this._flexAlignHandler = Object.assign(this._flexAlignHandler, field.flexAlign);

                if (this._flexAlignHandler) {
                    this._flexAlignHandler.ngOnInit();
                }

                if (this._flexOffsetHandler) {
                    this._flexOffsetHandler.ngOnInit();
                }

                if (this._flexOrderHandler) {
                    this._flexOrderHandler.ngOnInit();
                }

                if (this._flexHandler) {
                    this._flexHandler.ngOnInit();
                }

                renderer._initLayout();
            })
        );
    }

    private _destroyItem(): void {
        if (this._flexAlignHandler) {
            this._flexAlignHandler.ngOnDestroy();
        }

        if (this._flexOffsetHandler) {
            this._flexOffsetHandler.ngOnDestroy();
        }

        if (this._flexOrderHandler) {
            this._flexOrderHandler.ngOnDestroy();
        }

        if (this._flexHandler) {
            this._flexHandler.ngOnDestroy();
        }
    }

    private _createLayout(field: Container): Observable<void> {
        this._destroyLayout();
        const elementRef: ElementRef | undefined = field.elementRef;
        if (!elementRef) {
            return of(undefined);
        }
        this._layoutHandler = new LayoutDirective(this._monitor, elementRef, this._styleUtils);
        this._layoutHandler = Object.assign(this._layoutHandler, field.layoutDirection);

        this._layoutAlignHandler = new LayoutAlignDirective(this._monitor, elementRef, this._layoutHandler, this._styleUtils);
        this._layoutAlignHandler = Object.assign(this._layoutAlignHandler, field.layoutAlign);

        this._layoutGapHandler = new LayoutGapDirective(
            this._monitor, elementRef, this._layoutHandler,
            this._zone, this._directionality, this._styleUtils
        );
        this._layoutGapHandler = Object.assign(this._layoutGapHandler, field.layoutGap);

        return this._layoutHandler.layout$.pipe(
            map((layout: Layout) => {
                if (layout.direction.indexOf('row') >= 0) {
                    this._renderer.setStyle(elementRef.nativeElement, 'width', '100%');
                    this._renderer.setStyle(elementRef.nativeElement, 'height', 'initial');
                } else {
                    this._renderer.setStyle(elementRef.nativeElement, 'height', '100%');
                    this._renderer.setStyle(elementRef.nativeElement, 'width', 'initial');
                }
            })
        );
    }

    private _initLayout(): void {
        if (this._layoutAlignHandler) {
            this._layoutAlignHandler.ngOnInit();
        }
        if (this._layoutGapHandler) {
            this._layoutGapHandler.ngOnInit();
        }

        if (this._layoutHandler) {
            this._layoutHandler.ngOnInit();
        }
    }

    private _destroyLayout(): void {
        if (this._layoutGapHandler) {
            this._layoutGapHandler.ngOnDestroy();
        }

        if (this._layoutAlignHandler) {
            this._layoutAlignHandler.ngOnDestroy();
        }

        if (this._layoutHandler) {
            this._layoutHandler.ngOnDestroy();
        }
    }

}
