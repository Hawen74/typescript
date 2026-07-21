import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { useReducer } from "react";

function handleDragEnd(event: DragEndEvent) {
  console.log(event);
}

const App = () => {
  const [board, dispatch] = useReducer(boardReducer, initialState);

  <DndContext onDragEnd={handleDragEnd}>
    {board.columnOrder.map(columnId => { // columnId is 'col1'...
      const column = board.columns[columnId]; // column: 'todo', 'doing'...

      return (
        <div key={columnId}>
          <h3>{column.name}</h3>
          {column.cardIds.map(cardId => {
            const card = board.cards[cardId] // each card

            return ;<div key={cardId}>{card.title}</div>;
          })}
        </div>
      );
    })}
  </DndContext>
}

export default App