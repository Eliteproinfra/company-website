/**
 * Moving one row up or down a hand-ordered list.
 *
 * Kept apart from the query that writes it so the arithmetic can be tested
 * without a database, and so the same rule can serve any other list the admin
 * orders by hand later.
 *
 * The caller passes the ids in the order they are currently displayed. What
 * comes back is the whole list renumbered, not just the pair that swapped:
 * rows that share a sort_order (everything added through the admin defaults to
 * 0) have no stable position of their own, so writing sequential values to all
 * of them is what makes the next move predictable.
 */
export function reorderedIds(ids: number[], id: number, direction: -1 | 1): number[] | null {
  const index = ids.indexOf(id);
  if (index === -1) return null;

  const target = index + direction;
  // Already at the end it is being moved towards — nothing to do, and the
  // caller should not write anything.
  if (target < 0 || target >= ids.length) return null;

  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
