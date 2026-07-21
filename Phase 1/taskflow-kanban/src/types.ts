type Priority = 'low' | 'medium' | 'high';

interface Card {
    id: string,
    title: string,
    description: string,
    priority: Priority,
    dueDate?: string,
    tags: string[]
}

type CreateCardInput = Omit<Card, 'id'>

interface Column {
    id: string,
    name: string,
    cardIds: string[]
}

interface Board {
    cards: Record<string, Card>;
    columns: Record<string, Column>;
    columnOrder: string[]
}

