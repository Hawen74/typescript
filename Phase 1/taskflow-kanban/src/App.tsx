import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useReducer } from "react";
import { boardReducer, initialState } from "./boardReducer"; // wherever you export these from
// (you'll need to export a real `initialState` too, not just the one buried in a test file)

function handleDragEnd(event: DragEndEvent) {
  console.log(event);
}

const App = () => {
  const [board, dispatch] = useReducer(boardReducer, initialState);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {board.columnOrder.map(columnId => {
        const column = board.columns[columnId];
        return (
          <div key={columnId}>
            <h3>{column.name}</h3>
            {column.cardIds.map(cardId => {
              const card = board.cards[cardId];
              return <div key={cardId}>{card.title}</div>;
            })}
          </div>
        );
      })}
    </DndContext>
  );
};

export default App;