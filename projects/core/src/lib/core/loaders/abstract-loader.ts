import { InjectionToken, Type } from '@angular/core';

import 'reflect-metadata';

import { LoaderService } from '../../services/loader.service';
import { flatten } from '../misc/flatten';

/**
 * Abstract interface that describe the Decorator Function params
 * @export
 */
export interface IAbstractDecorationParams {
    key: string;
}

/**
 * Abstract interface that describe the saved Metadata
 * @export
 */
export interface IAbstractDecoration extends IAbstractDecorationParams {
    target: Type<any>;
}

/**
 * Abstract Class that manages the mapping from Decorated Class to Injectable Elements.
 * @export
 */
export abstract class AbstractLoader<DefinitionType> {

    /**
     * Member that holds the key for the metadata.
     */
    protected _decorationKey: string;

    /**
     * Member that holds the Injectiontoken for DI.
     */
    protected _injectionToken: InjectionToken<Type<DefinitionType>>;

    /**
     * Member that holds the target class that is Injectable.
     */
    protected _target: Type<DefinitionType>;

    /**
     * Getter that gives public access to the target class.
     */
    get target(): Type<DefinitionType> {
        return this._target;
    }

    constructor(
        decorationKey: string,
        injectionToken: InjectionToken<Type<DefinitionType>>,
        definition: string | Type<DefinitionType>
    ) {
        this._decorationKey = decorationKey;
        this._injectionToken = injectionToken;
        if (typeof definition === 'string') {
            this._target = this._getDecorationFromString(definition);
        } else {
            this._target = definition;
        }
    }

    protected _getInstanceFromTarget(target: Type<DefinitionType>): DefinitionType {
        if (!LoaderService.injector) {
            throw new Error('NO INJECTOR OR INJECTIONTOKEN FOUND');
        }
        const instance: DefinitionType | undefined = LoaderService.injector.get<DefinitionType>(target, undefined);
        if (!instance) {
            throw new Error('NOT INJECTABLE');
        }
        return instance;
    }

    private _getDecorationFromString(defintion: string): Type<DefinitionType> {
        if (!this._injectionToken || !LoaderService.injector) {
            throw new Error('NO INJECTOR OR INJECTIONTOKEN FOUND');
        }
        const decoration: IAbstractDecoration | undefined =
            flatten<Type<DefinitionType>>(LoaderService.injector.get<Type<DefinitionType>[][]>(this._injectionToken, []))
                .map((def: Type<DefinitionType>) => this._getDecorationFromTarget(def))
                .find((deco: IAbstractDecoration) => {
                    return defintion === deco.key;
                });

        if (!decoration) {
            throw new Error('NO DECORATION FOUND');
        }
        return decoration.target;
    }

    private _getDecorationFromTarget(target: Function): IAbstractDecoration {
        const decoration: IAbstractDecoration = Reflect.getMetadata(this._decorationKey, target) as IAbstractDecoration;
        if (!decoration) {
            throw new Error('NO DECORATION');
        }
        return decoration;
    }

}
