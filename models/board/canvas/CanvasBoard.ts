import StickyNote from "../StickyNote";
import BoardNode from "../base/BoardNode";
import RectNode from "../base/RectNode";
import RectTextNode from "../base/RectTextNode";

export default class CanvasBoard {
  _maxHeight: number = 10000;
  _maxWidth: number = 10000;
  _gridCellSize: number = 50;

  canvas: HTMLCanvasElement;
  context2d: CanvasRenderingContext2D;

  nodes: BoardNode[] = [];

  selectedToolbarNodeType: ToolbarNodeType = ToolbarNodeType.Select;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context2d = canvas.getContext("2d");

    this.drawBackground();
    this.drawGrid();
  }

  drawNode(node: BoardNode) {
    node.draw(this.context2d);
  }

  private _onNodeSelectHandler: { (node?: RectNode): void };
  onNodeSelect(handler: { (node?: RectNode): void }) {
    this._onNodeSelectHandler = handler;
  }

  handleCanvasClick(event: React.MouseEvent<HTMLCanvasElement>) {
    var rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    switch (this.selectedToolbarNodeType) {
      case ToolbarNodeType.Select: {
        this.handleSelectClick(position);
        break;
      }
      case ToolbarNodeType.StickyNote: {
        this.handleStickyNoteclick(position);
        break;
      }
    }
  }

  private handleStickyNoteclick(position: { x: number; y: number; }) {
    if (!this.canCreateRectNode(position)) return;

    const newNote = new StickyNote({
      x: position.x,
      y: position.y,
      h: 100,
      w: 100,
      text: "",
      selected: false,
    });

    this.nodes.push(newNote);

    newNote.draw(this.context2d);
  }

  private canCreateRectNode(position: { x: number; y: number; }) {
    return !this.nodes
      .filter((n) => n instanceof RectNode)
      .some(
        (n: RectNode) => position.x >= n.x &&
          position.x <= n.x + n.w &&
          position.y >= n.y &&
          position.y <= n.y + n.h
      );
  }

  private handleSelectClick(position: { x: number; y: number; }) {
    const selectedNode = this.nodes
      .filter((n) => n instanceof RectNode)
      .find(
        (n: RectNode) => position.x >= n.x &&
          position.x <= n.x + n.w &&
          position.y >= n.y &&
          position.y <= n.y + n.h
      ) as RectNode;

    const previousSelectedNode = this.nodes.find(n => n.selected);
    this.nodes.forEach(n => n.selected = false);

    if (selectedNode) {
      selectedNode.selected = true;

      if (selectedNode instanceof StickyNote) {
        selectedNode.resetView(this.context2d);
      }

    } else {
      if (previousSelectedNode instanceof RectTextNode) {
        if (previousSelectedNode instanceof StickyNote) {
          previousSelectedNode.redrawText(this.context2d);
        }
      }
    }

    this._onNodeSelectHandler(selectedNode);
  }

  private drawBackground() {
    this.context2d.fillStyle = "#FCFBF9";
    this.context2d.fillRect(0, 0, this._maxWidth, this._maxHeight);
  }

  private drawGrid() {
    this.context2d.beginPath();

    this.context2d.lineWidth = 0.01;

    const colsNumber = Math.round(this._maxWidth / this._gridCellSize);
    for (var i = 1; i <= colsNumber; i++) {
      this.context2d.moveTo(this._gridCellSize * i, 0);
      this.context2d.lineTo(this._gridCellSize * i, this._maxHeight);
      this.context2d.stroke();
    }

    const rowsNumber = Math.round(this._maxHeight / this._gridCellSize);
    for (var i = 1; i <= rowsNumber; i++) {
      this.context2d.moveTo(0, this._gridCellSize * i);
      this.context2d.lineTo(this._maxWidth, this._gridCellSize * i);
      this.context2d.stroke();
    }
  }
}

export const enum ToolbarNodeType {
  Select = 0,
  StickyNote = 1,
}
