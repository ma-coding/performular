import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { createObservable } from '../../helpers/maybe-observable';
import { IMetaData, MetadataStore } from '../../helpers/metadata-store';
import { FieldSchema } from '../../schemas/field.schema';
import { EffectHandler } from '../effect.handler';
import { IEffectOptions } from '../models/effect-options.interface';
import { RunDetection } from '../models/run-detection.enum';
import { IVisibleDefinition } from './models/visible-definition.interface';
import { IVisibleInternalResult } from './models/visible-internal-result.interface';
import { IVisible } from './models/visible.interface';

export class VisibleHandler extends EffectHandler<IVisibleDefinition, IVisible, IVisibleInternalResult> {

    constructor(definition: IVisibleDefinition) {
        super(definition);
    }

    public run(field: FieldSchema, checked: boolean): Observable<IVisibleInternalResult | undefined> {
        if (!this.instance || !this.metadata) {
            this._throwNoMetadataError();
            return of(undefined);
        }
        if (checked || this.getRunDetection() === RunDetection.AnyChanged) {
            return createObservable(this.instance.onCalculate(field, this.definition.params)).pipe(
                map((result: boolean) => {
                    return {
                        value: result,
                        name: this.definition.visible,
                        mode: this.definition.mode
                    };
                })
            );
        } else {
            return of(undefined);
        }
    }

    public getMetadata(): IMetaData<IEffectOptions> | undefined {
        return MetadataStore.getVisible(this.definition.visible);
    }
}
