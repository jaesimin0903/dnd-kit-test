import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const DraggableItem = ({ id, x, y, children, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    position: x !== undefined && y !== undefined ? "absolute" : "static",
    left: x !== undefined ? `${x}px` : undefined,
    top: y !== undefined ? `${y}px` : undefined,
    cursor: "grab",
    padding: "10px",
    border: "1px solid #ccc",
    background: "lightblue",
    boxSizing: "border-box",
    visibility: isDragging ? "hidden" : "visible", // 드래그 중이면 숨기기
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  const style = {
    width: "100%",
    height: "500px",
    border: "2px dashed #ccc",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const App = () => {
  const [droppedItems, setDroppedItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null); // 현재 드래그 중인 아이템 정보

  const handleDragStart = (event) => {
    setActiveItem(event.active.id); // 드래그 시작 시 활성화된 아이템의 ID 저장
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;

    setActiveItem(null); // 드래그 중인 아이템 해제

    if (over?.id === "droppable-area") {
      const rect = over.rect;
      const x = active.rect.current.translated.left - rect.left;
      const y = active.rect.current.translated.top - rect.top;

      setDroppedItems((items) => {
        const existingItemIndex = items.findIndex((item) => item.id === active.id);

        if (existingItemIndex !== -1) {
          // 기존 요소 위치 업데이트
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], x, y };
          return updatedItems;
        } else {
          // 새 요소 추가
          return [
            ...items,
            {
              id: generateId(),
              componentId: active.id,
              x,
              y,
            },
          ];
        }
      });
    }
  };

  const renderDroppedItems = () =>
    droppedItems.map((item) => (
      <DraggableItem
        key={item.id}
        id={item.id}
        x={item.x}
        y={item.y}
        isDragging={activeItem === item.id} // 현재 드래그 중인지 확인
      >
        {item.componentId}
      </DraggableItem>
    ));

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* 외부에서 드래그 가능한 원본 요소 */}
        <DraggableItem id="Item 1" isDragging={activeItem === "Item 1"}>
          Item 1
        </DraggableItem>
        <DraggableItem id="Item 2" isDragging={activeItem === "Item 2"}>
          Item 2
        </DraggableItem>
        <DraggableItem id="Item 3" isDragging={activeItem === "Item 3"}>
          Item 3
        </DraggableItem>
      </div>

      {/* Droppable 컴포넌트 */}
      <Droppable id="droppable-area">{renderDroppedItems()}</Droppable>

      {/* DragOverlay로 드래그 미러링 요소 스타일 제어 */}
      <DragOverlay>
        {activeItem ? (
          <div
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              background: "lightblue",
              boxSizing: "border-box",
            }}
          >
            {activeItem} {/* 드래그 중 텍스트 표시 */}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
