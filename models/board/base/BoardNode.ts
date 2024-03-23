export default abstract class BoardNode {
    x: number;
    y: number;

    private _selected: boolean = false;
    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;

        if (this.onSelectedChangeHandler) {
            this.onSelectedChangeHandler(value);
        }
    }

    onSelectedChangeHandler: { (value: boolean): void };

    abstract draw(ctx: CanvasRenderingContext2D): void;
}