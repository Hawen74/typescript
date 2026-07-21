import type { Board, BoardAction, Card } from "./types";

export const initialState: Board = {
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

export function boardReducer(state: Board, action: BoardAction): Board {
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

export function findColumnIdForCard (board: Board, cardId: string): string | undefined {
    const column = board.columnOrder
        .map(id => board.columns[id]) // get columns arrays
        .find(c => c.cardIds.includes(cardId));
    
    return column?.id;
}