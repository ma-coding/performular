import { Facade } from '../facade/facade';
import { AbstractField } from '../fields/abstract-field/abstract-field';
import { Abstract } from '../fields/abstract/abstract';
import { flatten } from '../utils/flatten';
import { StructurOptions } from './types/structur-options';
import { StructurState } from './types/structur-state';

export abstract class Structur {
    protected abstract _structurFacade: Facade;

    get all(): Abstract[] {
        return [
            this._structurFacade.abstractField,
            ...flatten(this.children.map((c: Abstract) => (<any>c)._facade.all))
        ];
    }

    get root(): Abstract {
        let field: Abstract | undefined = this._structurFacade.abstractField;
        while (field.parent) {
            field = field.parent;
        }
        return field;
    }

    get parent(): Abstract | undefined {
        return this._structurFacade.select('parent');
    }

    get parentField(): AbstractField | undefined {
        let field: Abstract | undefined = this._structurFacade.parent;
        while (field) {
            if (field instanceof AbstractField) {
                return field;
            }
            field = field.parent;
        }
        return undefined;
    }

    get children(): Abstract[] {
        return this._structurFacade.select('children');
    }

    public setParent(parent: Abstract): void {
        this._structurFacade.updateKey('parent', parent);
    }

    protected _initStructur(options: StructurOptions): StructurState {
        return {
            ...options,
            parent: undefined
        };
    }
}
