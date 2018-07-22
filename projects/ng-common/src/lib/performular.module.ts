import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Framework } from '@performular/core';

import { ItemComponent } from './build-in/item.component';
import { LayoutComponent } from './build-in/layout.component';
import { PerformularComponent } from './form.component';
import { NgInjector } from './ng-injector';
import { PerformularRendererDirective } from './render.directive';

@NgModule({
    imports: [CommonModule, FlexLayoutModule],
    declarations: [
        PerformularComponent,
        PerformularRendererDirective,
        LayoutComponent,
        ItemComponent
    ],
    exports: [
        FlexLayoutModule,
        PerformularComponent,
        PerformularRendererDirective
    ],
    entryComponents: [LayoutComponent, ItemComponent]
})
export class PerformularModule {
    constructor(private _injector: Injector) {
        NgInjector.setInjector(this._injector);
        Framework.setInjector(new NgInjector());
        Framework.setLayoutModel(LayoutComponent);
        Framework.setItemModel(ItemComponent);
    }

    public static withConfig(options: any): ModuleWithProviders {
        return {
            providers: [],
            ngModule: PerformularModule
        };
    }
}
