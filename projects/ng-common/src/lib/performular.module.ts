import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    Framework,
    InstanceDef,
    RunDetectionStrategy,
    ValidationExecuter,
    VisibilityExecuter,
    DataConnectionStrategy,
    CORE_RUN_DETECTORS,
    CORE_VALIDATORS
} from '@performular/core';
import { FieldsetComponent } from './build-in/fieldset.component';
import { CoreGroupComponent } from './build-in/group.component';
import { InputComponent } from './build-in/input.component';
import { ItemComponent } from './build-in/item.component';
import { LayoutComponent } from './build-in/layout.component';
import { CoreListComponent } from './build-in/list.component';
import { PerformularComponent } from './form.component';
import { NgInjector } from './ng-injector';
import { PerformularRendererDirective } from './render.directive';

export interface PerformularOptions {
    models?: InstanceDef<any>[];
    datasources?: InstanceDef<DataConnectionStrategy>[];
    runDetectors?: InstanceDef<RunDetectionStrategy>[];
    validators?: InstanceDef<ValidationExecuter>[];
    visibles?: InstanceDef<VisibilityExecuter>[];
}

export const buildInModels: any[] = [
    LayoutComponent,
    ItemComponent,
    FieldsetComponent,
    CoreGroupComponent,
    CoreListComponent,
    InputComponent
];

@NgModule({
    imports: [CommonModule, FlexLayoutModule],
    declarations: [
        PerformularComponent,
        PerformularRendererDirective,
        ...buildInModels
    ],
    exports: [
        FlexLayoutModule,
        PerformularComponent,
        PerformularRendererDirective
    ],
    providers: [...CORE_RUN_DETECTORS, ...CORE_VALIDATORS],
    entryComponents: [...buildInModels]
})
export class PerformularModule {
    constructor(private _injector: Injector) {
        NgInjector.setInjector(this._injector);
        Framework.setInjector(new NgInjector());
        Framework.setLayoutModel(LayoutComponent);
        Framework.setItemModel(ItemComponent);
    }

    public static withConfig(options: PerformularOptions): ModuleWithProviders {
        return {
            providers: [],
            ngModule: PerformularModule
        };
    }
}
