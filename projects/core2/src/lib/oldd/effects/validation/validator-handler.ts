import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { createObservable } from '../../helpers/maybe-observable';
import { IMetaData, MetadataStore } from '../../helpers/metadata-store';
import { FieldSchema } from '../../schemas/field.schema';
import { EffectHandler } from '../effect.handler';
import { IEffectOptions } from '../models/effect-options.interface';
import { RunDetection } from '../models/run-detection.enum';
import { IValidatorDefinition } from './models/validator-definition.interface';
import { IValidatorInternalResult } from './models/validator-internal-result.interface';
import { IValidatorResult } from './models/validator-result.interface';
import { IValidator } from './models/validator.interface';

export class ValidatorHandler extends EffectHandler<IValidatorDefinition, IValidator, IValidatorInternalResult> {

    constructor(definition: IValidatorDefinition) {
        super(definition);
    }

    public getMetadata(): IMetaData<IEffectOptions> | undefined {
        return MetadataStore.getValidator(this.definition.validator);
    }

    public run(field: FieldSchema, checked: boolean): Observable<IValidatorInternalResult | undefined> {
        if (!this.instance || !this.metadata) {
            this._throwNoMetadataError();
            return of(undefined);
        }
        if (checked || this.getRunDetection() === RunDetection.AnyChanged) {
            return createObservable(this.instance.onValidate(field, this.definition.params)).pipe(
                map((result: IValidatorResult) => {
                    return {
                        ...result,
                        errorMsg: this._buildErrorMsg(result.msgParams || {}, this.definition.errorMsg),
                        name: this.metadata ? this.definition.validator : ''
                    };
                })
            );
        } else {
            return of(undefined);
        }
    }

    public instanceRendered(field: FieldSchema): void {
        if (!this.instance || !this.metadata) {
            return;
        }
        if (this.instance.onInstanceRendered) {
            this.instance.onInstanceRendered(field, this.definition.params);
        }
    }

    private _buildErrorMsg(params: { [key: string]: any }, msg: string): string {
        let errorMsg: string = msg;
        Object.keys(params).forEach((key: string) => {
            errorMsg = errorMsg.split(key).join(params[key]);
        });
        return errorMsg;
    }
}
