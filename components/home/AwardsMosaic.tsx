"use client";

import Image from "next/image";
import { useEffect, useReducer } from "react";
import type { Award } from "@/lib/types";

const TILE_COUNT = 9;
const SWAP_INTERVAL_MS = 2200;
// Corners and centre first, then the edges, so consecutive swaps land on
// alternating, non-adjacent tiles instead of sweeping across a row.
const SWAP_ORDER = [0, 4, 8, 2, 6, 1, 7, 3, 5];

type Tile = { current: number; previous: number | null; version: number };
type State = { tiles: Tile[]; queue: number[]; step: number };

function init(count: number): State {
  const shown = Math.min(count, TILE_COUNT);
  return {
    tiles: Array.from({ length: shown }, (_, i) => ({ current: i, previous: null, version: 0 })),
    queue: Array.from({ length: count - shown }, (_, i) => shown + i),
    step: 0,
  };
}

// Puts the longest-hidden award into the next tile in SWAP_ORDER and sends the
// award it replaces to the back of the queue, so every award gets its turn.
function swap(state: State): State {
  const [incoming, ...rest] = state.queue;
  if (incoming === undefined) return state;
  const slot = SWAP_ORDER[state.step % TILE_COUNT];
  const outgoing = state.tiles[slot].current;
  const tiles = state.tiles.map((tile, i) =>
    i === slot ? { current: incoming, previous: outgoing, version: tile.version + 1 } : tile
  );
  return { tiles, queue: [...rest, outgoing], step: state.step + 1 };
}

/**
 * 3x3 wall of award posters for the "Why Choose" card. With more than nine
 * awards, one tile every few seconds cross-fades to an award not on screen;
 * reduced-motion users get a static wall.
 */
export default function AwardsMosaic({ awards }: { awards: Award[] }) {
  const [state, dispatch] = useReducer(swap, awards.length, init);
  const canRotate = awards.length > TILE_COUNT;

  useEffect(() => {
    if (!canRotate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(dispatch, SWAP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [canRotate]);

  const altFor = (index: number) => awards[index].caption || `ElitePro Infra award ${index + 1}`;

  return (
    <div className="grid h-full grid-cols-3 grid-rows-3 gap-1.5 bg-black p-1.5">
      {state.tiles.map((tile, slot) => (
        <div key={slot} className="relative overflow-hidden rounded-lg bg-ink">
          {tile.previous !== null ? (
            <Image
              src={awards[tile.previous].image}
              alt=""
              fill
              sizes="(max-width: 1023px) 33vw, 175px"
              className="object-cover object-top"
            />
          ) : null}
          <Image
            key={`${tile.current}-${tile.version}`}
            src={awards[tile.current].image}
            alt={altFor(tile.current)}
            fill
            sizes="(max-width: 1023px) 33vw, 175px"
            className={`object-cover object-top ${tile.version > 0 ? "animate-tile-swap" : ""}`}
          />
        </div>
      ))}
    </div>
  );
}
