export class TransactionNode<T> {
    private _visited: boolean = false;
    public children: TransactionNode<T>[] = [];
    constructor(public item: T, public parent?: TransactionNode<T>) {}

    public getNextNode(): TransactionNode<T> | undefined {
        const unvisitedChilds: TransactionNode<T>[] = this.children.filter(
            (child: TransactionNode<T>) => !child._visited
        );
        if (unvisitedChilds.length > 0) {
            return unvisitedChilds[0];
        } else {
            if (this.parent) {
                return this.parent.getNextNode();
            }
            return undefined;
        }
    }

    public visit(): void {
        this._visited = true;
    }
}

export class TransactionQueue<T> {
    private _head: TransactionNode<T>;
    private _activeNode: TransactionNode<T> | undefined;

    constructor(head: T) {
        this._head = new TransactionNode<T>(head);
        this._head.visit();
        this._activeNode = this._head;
    }

    public isEmpty(): boolean {
        return this._head.children.length === 0;
    }

    public addNode(item: T): void {
        if (!this._activeNode) {
            return;
        }
        this._activeNode.children.push(
            new TransactionNode(item, this._activeNode)
        );
    }

    public getNextNode(): TransactionNode<T> | undefined {
        if (!this._activeNode) {
            return;
        }
        const node:
            | TransactionNode<T>
            | undefined = this._activeNode.getNextNode();
        this._activate(node);
        return node;
    }

    private _activate(node: TransactionNode<T> | undefined): void {
        if (node) {
            node.visit();
        }
        this._activeNode = node;
    }
}
