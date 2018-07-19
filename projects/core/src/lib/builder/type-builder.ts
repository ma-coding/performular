import { GroupOptions } from '../decorator/types/group-options';
import { Metadata } from '../metadata/metadata';
import { MetadataFormstate } from '../metadata/types/metadata-formstate';
import { GroupFieldModel } from '../model/group-field-model';
import { InstanceDef } from '../util/types/instance-def';

export class TypeBuilder {
    public static build<K>(target: InstanceDef<K>, value: K): GroupFieldModel {
        const metadataFormstate: MetadataFormstate = Metadata.getFormItem(
            target
        );
        const mainGroup: GroupOptions = metadataFormstate.groups[0];
        return new GroupFieldModel({
            attrs: mainGroup.attrs,
            forcedDisabled: mainGroup.forcedDisabled,
            forcedError: mainGroup.forcedError,
            forcedHidden: mainGroup.forcedHidden,
            id: mainGroup.id,
            model: mainGroup.model,
            validations: mainGroup.validations,
            visibilities: mainGroup.visibilities,
            children: [
                // new LayoutModel({
                //     layout: mainGroup.layout.layout,
                //     layoutAlign: mainGroup.layout.layoutAlign,
                //     layoutGap: mainGroup.layout.layoutGap,
                //     children: mainGroup.layout.children.map((child: any) => {
                //     })
                // })
            ]
        });
    }
}
