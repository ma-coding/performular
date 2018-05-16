import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import {
    Layout,
    LayoutAlignDirective,
    LayoutDirective,
    LayoutGapDirective,
    MediaMonitor,
    StyleUtils,
} from '@angular/flex-layout';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Field, IOnInitField } from '../../handler/field.handler';
import { LayoutSchema } from '../../schemas/schemas';

@Field({
    id: 'FlexLayout'
})
@Component({
    selector: 'performular-core-layout',
    template: `
    <ng-container *ngFor="let childField of layout?.get$('children') | async">
        <ng-container [performularSchema]="childField"></ng-container>
    </ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreLayoutComponent implements IOnInitField, OnDestroy {

    private _subscription: Subscription | undefined;
    private _layoutHandler: LayoutDirective | undefined;
    private _layoutGapHandler: LayoutGapDirective | undefined;
    private _layoutAlignHandler: LayoutAlignDirective | undefined;

    public layout: LayoutSchema<ICoreLayoutBindings> | undefined;

    constructor(
        private _renderer: Renderer2,
        private _monitor: MediaMonitor,
        private _elementRef: ElementRef,
        private _styleUtils: StyleUtils,
        private _zone: NgZone,
        private _directionality: Directionality
    ) { }

    public ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        if (this._layoutHandler) {
            this._layoutHandler.ngOnDestroy();
        }
        if (this._layoutGapHandler) {
            this._layoutGapHandler.ngOnDestroy();
        }
        if (this._layoutAlignHandler) {
            this._layoutAlignHandler.ngOnDestroy();
        }
    }

    public onInitField(field: LayoutSchema<ICoreLayoutBindings>): void {
        this.layout = field;
        this._createLayoutHandler();
        this._createLayoutAlignHandler();
        this._createLayoutGapHandler();
    }

    private _createLayoutHandler(): void {
        if (!this.layout) {
            return;
        }
        this._layoutHandler = new LayoutDirective(this._monitor, this._elementRef, this._styleUtils);
        this._layoutHandler = Object.assign(this._layoutHandler, this.layout.get('bindings') || {});
        if (!this._layoutHandler) {
            return;
        }
        this._layoutHandler.ngOnInit();
        this._subscription = this._layoutHandler.layout$.pipe(
            map((layout: Layout) => {
                if (layout.direction.indexOf('row') >= 0) {
                    this._renderer.setStyle(this._elementRef.nativeElement, 'width', '100%');
                    this._renderer.setStyle(this._elementRef.nativeElement, 'height', 'initial');
                } else {
                    this._renderer.setStyle(this._elementRef.nativeElement, 'height', '100%');
                    this._renderer.setStyle(this._elementRef.nativeElement, 'width', 'initial');
                }
            })
        ).subscribe();
    }

    private _createLayoutAlignHandler(): void {
        if (!this._layoutHandler || !this.layout) {
            return;
        }
        this._layoutAlignHandler = new LayoutAlignDirective(this._monitor, this._elementRef, this._layoutHandler, this._styleUtils);
        this._layoutAlignHandler = Object.assign(this._layoutAlignHandler, this.layout.get('bindings') || {});
        if (this._layoutAlignHandler) {
            this._layoutAlignHandler.ngOnInit();
        }
    }

    private _createLayoutGapHandler(): void {
        if (!this._layoutHandler || !this.layout) {
            return;
        }
        this._layoutGapHandler = new LayoutGapDirective(
            this._monitor, this._elementRef, this._layoutHandler,
            this._zone, this._directionality, this._styleUtils
        );
        this._layoutGapHandler = Object.assign(this._layoutGapHandler, this.layout.get('bindings') || {});
        if (this._layoutGapHandler) {
            this._layoutGapHandler.ngOnInit();
        }
    }
}

export type FxLayoutValues = null | string;

export type FxLayoutAlignValues = 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'stretch';

export interface FlexLayoutStyle {
    layoutWrapper?: string;
}

export interface ICoreLayoutBindings {
    layout?: FxLayoutValues;
    layoutXs?: FxLayoutValues;
    layoutSm?: FxLayoutValues;
    layoutMd?: FxLayoutValues;
    layoutLg?: FxLayoutValues;
    layoutXl?: FxLayoutValues;
    layoutGtXs?: FxLayoutValues;
    layoutGtSm?: FxLayoutValues;
    layoutGtMd?: FxLayoutValues;
    layoutGtLg?: FxLayoutValues;
    layoutLtSm?: FxLayoutValues;
    layoutLtMd?: FxLayoutValues;
    layoutLtLg?: FxLayoutValues;
    layoutLtXl?: FxLayoutValues;

    align?: FxLayoutAlignValues;
    alignXs?: FxLayoutAlignValues;
    alignSm?: FxLayoutAlignValues;
    alignMd?: FxLayoutAlignValues;
    alignLg?: FxLayoutAlignValues;
    alignXl?: FxLayoutAlignValues;
    alignGtXs?: FxLayoutAlignValues;
    alignGtSm?: FxLayoutAlignValues;
    alignGtMd?: FxLayoutAlignValues;
    alignGtLg?: FxLayoutAlignValues;
    alignLtSm?: FxLayoutAlignValues;
    alignLtMd?: FxLayoutAlignValues;
    alignLtLg?: FxLayoutAlignValues;
    alignLtXl?: FxLayoutAlignValues;

    gap?: string;
    gapXs?: string;
    gapSm?: string;
    gapMd?: string;
    gapLg?: string;
    gapXl?: string;
    gapGtXs?: string;
    gapGtSm?: string;
    gapGtMd?: string;
    gapGtLg?: string;
    gapLtSm?: string;
    gapLtMd?: string;
    gapLtLg?: string;
    gapLtXl?: string;
}