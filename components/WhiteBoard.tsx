import React, { useEffect, useRef, useState } from "react";

import io from "Socket.IO-client";
let socket;

type Props = {};

type Note = {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  selected: boolean;
};

const WhiteBoard: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxHeight = 10000;
  const maxWidth = 10000;

  const [notes, setNotes] = useState<Note[]>([]);

  const drawNote = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(x, y, 100, 100);

    ctx.fillStyle = "#FFFFBC";
    ctx.fillRect(x, y, 100, 100);
  };

  const drawNoteText = (ctx: CanvasRenderingContext2D, note: Note) => {
    ctx.fillStyle = "#FFFFBC";
    ctx.fillRect(note.x, note.y, note.w, note.h);

    // start with a large font size
    var fontsize = 300;
    const fontface = "Arial";

    // lower the font size until the text fits the canvas
    do {
      fontsize--;
      ctx.font = fontsize + "px " + fontface;
    } while (ctx.measureText(note.text).width > note.w - 10);

    ctx.fillStyle = "black";
    ctx.fillText(note.text, note.x + 10, note.y + note.h / 2);
  };

  const createNote = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    if (
      notes.some(
        (n) => x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h
      )
    ) {
      return;
    }

    const newNote = {
      x: x,
      y: y,
      h: 100,
      w: 100,
      text: "",
      selected: false,
    };

    notes.push(newNote);

    socket.emit("create-note", newNote);

    drawNote(ctx, x, y);
  };

  const handleUpdateNotes = (note: Note) => {
    if (
      notes.some(
        (n) => note.x >= n.x && note.x <= n.x + n.w && note.y >= n.y && note.y <= n.y + n.h
      )
    ) {
      return;
    }

    notes.push(note);

    drawNote(context, note.x, note.y);
  };

  const selectNote = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const selectedNoteLocal = notes.find(
      (n) => x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h
    );

    if (selectedNoteLocal) {
      selectedNoteLocal.selected = true;
      setSelectedNote(selectedNoteLocal);
      setSelectedNoteText(selectedNoteLocal.text);

      ctx.fillStyle = "#FFFFBC";
      ctx.fillRect(
        selectedNoteLocal.x,
        selectedNoteLocal.y,
        selectedNoteLocal.w,
        selectedNoteLocal.h
      );
    } else {
      const previousSelection = selectedNote;
      const previousNoteText = selectedNoteText;
      if (previousSelection) {
        previousSelection.selected = false;
        previousSelection.text = previousNoteText;

        drawNoteText(ctx, previousSelection);
      }

      setSelectedNote(null);
      setSelectedNoteText("");
    }
  };

  const [selectedNote, setSelectedNote] = useState<Note>(null);
  const [selectedNoteText, setSelectedNoteText] = useState<string>("");

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#FCFBF9";
    ctx.fillRect(0, 0, maxWidth, maxHeight);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, sideSize: number) => {
    ctx.beginPath();

    ctx.lineWidth = 0.01;

    const colsNumber = Math.round(maxWidth / sideSize);
    for (var i = 1; i <= colsNumber; i++) {
      ctx.moveTo(sideSize * i, 0);
      ctx.lineTo(sideSize * i, maxHeight);
      ctx.stroke();
    }

    const rowsNumber = Math.round(maxHeight / sideSize);
    for (var i = 1; i <= rowsNumber; i++) {
      ctx.moveTo(0, sideSize * i);
      ctx.lineTo(maxWidth, sideSize * i);
      ctx.stroke();
    }
  };

  const fitToContainer = (canvas: HTMLCanvasElement) => {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  let context;

  useEffect(() => {
    const canvas = canvasRef.current;
    context = canvas.getContext("2d");

    fitToContainer(canvas);

    drawBackground(context);
    drawGrid(context, 50);

    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on('update-notes', msg => {
      handleUpdateNotes(msg as Note);
    })
  };

  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    var rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const ctx = event.currentTarget.getContext("2d");
    if (isCreateMode) createNote(ctx, position.x, position.y);
    else if (isSelectMode) selectNote(ctx, position.x, position.y);
  };

  const [isSelectMode, setSelectMode] = useState(true);
  const [isCreateMode, setCreateMode] = useState(false);

  return (
    <div id="board-root">
      <div className="left-menu">
        <div>
          <button
            className={isSelectMode ? "__selected" : ""}
            onClick={() => {
              setSelectMode(true);
              setCreateMode(false);
            }}
          >
            Select
          </button>
        </div>
        <div>
          <button
            className={isCreateMode ? "__selected" : ""}
            onClick={() => {
              setSelectMode(false);
              setCreateMode(true);
            }}
          >
            Note
          </button>
        </div>
      </div>
      <div className="board-fixed-container">
        <canvas
          onMouseDown={onCanvasClick}
          ref={canvasRef}
          {...props}
          style={{
            position: "absolute",
            bottom: "0px",
            left: "0px",
            cursor: "default",
          }}
        />
      </div>
      {selectedNote && (
        <div
          className="note-box"
          style={{
            top: selectedNote.y - 15,
            left: selectedNote.x - 15,
            width: selectedNote.w + 30,
            height: selectedNote.h + 30,
          }}
        >
          <textarea
            rows={3}
            value={selectedNoteText}
            onChange={(event) => setSelectedNoteText(event.currentTarget.value)}
          />
        </div>
      )}

      <style jsx global>{``}</style>
      <style jsx>{`
        .note-box {
          z-index: 1000;
          position: absolute;
          border: 2px solid blue;
          display: grid;
          place-items: center;
          padding: 0 15px 0 15px;
        }

        .note-box > textarea {
          width: 100%;
          resize: none;
          background: none;
        }

        .left-menu {
          background: white;
          z-index: 1000;
          position: relative;
          display: flex;
          flex-direction: column;
          width: 80px;
          height: 400px;
        }

        .left-menu > div > button {
          margin: 10px;
          width: 60px;
          height: 50px;
        }

        .left-menu > div > button.__selected {
          color: red;
        }

        .canvas-container {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: clip;
        }

        .board-fixed-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        canvas {
          display: inline-block;
          vertical-align: baseline;
        }

        .absolute-fill-container {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          pointer-events: none !important;
        }

        .absolute-fill-container > * {
          pointer-events: all;
        }

        .main-board {
        }
      `}</style>
    </div>
  );
};

export default WhiteBoard;
