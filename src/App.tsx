import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable, DragOverlay,MouseSensor  ,useSensor, useSensors } from "@dnd-kit/core";
import image from "./assets/empty-diary.png"
import d1 from "./assets/d1.png"
import d2 from "./assets/d2.png"
import d3 from "./assets/d3.png"
import d4 from "./assets/d4.png"
import d5 from "./assets/d5.png"
import d6 from "./assets/d6.png"
import DragSizeExample from "./components/dragAndResizeBtn"
import DraggableItem from "./components/DraggableItem"
import { CSS } from "@dnd-kit/utilities";

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  const style = {
    width: "100%",
    height: "100%",
    border: "2px dashed #ccc",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <img
        src={image}
        alt="Empty Diary"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      {children}
    </div>
  );
};

const App = () => {
  const [droppedItems, setDroppedItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [resizingItem, setResizingItem] = useState(null);
  const sensors = useSensors( useSensor(MouseSensor,{
    activationConstraint:{distance:10}
  }));

  const handleDragStart = (event) => {
    setActiveItem(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { over, active, delta } = event;
    setActiveItem(null);
  
    if (over?.id === "droppable-area") {
      const imgSrc = active.data?.current?.imgSrc || "";
  
      setDroppedItems((items) => {
        const existingItemIndex = items.findIndex((item) => item.id === active.id);
  
        if (existingItemIndex !== -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            x: updatedItems[existingItemIndex].x + delta.x,
            y: updatedItems[existingItemIndex].y + delta.y,
          };
          return updatedItems;
        } else {
          return [
            ...items,
            {
              id: generateId(),
              imgSrc,
              x: delta.x,
              y: delta.y,
              zIndex: items.length,
              width: 100,
              height: 100,
            },
          ];
        }
      });
    }
  };

  const renderDroppedItems = () =>
    droppedItems.map((item) => (
      <DraggableItem
        key={item.id} // 고유 키 설정
        id={item.id} // DraggableItem의 id
        initX="100px"
        initY="100px"
        zIndex={item.zIndex}
        x={item.x} // 초기 너비
        y={item.y} // 초기 높이
        imgSrc={item.imgSrc} // 이미지 소스
      />
    ));
  

  return (
    <>
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
  <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <DraggableItem id="Item 1" imgSrc={d1} initX={100} initY={100} />
      <DraggableItem id="Item 2" imgSrc={d2} initX={100} initY={100}  />
      <DraggableItem id="Item 3" imgSrc={d3} initX={100} initY={100}  />
      <DraggableItem id="Item 4" imgSrc={d4} initX={100} initY={100}  />
      <DraggableItem id="Item 5" imgSrc={d5} initX={100} initY={100}  />
      <DraggableItem id="Item 6" imgSrc={d6} initX={100} initY={100}  />

    </div>
    <Droppable id="droppable-area">{renderDroppedItems()}</Droppable>
  </div>

  <DragOverlay>
    {activeItem ? (
      <img
        src={null}
        alt="Drag Preview"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
        }}
      />
    ) : null}
  </DragOverlay>
</DndContext>;
    </>
  );
};

export default App;
