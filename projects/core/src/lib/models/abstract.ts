import { forkJoin, Observable, Subject } from 'rxjs';
import { buffer, concatMap, debounceTime, map } from 'rxjs/operators';

import { flatten, generateUUID } from '../misc';
import { use } from '../mixin';
import { CheckList } from './effect';
import { Framework, IFramework } from './framework';
import { IItem, Item } from './item';

export interface IAbstract<T extends string = any, F extends string = any, A = any, S extends string = any> {
    type: T;
    id: string;
    framework: IFramework<F, A, S>;
    item?: IItem;
}

export interface IAbstractParams<T extends string = any, F extends string = any, A = any, S extends string = any> {
    type: T;
    id: string;
    framework: IFramework<F, A, S>;
    item?: IItem;
}

export interface Abstract<
    T extends string = any, F extends string = any, A = any, S extends string = any
    > extends Item, Framework<F, A, S> { }

// @dynamic
export abstract class Abstract<
    T extends string = any,
    F extends string = any,
    A = any,
    S extends string = any
    > {
    private _type: string;
    private _id: string;
    private _uuid: string;
    private _updateSubject: Subject<CheckList>;

    @use(Item, Framework) public this: Abstract<T, F, A, S> | undefined;

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

    get updates$(): Observable<void> {
        return this._updateSubject.pipe(
            // tslint:disable-next-line:no-magic-numbers
            buffer(this._updateSubject.pipe(debounceTime(500))),
            map(flatten),
            concatMap((checkList: CheckList) => this._treeDown(checkList))
        );
    }

    constructor(abstract: IAbstractParams<T, F, A, S>) {
        this._type = abstract.type;
        this._id = abstract.id;
        this._uuid = generateUUID();
        this._initItem(abstract.item);
        this._initFramework(abstract.framework);
        this._updateSubject = new Subject();
    }

    public getChildren(): Abstract[] {
        const children: Abstract[] = [];
        this._forEachChild((child: Abstract) => {
            children.push(child);
        });
        return children;
    }

    public getChildListRecursive(): Abstract[] {
        return [
            this,
            ...flatten(this.getChildren().map((c: Abstract) => c.getChildListRecursive()))
        ];
    }

    public getRoot(): Abstract {
        let r: Abstract = this;
        while (r.parent) {
            const p: Abstract | undefined = r.parent;
            if (p) {
                r = p;
            } else {
                return r;
            }
        }
        return r;
    }

    public update(checklist: CheckList): void {
        this.getRoot()._updateSubject.next(checklist);
    }

    protected abstract _forEachChild(cb: (child: Abstract) => void): void;

    protected abstract _run(checklist: CheckList): Observable<void>;
    protected abstract _update(): void;

    protected _treeUp(): void {
        this._update();
        const p: Abstract | undefined = this.parent;
        if (p) {
            p._treeUp();
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

    protected _setParents(children: Abstract[]): void {
        children.forEach((c: Abstract) => {
            c.setParent(this);
        });
    }

}
