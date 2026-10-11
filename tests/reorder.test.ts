/**
 * lib/reorder.ts — the arithmetic behind the ↑ ↓ arrows on the awards gallery.
 *
 * The case worth pinning down is the one that made moveAward renumber the whole
 * list instead of swapping two values: rows added through the admin all take
 * sort_order 0, so their order comes from the id tiebreak, and swapping two
 * identical sort_orders would move nothing.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reorderedIds } from "@/lib/reorder";

describe("reorderedIds", () => {
  it("moves a row up one place", () => {
    assert.deepEqual(reorderedIds([1, 2, 3, 4], 3, -1), [1, 3, 2, 4]);
  });

  it("moves a row down one place", () => {
    assert.deepEqual(reorderedIds([1, 2, 3, 4], 2, 1), [1, 3, 2, 4]);
  });

  it("returns null at the top, so nothing is written", () => {
    assert.equal(reorderedIds([1, 2, 3], 1, -1), null);
  });

  it("returns null at the bottom", () => {
    assert.equal(reorderedIds([1, 2, 3], 3, 1), null);
  });

  it("returns null for an id that is not in the list", () => {
    assert.equal(reorderedIds([1, 2, 3], 99, -1), null);
  });

  it("handles a single-row list", () => {
    assert.equal(reorderedIds([7], 7, -1), null);
    assert.equal(reorderedIds([7], 7, 1), null);
  });

  it("does not mutate the list it was given", () => {
    const ids = [1, 2, 3];
    reorderedIds(ids, 2, 1);
    assert.deepEqual(ids, [1, 2, 3]);
  });

  it("returns every id exactly once, so renumbering cannot drop a row", () => {
    const ids = [4, 8, 15, 16, 23, 42];
    const next = reorderedIds(ids, 15, 1);
    assert.ok(next);
    assert.deepEqual([...next].sort((a, b) => a - b), [...ids].sort((a, b) => a - b));
  });

  it("a move down then back up is the identity", () => {
    const ids = [1, 2, 3, 4];
    const down = reorderedIds(ids, 2, 1);
    assert.ok(down);
    assert.deepEqual(reorderedIds(down, 2, -1), ids);
  });
});
