import { Directionality } from '@angular/cdk/bidi';
import { Component, ElementRef, Inject, NgZone, OnDestroy, Optional } from '@angular/core';
import {
    FlexAlignDirective,
    FlexDirective,
    FlexOffsetDirective,
    FlexOrderDirective,
    LayoutDirective,
    MediaMonitor,
    StyleUtils,
} from '@angular/flex-layout';

import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { AbstractModel, ItemModel, LayoutModel, Model } from '@performular/core';

import { PerformularModel } from '../performular.model';
import { mapToInputs } from './misc';

export function ItemBuilder(options: any): ItemModel {
    return new ItemModel(options);
}

@Model({
    name: 'PERFORMULAR_ITEM',
    builder: ItemBuilder
})
@Component({
    selector: 'performular-item',
    template:
        '<ng-container *ngFor="let c of field?.children$ | async" [performularRenderer]="c"></ng-container>',
    styles: []
})
export class ItemComponent implements OnDestroy {
    private _subscription: Subscription;
    private _flexHandler?: FlexDirective;
    private _flexOrderHandler?: FlexOrderDirective;
    private _flexOffsetHandler?: FlexOffsetDirective;
    private _flexAlignHandler?: FlexAlignDirective;

    constructor(
        @Optional()
        @Inject(PerformularModel)
        public field: ItemModel,
        private _monitor: MediaMonitor,
        private _elementRef: ElementRef,
        private _styleUtils: StyleUtils,
        private _zone: NgZone,
        private _directionality: Directionality
    ) {
        this._subscription = combineLatest(
            this._getLayoutObs(),
            this.field.flex$,
            this.field.flexAlign$,
            this.field.flexOffset$,
            this.field.flexOrder$
        )
            .pipe(
                tap((erg: any[]) => {
                    this._destroyDirectives();
                    const layoutDirective: LayoutDirective | undefined = erg[0];
                    if (layoutDirective) {
                        this._createDirectives(layoutDirective);
                    }
                })
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._destroyDirectives();
    }

    private _destroyDirectives(): void {
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

    private _createDirectives(layout: LayoutDirective): void {
        this._flexHandler = this._createFlex(layout);
        this._flexOrderHandler = this._createFlexOrder();
        this._flexOffsetHandler = this._createFlexOffset(layout);
        this._flexAlignHandler = this._createFlexAlign();
        this._flexHandler.ngOnInit();
        this._flexOrderHandler.ngOnInit();
        this._flexOffsetHandler.ngOnInit();
        this._flexAlignHandler.ngOnInit();
    }

    private _createFlex(layout: LayoutDirective): FlexDirective {
        let flex: FlexDirective = new FlexDirective(
            this._monitor,
            this._elementRef,
            layout,
            this._styleUtils,
            {}
        );
        flex = Object.assign(flex, mapToInputs('flex', this.field.flex));
        return flex;
    }

    private _createFlexOffset(layout: LayoutDirective): FlexOffsetDirective {
        let offset: FlexOffsetDirective = new FlexOffsetDirective(
            this._monitor,
            this._elementRef,
            layout,
            this._directionality,
            this._styleUtils
        );
        offset = Object.assign(
            offset,
            mapToInputs('offset', this.field.flexOffset)
        );
        return offset;
    }

    private _createFlexOrder(): FlexOrderDirective {
        let order: FlexOrderDirective = new FlexOrderDirective(
            this._monitor,
            this._elementRef,
            this._styleUtils
        );
        order = Object.assign(
            order,
            mapToInputs('order', this.field.flexOffset)
        );
        return order;
    }

    private _createFlexAlign(): FlexAlignDirective {
        let align: FlexAlignDirective = new FlexAlignDirective(
            this._monitor,
            this._elementRef,
            this._styleUtils
        );
        align = Object.assign(
            align,
            mapToInputs('align', this.field.flexOffset)
        );
        return align;
    }

    private _getLayoutObs(): Observable<LayoutDirective | undefined> {
        return this.field.parent$.pipe(
            switchMap((p: AbstractModel | undefined) => {
                if (p instanceof LayoutModel) {
                    return p.instance$.pipe(
                        map((instance: any) => {
                            return instance
                                ? instance.layoutHandler
                                : undefined;
                        })
                    );
                } else {
                    return of(undefined);
                }
            })
        );
    }
}
