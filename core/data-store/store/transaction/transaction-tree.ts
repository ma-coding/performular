import { TransactionNode } from './transaction-node';

export class TransactionTree<T> {
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
