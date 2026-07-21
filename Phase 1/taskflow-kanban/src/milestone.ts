// 1. Define Priority as a union of "low" | "medium" | "high"
type Priority = 'low' | 'medium' | 'high';
const p: Priority = 'high';

// 2. Define Card interface: id, title, description, priority, optional dueDate, tags (string array)
interface Card {
    id: string,
    title: string,
    description: string,
    priority: Priority,
    dueDate?: string,
    tags: string[]
}

// 3. Derive CreateCardInput from Card (omit what shouldn't be user-provided)
type CreateCardInput = Omit<Card, "id">

// 4. Define Column interface: id, name, cards (array of Card)
interface Column {
    id: string,
    name: string,
    cardIds: string[]
}

// 5. Define Board interface: columns (array of Column)
interface Board {
    cards: Record<string, Card>;
    columns: Record<string, Column>;
    columnOrder: String[];  
}

// MILESTONE 2
// Reducer require 2 parts:
// - A discriminated union
// - A function
type BoardAction = 
    | { type: "ADD_CARD", payload: { columnId: string; card: CreateCardInput } }
    | { type: "MOVE_CARD", payload: { cardId: string; fromColumnId: string; toColumnId: string; toIndex: number } }
    | { type: "EDIT_CARD", payload: { cardId: string; updates: Partial<Card> } }
    | { type: "DELETE_CARD", payload: { cardId: string; columnId: string } }
    | { type: "REORDER_CARD", payload: { cardId: string; columnId: string; fromIndex: number; toIndex: number } };

function boardReducer(state: Board, action: BoardAction): Board {
    switch (action.type) {
        case "ADD_CARD": {
            const newId = crypto.randomUUID();
            const columnId = action.payload.columnId;
            const newCard: Card = {
                id: newId,
                ...action.payload.card
            }

            return {
                ...state,
                cards: {
                    ...state.cards,
                    [newId]: newCard
                },
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...state.columns[columnId],
                        cardIds: [...state.columns[columnId].cardIds, newId]
                    }
                }
            }
        }

        case "MOVE_CARD": {
            const { cardId, fromColumnId, toColumnId, toIndex } = action.payload;
            const updatedNewColumn = [...state.columns[toColumnId].cardIds];
            const newCardIds = [...state.columns[toColumnId].cardIds];
            newCardIds.splice(toIndex, 0, cardId);

            if (fromColumnId === toColumnId) {
                const filtered = state.columns[fromColumnId].cardIds.filter( id => id != cardId )
                filtered.splice(toIndex, 0, cardId)

                return {
                    ...state,
                    columns: {
                        ...state.columns,
                        [toColumnId]: {
                            ...state.columns[toColumnId],
                            cardIds: filtered
                        }
                    }
                }
            }

            return {
                ...state,
                columns: {
                    ...state.columns,
                    [fromColumnId]: {
                        ...state.columns[fromColumnId],
                        cardIds: state.columns[fromColumnId].cardIds.filter( id => id != cardId )
                    },
                    [toColumnId]: {
                        ...state.columns[toColumnId],
                        cardIds: newCardIds
                    }
                }
            }
        }

        case "EDIT_CARD": {
            const cardId = action.payload.cardId;
            const updatedCard = action.payload.updates;

            return {
                ...state,
                cards: {
                    ...state.cards,
                    [cardId] : {
                        ...state.cards[cardId],
                        ...updatedCard // overwrite.
                    }
                }, 
            }
        }

        case "DELETE_CARD": {
            const { cardId, columnId } = action.payload;
            const { [cardId]: removedCard, ...remainingCards } = state.cards;
            const updatedCardIds = state.columns[columnId].cardIds.filter( id => id !== cardId );
            return {
                ...state,
                cards : remainingCards,
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...state.columns[columnId],
                        cardIds: updatedCardIds
                    }
                }
            }
        }

        case "REORDER_CARD": {
            const { cardId, columnId, fromIndex, toIndex } = action.payload;
            const cardIds = [...state.columns[columnId].cardIds];
            cardIds.splice(fromIndex, 1)
            cardIds.splice(toIndex, 0, cardId)


            return {
                ...state,
                columns: {
                    ...state.columns,
                    [columnId]: {
                        ...state.columns[columnId],
                        cardIds
                    }
                }
            }
        }

        default:
            const _exhaustiveCheck: never = action;
            return state
    }
}

// TEST
const initialState: Board = {
  columns: {
    col1: { id: "col1", name: "To Do", cardIds: ["card-1", "card-2"] },
    col2: { id: "col2", name: "In Progress", cardIds: [] },
    col3: { id: "col3", name: "Done", cardIds: [] },
  },
  cards: {
    "card-1": { id: "card-1", title: "Learn dnd-kit", description: "", priority: "medium", tags: [] },
    "card-2": { id: "card-2", title: "Write reducer tests", description: "", priority: "low", tags: [] },
  },
  columnOrder: ["col1", "col2", "col3"],
};  

test("MOVE_CARD moves a card between columns", () => {
  const result = boardReducer(initialState, {
    type: "MOVE_CARD",
    payload: { cardId: "card-1", fromColumnId: "col1", toColumnId: "col2", toIndex: 0 },
  });
  expect(result.columns.col1.cardIds).not.toContain("card-1");
  expect(result.columns.col2.cardIds).toContain("card-1");
  expect(result.columns.col1.cardIds).toContain("card-2"); // make sure the other card wasn't touched
});

// Milestone 3
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    type DragEndEvent,
} from "@dnd-kit/core"

function findColumnIdForCard (board: Board, cardId: string): string | undefined {
    const column = board.columnOrder
        .map(id => board.columns[id]) // get columns arrays
        .find(c => c.cardIds.includes(cardId));
    
    return column?.id;
}   

// Test
const board: Board = {
  columnOrder: ["todo", "doing"],

  columns: {
    todo: {
      id: "todo",
      name: "Todo",
      cardIds: ["1", "2"],
    },

    doing: {
      id: "doing",
      name: "Doing",
      cardIds: ["3"],
    },
  },

  cards: {},
};

test("finds the column containing a card", () => {
  expect(findColumnIdForCard(board, "1")).toBe("todo");
});

test("returns undefined for a nonexistent card id", () => {
  expect(findColumnIdForCard(board, "5")).toBeUndefined();
});

test("returns undefined for an empty string id", () => {
  expect(findColumnIdForCard(board, "")).toBeUndefined();
});