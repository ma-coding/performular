import { ContainerOptions } from '../decorator/types/container-options';
import { ControlOptions } from '../decorator/types/control-options';
import { GroupOptions } from '../decorator/types/group-options';
import { ItemOptions } from '../decorator/types/item-options';
import { LayoutOptions } from '../decorator/types/layout-options';
import { ListOptions } from '../decorator/types/list-options';
import { SubGroupOptions } from '../decorator/types/sub-group-options';
import { Framework } from '../framework/framework';
import { Modeler } from '../handler/modeler/modeler';
import { Metadata } from '../metadata/metadata';
import { MetadataFormstate } from '../metadata/types/metadata-formstate';
import { MetadataTarget } from '../metadata/types/metadata-target';
import { AbstractFieldModel } from '../model/abstract-field-model';
import { AbstractModel } from '../model/abstract-model';
import { ControlFieldModel } from '../model/control-field-model';
import { GroupFieldModel } from '../model/group-field-model';
import { LayoutModel } from '../model/layout-model';
import { ListFieldModel } from '../model/list-field-model';
import { ContainerModelOptions } from '../model/types/container-model-options';
import { ControlFieldModelOptions } from '../model/types/control-field-model-options';
import { ListFieldModelOptions } from '../model/types/list-field-model-options';
import { isString } from '../util/is-string';
import { InstanceDef } from '../util/types/instance-def';

// @dynamic
export class TypeBuilder {
    public static build<K>(
        target: InstanceDef<K>,
        value: K,
        id?: string
    ): GroupFieldModel {
        const metadataFormstate: MetadataFormstate = Metadata.getFormItem(
            target
        );
        const mainGroup: GroupOptions = metadataFormstate.groups[0];
        return new GroupFieldModel({
            attrs: mainGroup.attrs,
            forcedDisabled: mainGroup.forcedDisabled,
            forcedError: mainGroup.forcedError,
            forcedHidden: mainGroup.forcedHidden,
            id: id || mainGroup.id,
            model: mainGroup.model,
            validations: mainGroup.validations,
            visibilities: mainGroup.visibilities,
            children: [
                new LayoutModel({
                    layout: mainGroup.layout,
                    layoutAlign: mainGroup.layoutAlign,
                    layoutGap: mainGroup.layoutGap,
                    children: mainGroup.children.map((child: any) => {
                        return this._build(child, metadataFormstate, value);
                    })
                })
            ]
        });
    }

    private static _build(
        field: any,
        metadata: MetadataFormstate,
        value: any
    ): AbstractModel {
        if (this._isContainer(field)) {
            const modeler: Modeler = new Modeler(field.model);
            return modeler.build(<ContainerModelOptions>{
                ...field,
                children: field.children.map((c: any) => {
                    return this._build(c, metadata, value);
                })
            });
        } else if (this._isItem(field)) {
            const modeler: Modeler = new Modeler(Framework.getItemModel());
            return modeler.build(<any>{
                ...field,
                child: this._build(field.child, metadata, value)
            });
        } else if (this._isLayout(field)) {
            const modeler: Modeler = new Modeler(Framework.getLayoutModel());
            return modeler.build(<any>{
                ...field,
                children: field.children.map((c: any) => {
                    return this._build(c, metadata, value);
                })
            });
        } else if (isString(field)) {
            return this._buildField(
                field,
                metadata,
                value ? value[field] : null
            );
        } else {
            throw new Error('');
        }
    }

    private static _buildField(
        field: string,
        metadata: MetadataFormstate,
        value: any
    ): AbstractFieldModel {
        const ctrl:
            | MetadataTarget<ControlOptions> & { id: string }
            | undefined = <any>(
            metadata.controls.find((c: any) => c.id === field)
        );
        const list: MetadataTarget<ListOptions> & { id: string } | undefined = <
            any
        >metadata.lists.find((c: any) => c.id === field);
        const subGroup:
            | MetadataTarget<SubGroupOptions> & { id: string }
            | undefined = <any>(
            metadata.subGroups.find((c: any) => c.id === field)
        );
        if (ctrl) {
            const modeler: Modeler = new Modeler(ctrl.model);
            return <ControlFieldModel>modeler.build(<ControlFieldModelOptions>{
                ...ctrl,
                value: value
            });
        } else if (list) {
            const modeler: Modeler = new Modeler(list.model);
            return <ListFieldModel>modeler.build(<ListFieldModelOptions>{
                ...list,
                values: value,
                childGenerator: (val: any): AbstractModel =>
                    TypeBuilder.build(list.childTarget, val)
            });
        } else if (subGroup) {
            return TypeBuilder.build(subGroup.childTarget, value, subGroup.id);
        } else {
            throw new Error('');
        }
    }

    private static _isContainer(value: any): value is ContainerOptions<any> {
        return value && value.id;
    }

    private static _isLayout(value: any): value is LayoutOptions<any> {
        return value && !value.id && !!value.children;
    }

    private static _isItem(value: any): value is ItemOptions<any> {
        return value && !value.id && !!value.child;
    }
}
