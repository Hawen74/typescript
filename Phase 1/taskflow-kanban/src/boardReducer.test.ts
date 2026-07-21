import { describe, test, expect } from "vitest";
import { boardReducer, findColumnIdForCard, initialState } from "./boardReducer";
import type { Board } from "./types";

test("MOVE_CARD moves a card between columns", () => {
  const result = boardReducer(initialState, {
    type: "MOVE_CARD",
    payload: { cardId: "card-1", fromColumnId: "col1", toColumnId: "col2", toIndex: 0 },
  });
  expect(result.columns.col1.cardIds).not.toContain("card-1");
  expect(result.columns.col2.cardIds).toContain("card-1");
  expect(result.columns.col1.cardIds).toContain("card-2"); // make sure the other card wasn't touched
});

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