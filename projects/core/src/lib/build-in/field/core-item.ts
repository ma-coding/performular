import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy } from '@angular/core';
import {
    FlexAlignDirective,
    FlexDirective,
    FlexOffsetDirective,
    FlexOrderDirective,
    LayoutDirective,
    MediaMonitor,
    StyleUtils,
} from '@angular/flex-layout';

import { Field, IOnInitField } from '../../handler/field.handler';
import { LayoutSchema } from '../../schemas/schemas';

@Field({
    id: 'FlexItem'
})
@Component({
    selector: 'performular-core-item',
    template: `
        <ng-container [performularSchema]="(item?.get$('children') || [])[0]"></ng-container>
    `,
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreItemComponent implements IOnInitField, OnDestroy {

    private _layoutHandler: LayoutDirective | undefined;
    private _flexHandler: FlexDirective | undefined;
    private _flexOrderHandler: FlexOrderDirective | undefined;
    private _flexOffsetHandler: FlexOffsetDirective | undefined;
    private _flexAlignHandler: FlexAlignDirective | undefined;

    public item: LayoutSchema<ICoreItemBindings> | undefined;

    constructor(
        private _monitor: MediaMonitor,
        private _elementRef: ElementRef,
        private _styleUtils: StyleUtils,
        private _zone: NgZone,
        private _directionality: Directionality
    ) { }

    public ngOnDestroy(): void {
        if (this._flexHandler) {
            this._flexHandler.ngOnDestroy();
        }
        if (this._flexOrderHandler) {
            this._flexOrderHandler.ngOnDestroy();
        }
        if (this._flexOffsetHandler) {
            this._flexOffsetHandler.ngOnDestroy();
        }
        if (this._flexAlignHandler) {
            this._flexAlignHandler.ngOnDestroy();
        }
    }

    public onInitField(field: LayoutSchema<ICoreItemBindings>): void {
        this.item = field;
        const coreLayout: LayoutSchema | undefined = this.item.get('parent') as LayoutSchema;
        if (!(coreLayout instanceof LayoutSchema)) {
            return;
        }

        if (!coreLayout.get('instance')) {
            return;
        }

        this._layoutHandler = coreLayout.get('instance')._layoutHandler;
        if (!this._layoutHandler || !this.item) {
            return;
        }

        this._flexHandler = new FlexDirective(this._monitor, this._elementRef, this._layoutHandler, this._styleUtils, null);
        this._flexHandler = Object.assign(this._flexHandler, this.item.get('bindings') || {});
        (this._flexHandler as FlexDirective).ngOnInit();

        this._flexOrderHandler = new FlexOrderDirective(this._monitor, this._elementRef, this._styleUtils);
        this._flexOrderHandler = Object.assign(this._flexOrderHandler, this.item.get('bindings') || {});
        (this._flexOrderHandler as FlexOrderDirective).ngOnInit();

        this._flexOffsetHandler =
            new FlexOffsetDirective(this._monitor, this._elementRef, this._layoutHandler, this._directionality, this._styleUtils);
        this._flexOffsetHandler = Object.assign(this._flexOffsetHandler, this.item.get('bindings') || {});
        (this._flexOffsetHandler as FlexOffsetDirective).ngOnInit();

        this._flexAlignHandler =
            new FlexAlignDirective(this._monitor, this._elementRef, this._styleUtils);
        this._flexAlignHandler = Object.assign(this._flexAlignHandler, this.item.get('bindings') || {});
        (this._flexAlignHandler as FlexAlignDirective).ngOnInit();
    }

}

export type FxFlexValues = null | number | string;

export type FxFlexAlignValues = 'start' | 'end' | 'baseline' | 'center';

export type FlexItemStyle = null;

export interface ICoreItemBindings {
    flex?: FxFlexValues;
    flexXs?: FxFlexValues;
    flexSm?: FxFlexValues;
    flexMd?: FxFlexValues;
    flexLg?: FxFlexValues;
    flexXl?: FxFlexValues;
    flexGtXs?: FxFlexValues;
    flexGtSm?: FxFlexValues;
    flexGtMd?: FxFlexValues;
    flexGtLg?: FxFlexValues;
    flexLtSm?: FxFlexValues;
    flexLtMd?: FxFlexValues;
    flexLtLg?: FxFlexValues;
    flexLtXl?: FxFlexValues;

    order?: number;
    orderXs?: number;
    orderSm?: number;
    orderMd?: number;
    orderLg?: number;
    orderXl?: number;
    orderGtXs?: number;
    orderGtSm?: number;
    orderGtMd?: number;
    orderGtLg?: number;
    orderLtSm?: number;
    orderLtMd?: number;
    orderLtLg?: number;
    orderLtXl?: number;

    offset?: string;
    offsetXs?: string;
    offsetSm?: string;
    offsetMd?: string;
    offsetLg?: string;
    offsetXl?: string;
    offsetGtXs?: string;
    offsetGtSm?: string;
    offsetGtMd?: string;
    offsetGtLg?: string;
    offsetLtSm?: string;
    offsetLtMd?: string;
    offsetLtLg?: string;
    offsetLtXs?: string;

    align?: FxFlexAlignValues;
    alignXs?: FxFlexAlignValues;
    alignSm?: FxFlexAlignValues;
    alignMd?: FxFlexAlignValues;
    alignLg?: FxFlexAlignValues;
    alignXl?: FxFlexAlignValues;
    alignGtXs?: FxFlexAlignValues;
    alignGtSm?: FxFlexAlignValues;
    alignGtMd?: FxFlexAlignValues;
    alignGtLg?: FxFlexAlignValues;
    alignLtSm?: FxFlexAlignValues;
    alignLtMd?: FxFlexAlignValues;
    alignLtLg?: FxFlexAlignValues;
    alignLtXl?: FxFlexAlignValues;
}
