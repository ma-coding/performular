import { CommonModule } from '@angular/common';
import {
    Injector,
    ModuleWithProviders,
    NgModule,
    ANALYZE_FOR_ENTRY_COMPONENTS
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    Framework,
    InstanceDef,
    RunDetectionStrategy,
    ValidationExecuter,
    VisibilityExecuter,
    DataConnectionStrategy,
    CORE_RUN_DETECTORS,
    CORE_VALIDATORS,
    Action
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
import { TemplateDirective } from './template.directive';

export interface PerformularOptions {
    actions?: InstanceDef<Action>[];
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
        TemplateDirective,
        ...buildInModels
    ],
    exports: [
        FlexLayoutModule,
        PerformularComponent,
        PerformularRendererDirective,
        TemplateDirective
    ],
    entryComponents: [...buildInModels]
})
export class PerformularModule {
    constructor(private _injector: Injector) {
        NgInjector.setInjector(this._injector);
        Framework.setInjector(new NgInjector());
        Framework.setLayoutModel(LayoutComponent);
        Framework.setItemModel(ItemComponent);
    }

    public static forRoot(options: PerformularOptions): ModuleWithProviders {
        return {
            providers: [
                ...CORE_RUN_DETECTORS,
                ...CORE_VALIDATORS,
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: options.models || [],
                    multi: true
                },
                ...(options.actions || []),
                ...(options.datasources || []),
                ...(options.runDetectors || []),
                ...(options.validators || []),
                ...(options.visibles || [])
            ],
            ngModule: PerformularModule
        };
    }

    public static forChild(options: PerformularOptions): ModuleWithProviders {
        return {
            providers: [
                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: options.models || [],
                    multi: true
                },
                ...(options.actions || []),
                ...(options.datasources || []),
                ...(options.runDetectors || []),
                ...(options.validators || []),
                ...(options.visibles || [])
            ],
            ngModule: PerformularModule
        };
    }
}
