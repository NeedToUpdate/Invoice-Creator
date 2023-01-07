import { useState, DragEvent } from "react";

export function useDrag(): [Boolean, { onDragOver: (event: DragEvent<HTMLDivElement> | void) => void; onDragEnter: (event: DragEvent<HTMLDivElement> | void) => void; onDragExit: (event: DragEvent<HTMLDivElement> | void) => void }] {
  const [draggingOver, setDraggingOver] = useState(false);
  const onDragProps = {
    onDragEnter: (ev: DragEvent<HTMLDivElement> | void) => {
      if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      setDraggingOver(true);
    },
    onDragOver: (ev: DragEvent<HTMLDivElement> | void) => {
      if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      setDraggingOver(true);
    },
    onDragExit: (ev: DragEvent<HTMLDivElement> | void) => {
      if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      setDraggingOver(false);
    },
  };
  return [draggingOver, onDragProps];
}
