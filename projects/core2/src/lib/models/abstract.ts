import { use } from '../mixin';
import { Framework, IFramework } from './framework';
import { IItem, Item } from './item';
import { IStyle, Style } from './style';

export interface IAbstract<T extends string, A, S extends string> {
    type: T;
    framework: IFramework<A>;
    item?: IItem;
    style?: IStyle<S>;
}

export interface Abstract<A, S extends string> extends Item, Style<S>, Framework<A> { }

// @dynamic
export abstract class Abstract<A = any, S extends string = any> {
    private _type: string;

    @use(Item, Style, Framework) public this: Abstract<A, S> | undefined;

    get isContainer(): boolean {
        return this._type === 'container';
    }

    get isControl(): boolean {
        return this._type === 'control';
    }

    get isGroup(): boolean {
        return this._type === 'group';
    }

    get isArray(): boolean {
        return this._type === 'array';
    }

    get isField(): boolean {
        return !this.isContainer;
    }

    constructor(abstract: IAbstract<string, A, S>) {
        this._type = abstract.type;
        this._initStyle(abstract.style);
        this._initItem(abstract.item);
        this._initFramework(abstract.framework);
    }

    public getChildren(): Abstract[] {
        const children: Abstract[] = [];
        this._forEachChild((child: Abstract) => {
            children.push(child);
        });
        return children;
    }

    protected abstract _forEachChild(cb: (child: Abstract) => void): void;

}
