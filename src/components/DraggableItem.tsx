import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { Resizable } from "re-resizable";

const DraggableItem = ({ id,initX,initY,zIndex, x, y, imgSrc }) => {

  const [isResizing, setIsResizing] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
      data : {imgSrc}
    });
    //const listenersOnState = isResizing ? { ...listeners } : undefined;

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
      left: x !== undefined ? `${x}px` : undefined,
      top: y !== undefined ? `${y}px` : undefined,
    width: initX,
    height: initY,
    zIndex:zIndex,
    position: "relative",
    display:"flex",
    justifyContent:"center",
    cursor: "grab",
    padding:"10px"
  };

  return (
      <div ref={setNodeRef} style={style}>

        <Resizable style={{padding:"10px",border:"2px solid"}}>
      <img  {...listeners} {...attributes}
        src={imgSrc}
        alt={id}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",

        }}
      />
    </Resizable>
      {/* Resize Handles */}
      
    </div>
  );
};

const resizeHandleStyle = (position) => ({
  position: "absolute",
  width: "10px",
  height: "10px",
  background: "blue",
  cursor: `${position}-resize`,
  ...(position.includes("top") && { top: "-5px" }),
  ...(position.includes("bottom") && { bottom: "-5px" }),
  ...(position.includes("left") && { left: "-5px" }),
  ...(position.includes("right") && { right: "-5px" }),
});

  export default DraggableItem