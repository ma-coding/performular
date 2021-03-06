import { ModelType, GroupFieldModel, Builder } from '@performular/core';
import {
    PERFORMULAR_MODEL_MATERIALDATEPICKER,
    PERFORMULAR_MODEL_MATERIALINPUT,
    PERFORMULAR_MODEL_MATERIALTOGGLE,
    PERFORMULAR_MODEL_MATERIALCHECKBOX,
    PERFORMULAR_MODEL_MATERIALSLIDER,
    PERFORMULAR_MODEL_MATERIALTEXTAREA,
    PERFORMULAR_MODEL_MATERIALSELECT,
    PERFORMULAR_MODEL_MATERIALRADIO
} from '@performular/ng-ui-material';
import { PERFORMULAR_MODEL_CORE_GROUP } from '@performular/ng-connector';

export function getJsonForm(value: any): GroupFieldModel {
    return Builder.buildFromJson(
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
                                placeholder: 'Checkbox'
                            }
                        },
                        {
                            id: 'toggle',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALTOGGLE,
                            attrs: {
                                placeholder: 'Toggle'
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
                                placeholder: 'Input',
                                label: 'Input',
                                type: 'text'
                            },
                            actions: {
                                test: {
                                    target: 'DEMO_ALERT',
                                    params: 'textarea'
                                }
                            },
                            defaultValue: 6
                        },
                        {
                            id: 'textarea',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALTEXTAREA,
                            attrs: {
                                placeholder: 'Textarea',
                                label: 'Textarea',
                                autoResize: true
                            }
                        },
                        {
                            id: 'datepicker',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALDATEPICKER,
                            attrs: {
                                placeholder: 'Datepicker',
                                label: 'Datepicker'
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
                            id: 'select',
                            type: ModelType.CONTROL,
                            model: PERFORMULAR_MODEL_MATERIALRADIO,
                            attrs: {
                                placeholder: 'Select',
                                label: 'Select',
                                options: {
                                    target: 'TEST_DATASOURCE',
                                    resetInvisibleValue: true
                                },
                                addNoneValue: true
                            }
                        }
                    ]
                }
            ]
        },
        value
    );
}
