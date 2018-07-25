import { Component } from '@angular/core';

import {
    ContainerModel,
    GroupFieldModel,
    ItemModel,
    LayoutModel,
    RequiredValidator,
    Builder,
    Model,
    ModelType,
    Group,
    Control
} from '@performular/core';
import {
    CoreGroupComponent,
    FieldsetComponent,
    Input,
    InputComponent,
    Fieldset,
    CoreGroup,
    PERFORMULAR_MODEL_CORE_GROUP
} from '@performular/ng-common';
import {
    MaterialInput,
    MaterialSliderComponent,
    MaterialSlider,
    MaterialCheckbox,
    MaterialTextarea,
    MaterialToggle,
    MaterialDatepicker,
    PERFORMULAR_MODEL_MATERIALSLIDER,
    PERFORMULAR_MODEL_MATERIALCHECKBOX,
    PERFORMULAR_MODEL_MATERIALTOGGLE,
    PERFORMULAR_MODEL_MATERIALINPUT,
    PERFORMULAR_FORMCOMPONENT_MATERIALTEXTAREA,
    PERFORMULAR_MODEL_MATERIALDATEPICKER,
    MaterialCheckboxComponent,
    MaterialTextareaComponent,
    MaterialToggleComponent,
    MaterialInputComponent,
    MaterialSliderAttrs
} from '@performular/ui-material';

@Group({
    id: 'GROUP',
    attrs: undefined,
    model: CoreGroupComponent,
    layout: 'column',
    children: [
        {
            child: {
                layout: 'row',
                layoutGap: '18px',
                children: ['slider', 'checkbox', 'toggle', 'input']
            }
        }
    ]
})
export class FormType {
    @Control({
        attrs: {
            min: 0,
            max: 100
        },
        model: MaterialSliderComponent
    })
    public slider?: number;

    @Control({
        attrs: {
            placeholder: 'test'
        },
        model: MaterialCheckboxComponent
    })
    public checkbox?: boolean;

    @Control({
        attrs: {
            placeholder: 'test'
        },
        model: MaterialToggleComponent
    })
    public toggle?: boolean;

    @Control({
        attrs: {
            placeholder: 'test',
            label: 'test'
        },
        model: MaterialInputComponent
    })
    public input?: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public formTarget: GroupFieldModel = Builder.buildFromTarget(FormType, {
        slider: 70,
        checkbox: true,
        toggle: true,
        input: 123
    });

    public form: GroupFieldModel = new CoreGroup({
        id: 'group',
        attrs: undefined,
        children: [
            new LayoutModel({
                layout: 'row',
                layoutGap: '18px',
                children: [
                    new ItemModel({
                        child: new MaterialSlider({
                            id: 'slider',
                            attrs: {
                                max: 100,
                                min: 0
                            },
                            defaultValue: 5
                        })
                    }),
                    new ItemModel({
                        child: new MaterialCheckbox({
                            id: 'checkbox',
                            attrs: {
                                placeholder: 'AGB'
                            },
                            defaultValue: false
                        })
                    }),
                    new ItemModel({
                        child: new MaterialToggle({
                            id: 'toggle',
                            attrs: {
                                placeholder: 'TEST'
                            },
                            defaultValue: 5
                        })
                    })
                ]
            }),
            new LayoutModel({
                layout: 'row',
                layoutGap: '18px',
                children: [
                    new MaterialInput({
                        id: 'input',
                        attrs: {
                            type: 'number',
                            debounce: 1000,
                            placeholder: 'test',
                            label: 'ABC'
                        },
                        defaultValue: 5
                    }),
                    new MaterialTextarea({
                        id: 'textarea',
                        attrs: {
                            debounce: 1000,
                            maxRows: 10,
                            minRows: 5
                        },
                        defaultValue: 5
                    }),
                    new MaterialDatepicker({
                        id: 'datepicker',
                        attrs: {
                            label: 'AGB'
                        },
                        defaultValue: false
                    })
                ]
            })
        ]
    });

    public formJson: GroupFieldModel = Builder.buildFromJson(
        {
            id: 'GROUP',
            type: ModelType.GROUP,
            model: PERFORMULAR_MODEL_CORE_GROUP,
            attrs: undefined,
            children: [
                {
                    type: ModelType.LAYOUT,
                    layout: 'row',
                    layoutGap: '18px',
                    children: [
                        {
                            id: 'slider',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALSLIDER,
                            attrs: {
                                min: 0,
                                max: 100
                            }
                        },
                        {
                            id: 'checkbox',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALCHECKBOX,
                            attrs: {
                                placeholder: 'ABC'
                            }
                        },
                        {
                            id: 'toggle',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALTOGGLE,
                            attrs: {
                                placeholder: 'ABC'
                            }
                        }
                    ]
                },
                {
                    type: ModelType.LAYOUT,
                    layout: 'row',
                    layoutGap: '18px',
                    children: [
                        {
                            id: 'input',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALINPUT,
                            attrs: {
                                placeholder: 'TEST',
                                label: 'ASD',
                                type: 'number'
                            },
                            defaultValue: 6
                        },
                        {
                            id: 'textarea',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_FORMCOMPONENT_MATERIALTEXTAREA,
                            attrs: {
                                placeholder: 'TEST',
                                label: 'ASD'
                            },
                            defaultValue: 6
                        },
                        {
                            id: 'datepicker',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALDATEPICKER,
                            attrs: {
                                placeholder: 'ABC',
                                label: '1234'
                            }
                        }
                    ]
                }
            ]
        },
        {
            input: 900
        }
    );
    constructor() {}
}
