import { Directionality } from '@angular/cdk/bidi';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    NgZone,
    OnDestroy,
    Renderer2
} from '@angular/core';
import {
    Layout,
    LayoutAlignDirective,
    LayoutDirective,
    LayoutGapDirective,
    MediaMonitor,
    StyleUtils
} from '@angular/flex-layout';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { startWith, switchMap, tap, map } from 'rxjs/operators';

import { LayoutModel, Model } from '@performular/core';

import { PerformularModel } from '../performular.model';
import { mapToInputs } from './misc';

export function LayoutBuilder(options: any): LayoutModel {
    return new LayoutModel(options);
}

export const PERFORMULAR_MODEL_LAYOUT: string = 'PERFORMULAR_MODEL_LAYOUT';

@Model({
    name: PERFORMULAR_MODEL_LAYOUT,
    builder: LayoutBuilder
})
@Component({
    selector: 'performular-layout',
    template: `
        <ng-container
            *ngFor="let c of (field?.children$ | async)"
            [performularRenderer]="c"
        ></ng-container>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnDestroy {
    private _subscription: Subscription;
    private _layoutGapHandler?: LayoutGapDirective;
    private _layoutAlignHandler?: LayoutAlignDirective;
    public layoutHandler?: LayoutDirective;

    constructor(
        @Inject(PerformularModel) public field: LayoutModel,
        private _renderer: Renderer2,
        private _monitor: MediaMonitor,
        private _elementRef: ElementRef,
        private _styleUtils: StyleUtils,
        private _zone: NgZone,
        private _directionality: Directionality
    ) {
        this._subscription = combineLatest(
            this.field.layout$,
            this.field.layoutAlign$,
            this.field.layoutGap$
        )
            .pipe(
                tap(() => this._destroyDirectives()),
                switchMap(() => {
                    return this._createDirectives();
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

    private _createDirectives(): Observable<any> {
        this.layoutHandler = this._createLayoutHandler();
        this._layoutAlignHandler = this._createLayoutAlignHandler(
            this.layoutHandler
        );
        this._layoutGapHandler = this._createLayoutGapHandler(
            this.layoutHandler
        );
        this.layoutHandler.ngOnInit();
        this._layoutAlignHandler.ngOnInit();
        this._layoutGapHandler.ngOnInit();
        this._layoutGapHandler.ngAfterContentInit();
        return this.layoutHandler.layout$.pipe(
            map((l: Layout) => `${l.direction} ${l.wrap}`.trim()),
            startWith(this.layoutHandler.activatedValue),
            tap((layout: any) => {
                this._setHostStyle(layout || '');
                (<any>this.layoutHandler)._updateWithDirection();
            })
        );
    }

    private _destroyDirectives(): void {
        if (this.layoutHandler) {
            this.layoutHandler.ngOnDestroy();
            this.layoutHandler = undefined;
        }
        if (this._layoutAlignHandler) {
            this._layoutAlignHandler.ngOnDestroy();
            this._layoutAlignHandler = undefined;
        }
        if (this._layoutGapHandler) {
            this._layoutGapHandler.ngOnDestroy();
            this._layoutGapHandler = undefined;
        }
    }

    private _createLayoutHandler(): LayoutDirective {
        let layout: LayoutDirective = new LayoutDirective(
            this._monitor,
            this._elementRef,
            this._styleUtils
        );

        layout = Object.assign(
            layout,
            mapToInputs('layout', this.field.layout)
        );
        return layout;
    }

    private _createLayoutAlignHandler(
        layout: LayoutDirective
    ): LayoutAlignDirective {
        let layoutAlign: LayoutAlignDirective = new LayoutAlignDirective(
            this._monitor,
            this._elementRef,
            layout,
            this._styleUtils
        );
        layoutAlign = Object.assign(
            layoutAlign,
            mapToInputs(
                'align',
                this.field.layoutAlign,
                (val: any) => `${val.main} ${val.cross}`
            )
        );
        return layoutAlign;
    }

    private _createLayoutGapHandler(
        layout: LayoutDirective
    ): LayoutGapDirective {
        let layoutGap: LayoutGapDirective = new LayoutGapDirective(
            this._monitor,
            this._elementRef,
            layout,
            this._zone,
            this._directionality,
            this._styleUtils
        );
        layoutGap = Object.assign(
            layoutGap,
            mapToInputs('gap', this.field.layoutGap)
        );
        return layoutGap;
    }

    private _setHostStyle(direction: string): void {
        if (direction.indexOf('row') >= 0) {
            this._renderer.setStyle(
                this._elementRef.nativeElement,
                'width',
                '100%'
            );
            this._renderer.setStyle(
                this._elementRef.nativeElement,
                'height',
                'initial'
            );
        } else {
            this._renderer.setStyle(
                this._elementRef.nativeElement,
                'height',
                '100%'
            );
            this._renderer.setStyle(
                this._elementRef.nativeElement,
                'width',
                'initial'
            );
        }
    }
}
