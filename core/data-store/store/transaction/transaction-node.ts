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
