import { Observable } from 'rxjs';

import { LoaderService } from '../helpers/loader.service';
import { IMetaData } from '../helpers/metadata-store';
import { FieldSchema } from '../schemas/field.schema';
import { IEffectOptions } from './models/effect-options.interface';
import { RunDetection } from './models/run-detection.enum';

export abstract class EffectHandler<DefType, InstType, ResType> {

    public definition: DefType;
    public metadata: IMetaData<IEffectOptions> | undefined;
    public instance: InstType | undefined;

    constructor(definition: DefType) {
        this.definition = definition;
        this.metadata = this.getMetadata();

        if (this.metadata) {
            this.instance = LoaderService.get(this.metadata.target);
            if (!this.instance) {
                this._throwNoMetadataError();
            }
        } else {
            this._throwNoMetadataError();
        }
    }

    public abstract run(field: FieldSchema, checked: boolean): Observable<ResType | undefined>;

    public abstract getMetadata(): IMetaData<IEffectOptions> | undefined;

    public getRunDetection(): RunDetection {
        return (this.metadata && this.metadata.meta.runDetection) ? this.metadata.meta.runDetection : RunDetection.SelfChanged;
    }

    protected _throwNoMetadataError(): void {
        throw new Error('No Metadata defined');
    }
}
