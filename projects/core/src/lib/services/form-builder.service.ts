import { Injectable } from '@angular/core';

import { ArrayField } from '../fields/array-field';
import { ControlField } from '../fields/control-field';
import { GroupField } from '../fields/group-field';
import { LayoutField } from '../fields/layout-field';

export interface IBuildConverter {
    converter: string;
    params?: any;
}

export interface IBuildGenerator {
    generator: string;
    params?: any;
}

export interface IBuildTrigger {
    trigger: string;
    params?: any;
    onlySelf?: boolean;
}

export interface IBuildAbstract {
    type: 'CONTROL' | 'LAYOUT' | 'ARRAY' | 'GROUP';
    bindings: any;
    component: string;
    converter?: IBuildConverter;
    children?: (IBuildField | IBuildLayout)[] | IBuildGenerator;
}

export interface IBuildField extends IBuildAbstract {
    id: string;
    value?: any;
    focus?: boolean;
    forceDisabled?: boolean;
    forceHidden?: boolean;
    disabledWhen?: IBuildTrigger[];
    hiddenWhen?: IBuildTrigger[];
    errorWhen?: IBuildTrigger[];
}

export interface IBuildLayout extends IBuildAbstract {
    autoHide?: boolean;
}

@Injectable()
export class FormBuilder {

    public create(conf: IBuildField | IBuildLayout): LayoutField<any> | ControlField<any> | GroupField<any> | ArrayField<any> {
        switch (conf.type) {
            case 'CONTROL': {
                return this._createControl(conf as IBuildField);
            }
            case 'GROUP': {
                return this._createGroup(conf as IBuildField);
            }
            case 'ARRAY': {
                return this._createArray(conf as IBuildField);
            }
            case 'LAYOUT': {
                return this._createLayout(conf);
            }
        }

    }

    private _createControl(conf: IBuildField): ControlField<any> {
        return new ControlField({
            component: conf.component,
            bindings: conf.bindings,
            converter: conf.converter,
            value: conf.value || undefined,
            id: conf.id,
            focus: conf.focus,
            forceDisabled: conf.forceDisabled,
            forceHidden: conf.forceHidden,
            disabledWhen: conf.disabledWhen,
            errorWhen: conf.errorWhen,
            hiddenWhen: conf.hiddenWhen
        });
    }

    private _createGroup(conf: IBuildField): GroupField<any> {
        return new GroupField({
            component: conf.component,
            bindings: conf.bindings,
            converter: conf.converter,
            id: conf.id,
            forceDisabled: conf.forceDisabled,
            forceHidden: conf.forceHidden,
            disabledWhen: conf.disabledWhen,
            errorWhen: conf.errorWhen,
            hiddenWhen: conf.hiddenWhen,
            children: (conf.children as any[]).map((child: any) => this.create(child))
        });
    }

    private _createArray(conf: IBuildField): ArrayField<any> {
        return new ArrayField({
            component: conf.component,
            bindings: conf.bindings,
            converter: conf.converter,
            id: conf.id,
            forceDisabled: conf.forceDisabled,
            forceHidden: conf.forceHidden,
            disabledWhen: conf.disabledWhen,
            errorWhen: conf.errorWhen,
            hiddenWhen: conf.hiddenWhen,
            value: conf.value,
            children: (conf.children as IBuildGenerator)
        });
    }

    private _createLayout(conf: IBuildLayout): LayoutField<any> {
        return new LayoutField({
            component: conf.component,
            bindings: conf.bindings,
            autoHide: conf.autoHide,
            children: (conf.children as any[]).map((child: any) => this.create(child)),
            converter: conf.converter
        });
    }
}
