import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useReducer } from "react";
import "./App.css";
import { boardReducer, initialState } from "./boardReducer";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

function handleDragEnd(event: DragEndEvent) {
  console.log(event);
}

const App = () => {
  const [board, dispatch] = useReducer(boardReducer, initialState);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="board">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          return (
            <div key={columnId} className="column">
              <h3 className="column-header">{column.name}</h3>
              <div className="card-list">
                <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
                  {column.cardIds.map((cardId) => {
                    const card = board.cards[cardId];
                    return (
                      <div key={cardId} className="card">
                        {card.title}
                      </div>
                    );
                  })}
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

export default App;