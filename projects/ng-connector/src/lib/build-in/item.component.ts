import { Directionality } from '@angular/cdk/bidi';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    Optional,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import {
    LayoutDirective,
    StyleUtils,
    DefaultFlexDirective,
    DefaultFlexOrderDirective,
    DefaultFlexAlignDirective,
    DefaultFlexOffsetDirective,
    FlexStyleBuilder,
    FlexOrderStyleBuilder,
    FlexOffsetStyleBuilder,
    FlexAlignStyleBuilder,
    LAYOUT_CONFIG,
    LayoutConfigOptions,
    MediaMarshaller
} from '@angular/flex-layout';

import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import {
    AbstractModel,
    ItemModel,
    LayoutModel,
    Model
} from '@performular/core';

import { PerformularModel } from '../performular.model';
import { mapToInputs } from './misc';

export function ItemBuilder(options: any): ItemModel {
    return new ItemModel(options);
}

export const PERFORMULAR_MODEL_ITEM: string = 'PERFORMULAR_MODEL_ITEM';

@Model({
    name: PERFORMULAR_MODEL_ITEM,
    builder: ItemBuilder
})
@Component({
    selector: 'performular-item',
    template:
        '<ng-container *ngFor="let c of field?.children$ | async" [performularRenderer]="c"></ng-container>',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnDestroy {
    private _subscription: Subscription;
    private _flexHandler?: DefaultFlexDirective;
    private _flexOrderHandler?: DefaultFlexOrderDirective;
    private _flexOffsetHandler?: DefaultFlexOffsetDirective;
    private _flexAlignHandler?: DefaultFlexAlignDirective;

    constructor(
        @Optional()
        @Inject(PerformularModel)
        public field: ItemModel,
        private _elementRef: ElementRef,
        @Inject(LAYOUT_CONFIG) protected _layoutConfig: LayoutConfigOptions,
        private _marshaller: MediaMarshaller,
        private _flexStyleBuilder: FlexStyleBuilder,
        private _flexOrderStyleBuilder: FlexOrderStyleBuilder,
        private _flexOffsetStyleBuilder: FlexOffsetStyleBuilder,
        private _flexAlignStyleBuilder: FlexAlignStyleBuilder,
        private _styleUtils: StyleUtils,
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
        this._flexHandler = this._createFlex();
        this._flexOrderHandler = this._createFlexOrder();
        this._flexOffsetHandler = this._createFlexOffset();
        this._flexAlignHandler = this._createFlexAlign();
    }

    private _createFlex(): DefaultFlexDirective {
        const flex: DefaultFlexDirective = new DefaultFlexDirective(
            this._elementRef,
            this._styleUtils,
            this._layoutConfig,
            this._flexStyleBuilder,
            this._marshaller
        );
        const value: SimpleChanges = mapToInputs(
            'fxFlex',
            this.field.flex,
            (v: string) => new SimpleChange(undefined, v, true)
        );
        flex.ngOnChanges(value);
        return flex;
    }

    private _createFlexOffset(): DefaultFlexOffsetDirective {
        const offset: DefaultFlexOffsetDirective = new DefaultFlexOffsetDirective(
            this._elementRef,
            this._directionality,
            this._flexOffsetStyleBuilder,
            this._marshaller,
            this._styleUtils
        );
        const value: SimpleChanges = mapToInputs(
            'fxFlexOffset',
            this.field.flexOffset,
            (v: string) => new SimpleChange(undefined, v, true)
        );
        offset.ngOnChanges(value);
        return offset;
    }

    private _createFlexOrder(): DefaultFlexOrderDirective {
        const order: DefaultFlexOrderDirective = new DefaultFlexOrderDirective(
            this._elementRef,
            this._styleUtils,
            this._flexOrderStyleBuilder,
            this._marshaller
        );
        const value: SimpleChanges = mapToInputs(
            'fxFlexOrder',
            this.field.flexOrder,
            (v: string) => new SimpleChange(undefined, v, true)
        );
        order.ngOnChanges(value);
        return order;
    }

    private _createFlexAlign(): DefaultFlexAlignDirective {
        const align: DefaultFlexAlignDirective = new DefaultFlexAlignDirective(
            this._elementRef,
            this._styleUtils,
            this._flexAlignStyleBuilder,
            this._marshaller
        );
        const value: SimpleChanges = mapToInputs(
            'fxFlexAlign',
            this.field.flexAlign,
            (v: string) => new SimpleChange(undefined, v, true)
        );
        align.ngOnChanges(value);
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
