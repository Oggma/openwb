import RectTextNode from "./base/RectTextNode";

export default class StickyNote extends RectTextNode {
  public constructor(init?: Partial<StickyNote>) {
    super();
    Object.assign(this, init);
  }

  public override draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = "#FFFFBC";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  public resetView(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#FFFFBC";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  public redrawText(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#FFFFBC";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // start with a large font size
    var fontsize = 300;
    const fontface = "Arial";

    // lower the font size until the text fits the canvas
    do {
      fontsize--;
      ctx.font = fontsize + "px " + fontface;
    } while (ctx.measureText(this.text).width > this.w - 10);

    ctx.fillStyle = "black";
    ctx.fillText(this.text, this.x + 10, this.y + this.h / 2);
  }
}