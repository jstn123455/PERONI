import { useRef, useState, useCallback, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';

interface UseDraggableOptions {
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number }; 
  onDrag?: (position: { x: number; y: number }) => void; // Removed isDragging
  onDragStop?: (position: { x: number; y: number }) => void;
  disabled?: boolean;
}

export const useDraggable = ({ initialPosition, initialSize, onDrag, onDragStop, disabled = false }: UseDraggableOptions) => {
  const [position, setPosition] = useState(initialPosition);
  const ref = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  const bind = useDrag(({ down, movement: [mx, my], event, first, memo }) => {
    if (disabled) return;

    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('input[type="range"]')) {
      return;
    }
    
    let newPos;
    if (first) {
        memo = position;
    }

    newPos = {
        x: memo.x + mx,
        y: memo.y + my,
    };
    
    const taskbarHeight = 48; 
    newPos.x = Math.max(-initialSize.width + 50, Math.min(newPos.x, window.innerWidth - 50));
    newPos.y = Math.max(0, Math.min(newPos.y, window.innerHeight - taskbarHeight - 20));


    if (onDrag) { 
      onDrag(newPos); // Pass only position
    }

    if (down) {
      setPosition(newPos);
    } else {
      if (onDragStop) {
        onDragStop(newPos);
      }
    }
    return memo; 
  }, {
    preventScroll: true,
  });
  
  return { position, ref, ...bind() }; 
};