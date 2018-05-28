import { forkJoin, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { generateUUID } from '../misc';
import { use } from '../mixin';
import { CheckList } from './effect';
import { Framework, IFramework } from './framework';
import { IItem, Item } from './item';

export interface IAbstract<T extends string, A, S extends string> {
    type: T;
    id: string;
    framework: IFramework<A, S>;
    item?: IItem;
}

export interface Abstract<A = any, S extends string = any> extends Item, Framework<A, S> { }

// @dynamic
export abstract class Abstract<A = any, S extends string = any> {
    private _type: string;
    private _id: string;
    private _uuid: string;

    @use(Item, Framework) public this: Abstract<A, S> | undefined;

    get id(): string {
        return this._id;
    }

    get uuid(): string {
        return this._uuid;
    }

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
        this._id = abstract.id;
        this._uuid = generateUUID();
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

    protected abstract _run(checklist: CheckList): Observable<void>;
    protected abstract _update(): void;

    protected _treeUp(): void {
        this._update();
        if (this.parent()) {
            this.parent()._treeUp();
        }
    }

    protected _treeDown(checklist: CheckList): Observable<void> {
        const children: Abstract[] = this.getChildren();
        if (children.length === 0) {
            return this._run(checklist).pipe(
                map(() => this._treeUp())
            );
        }
        return this._run(checklist).pipe(
            concatMap(() =>
                forkJoin(
                    ...children.map((c: Abstract) => c._treeDown(checklist))
                )
            )
        );
    }

}
