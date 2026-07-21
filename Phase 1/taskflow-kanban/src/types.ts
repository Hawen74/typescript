export type Priority = 'low' | 'medium' | 'high';

export interface Card {
    id: string,
    title: string,
    description: string,
    priority: Priority,
    dueDate?: string,
    tags: string[]
}

export type CreateCardInput = Omit<Card, 'id'>

export interface Column {
    id: string,
    name: string,
    cardIds: string[]
}

export interface Board {
    cards: Record<string, Card>;
    columns: Record<string, Column>;
    columnOrder: string[]
}

export type BoardAction = 
    | { type: "ADD_CARD", payload: { columnId: string; card: CreateCardInput } }
    | { type: "MOVE_CARD", payload: { cardId: string; fromColumnId: string; toColumnId: string; toIndex: number } }
    | { type: "EDIT_CARD", payload: { cardId: string; updates: Partial<Card> } }
    | { type: "DELETE_CARD", payload: { cardId: string; columnId: string } }
    | { type: "REORDER_CARD", payload: { cardId: string; columnId: string; fromIndex: number; toIndex: number } };