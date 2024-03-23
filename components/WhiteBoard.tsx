import React, { useEffect, useRef, useState } from "react";

import io from "Socket.IO-client";
import CanvasBoard, { ToolbarNodeType } from "../models/board/canvas/CanvasBoard";
import RectNode from "../models/board/base/RectNode";
import RectTextNode from "../models/board/base/RectTextNode";
let socket;

type Props = {};
let canvasBoard: CanvasBoard;

const WhiteBoard: React.FC<Props> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getCanvas = () => canvasRef.current;

  const selectNodeHandler = (node: RectNode) => {
    setSelectedNode(node);

    if (node instanceof RectTextNode) {
      setSelectedNodeText(node.text);
    }
  };

  const fitCanvasToContainer = () => {
    const canvas = getCanvas();
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  useEffect(() => {
    fitCanvasToContainer();
    canvasBoard = new CanvasBoard(getCanvas());
    canvasBoard.onNodeSelect(selectNodeHandler)

    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
  };

  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    canvasBoard.handleCanvasClick(event);
  };

  const [toolbarNodeType, setToolbarNodeType] = useState(ToolbarNodeType.Select);
  const [selectedNodeText, setSelectedNodeText] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<RectNode>(null);

  return (
    <div id="board-root">
      <div className="left-menu">
        <div>
          <button
            className={toolbarNodeType === ToolbarNodeType.Select ? "__selected" : ""}
            onClick={() => {
              console.log(canvasBoard);
              setToolbarNodeType(ToolbarNodeType.Select);
              canvasBoard.selectedToolbarNodeType = ToolbarNodeType.Select;
            }}
          >
            Select
          </button>
        </div>
        <div>
          <button
            className={toolbarNodeType === ToolbarNodeType.StickyNote ? "__selected" : ""}
            onClick={() => {
              setToolbarNodeType(ToolbarNodeType.StickyNote);
              canvasBoard.selectedToolbarNodeType = ToolbarNodeType.StickyNote;
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
      {selectedNode && (
        <div
          className="note-box"
          style={{
            top: selectedNode.y - 15,
            left: selectedNode.x - 15,
            width: selectedNode.w + 30,
            height: selectedNode.h + 30,
          }}
        >
          <textarea
            rows={3}
            value={selectedNodeText}
            onChange={(event) => {
              setSelectedNodeText(event.currentTarget.value);
              if (selectedNode instanceof RectTextNode) {
                selectedNode.text = event.currentTarget.value;
              }
            }}
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
