import { Injectable } from '@angular/core';

import { IOnConvert } from '../../core/loaders/converter-loader';
import { FormConverter } from '../../decorators/converter.decorator';

/**
 * Default Form converter that is used if no other is specified.
 * @export
 */
@FormConverter({
    key: 'CORE_CONVERTER_DEFAULT'
})
@Injectable()
export class DefaultConverter implements IOnConvert<any, any, any> {

    /**
     * Converter Method that returns the parameter data.
     */
    public performularOnConvert(data: any, params?: any): any {
        return data;
    }
}
