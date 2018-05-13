import { Injectable, InjectionToken, Injector, Type } from '@angular/core';

import 'reflect-metadata';

import { flatten } from './helpers';

export interface IMetadataTarget {
    metadata: any;
    target: Type<any>;
}

/**
 * Injectable Service that holds the Injector inside a static member, for usage outside Angular.
 * @export
 * @dynamic
 */
@Injectable()
export class LoaderService {

    /**
     * Static member that holds the Injector.
     */
    public static injector: Injector | undefined;

    public static get<InstanceType>(target: Type<InstanceType>): InstanceType | undefined {
        this._throwError();
        return (<Injector>this.injector).get<InstanceType>(target, undefined);
    }

    public static getMetadata<MetadataType>(target: Type<any>, key: string): MetadataType | undefined {
        return Reflect.getMetadata(key, target);
    }

    public static getFromString(definition: string, key: string, token: InjectionToken<any>): IMetadataTarget | undefined {
        this._throwError();
        return flatten((<Injector>this.injector).get<any[][]>(token, []))
            .map((def: Type<any>) => ({
                metadata: this.getMetadata<any>(def, key),
                target: def
            }))
            .find((deco: IMetadataTarget) => {
                return definition === deco.metadata.id;
            });
    }

    private static _throwError(): void {
        if (!this.injector) {
            throw new Error(
                'No Injector provided please import PerformularCoreModule to your ngModule'
            );
        }
    }

    /**
     * Method that connects the Injector with the static member.
     */
    public connect(injector: Injector): void {
        if (!LoaderService.injector) {
            LoaderService.injector = injector;
        }
    }

}
