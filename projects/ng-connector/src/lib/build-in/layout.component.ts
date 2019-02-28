import { Directionality } from '@angular/cdk/bidi';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    NgZone,
    OnDestroy,
    Renderer2,
    SimpleChange
} from '@angular/core';
import {
    StyleUtils,
    MediaMarshaller,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutGapDirective,
    LayoutStyleBuilder,
    LayoutAlignStyleBuilder,
    LayoutGapStyleBuilder,
    ElementMatcher
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
    private _layoutGapHandler?: DefaultLayoutGapDirective;
    private _layoutAlignHandler?: DefaultLayoutAlignDirective;
    public layoutHandler?: DefaultLayoutDirective;

    constructor(
        @Inject(PerformularModel) public field: LayoutModel,
        private _renderer: Renderer2,
        private _marshaler: MediaMarshaller,
        private _elementRef: ElementRef,
        private _styleUtils: StyleUtils,
        private _layoutStyleBuilder: LayoutStyleBuilder,
        private _layoutAlignStyleBuilder: LayoutAlignStyleBuilder,
        private _layoutGapStyleBuilder: LayoutGapStyleBuilder,
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
        this._layoutAlignHandler = this._createLayoutAlignHandler();
        this._layoutGapHandler = this._createLayoutGapHandler();
        this._layoutGapHandler.ngAfterContentInit();
        return this._marshaler
            .trackValue(this._elementRef.nativeElement, 'layout')
            .pipe(
                map((l: ElementMatcher) => l.value.trim()),
                startWith(this.layoutHandler.activatedValue),
                tap((layout: any) => {
                    this._setHostStyle(layout || '');
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

    private _createLayoutHandler(): DefaultLayoutDirective {
        const layout: DefaultLayoutDirective = new DefaultLayoutDirective(
            this._elementRef,
            this._styleUtils,
            this._layoutStyleBuilder,
            this._marshaler
        );
        const value: any = mapToInputs(
            'fxLayout',
            this.field.layout,
            (val: any) => new SimpleChange(undefined, val, true)
        );
        layout.ngOnChanges(value);
        return layout;
    }

    private _createLayoutAlignHandler(): DefaultLayoutAlignDirective {
        const layoutAlign: DefaultLayoutAlignDirective = new DefaultLayoutAlignDirective(
            this._elementRef,
            this._styleUtils,
            this._layoutAlignStyleBuilder,
            this._marshaler
        );
        const value: any = mapToInputs(
            'fxLayoutAlign',
            this.field.layoutAlign,
            (val: any) =>
                new SimpleChange(undefined, `${val.main} ${val.cross}`, true)
        );
        layoutAlign.ngOnChanges(value);
        return layoutAlign;
    }

    private _createLayoutGapHandler(): DefaultLayoutGapDirective {
        const layoutGap: DefaultLayoutGapDirective = new DefaultLayoutGapDirective(
            this._elementRef,
            this._zone,
            this._directionality,
            this._styleUtils,
            this._layoutGapStyleBuilder,
            this._marshaler
        );
        const value: any = mapToInputs(
            'fxLayoutGap',
            this.field.layoutGap || { main: '' },
            (val: any) => new SimpleChange(undefined, val, true)
        );
        layoutGap.ngOnChanges(value);
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
