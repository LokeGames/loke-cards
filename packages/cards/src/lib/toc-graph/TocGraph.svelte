<script lang="ts">
  import type { TOCGraph } from "./types";

  // Props
  let {
    graph,
    laneGap = 84,     // px between lanes
    rowGap = 56,      // px between rows
    dotR = 7,         // node dot radius
    padding = { t: 24, r: 24, b: 24, l: 24 }
  }: {
    graph: TOCGraph;
    laneGap?: number;
    rowGap?: number;
    dotR?: number;
    padding?: { t: number; r: number; b: number; l: number };
  } = $props();

  const palette = [
    "#22d3ee", // cyan-400
    "#60a5fa", // blue-400
    "#a78bfa", // violet-400
    "#f472b6", // pink-400
    "#34d399", // emerald-400
    "#f59e0b", // amber-500
    "#ef4444"  // red-500
  ]; // reuse via modulo

  type PNode = {
    id: string;
    title: string;
    order: number;
    lane: number;
    x: number;
    y: number;
    color: string
  };

  type PEdge = {
    from: string;
    to: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    dash?: string
  };

  let nodesP = $state<PNode[]>([]);
  let edgesP = $state<PEdge[]>([]);
  let width = $state(800);
  let height = $state(600);
  let viewBox = $state("");

  /**
   * Lane Layout Algorithm (GitKraken-style)
   *
   * Assigns each node a horizontal lane index so that:
   * - Branches are parallel colored rails
   * - Merges free lanes
   * - S-curves look like GitKraken
   */
  function layout(g: TOCGraph) {
    // Build edge maps
    const inMap = new Map<string, any[]>();
    const outMap = new Map<string, any[]>();
    g.nodes.forEach(n => {
      inMap.set(n.id, []);
      outMap.set(n.id, []);
    });
    g.edges.forEach(e => {
      inMap.get(e.to)!.push(e);
      outMap.get(e.from)!.push(e);
    });

    // Sort nodes by order
    const sorted = [...g.nodes].sort((a, b) => a.order - b.order);
    const laneBy = new Map<string, number>();
    const lanes: (string | null)[] = [];

    // Single pass: assign lanes
    for (const n of sorted) {
      const incoming = inMap.get(n.id)!;

      if (incoming.length === 1 && laneBy.has(incoming[0].from)) {
        // Inherit parent lane
        const li = laneBy.get(incoming[0].from)!;
        laneBy.set(n.id, li);
        lanes[li] = n.id;
      } else if (incoming.length > 1) {
        // Merge: pick lowest lane among parents
        const parents = incoming
          .map(e => laneBy.get(e.from) ?? Number.POSITIVE_INFINITY)
          .sort((a, b) => a - b);
        const primary = Number.isFinite(parents[0])
          ? parents[0]
          : (lanes.indexOf(null) === -1 ? lanes.length : lanes.indexOf(null));
        laneBy.set(n.id, primary);
        lanes[primary] = n.id;

        // Free other parent lanes
        for (let i = 1; i < parents.length; i++) {
          if (Number.isFinite(parents[i])) {
            lanes[parents[i]!] = null;
          }
        }
      } else {
        // New branch: allocate first free lane
        const idx = lanes.indexOf(null);
        const li = idx === -1 ? lanes.length : idx;
        laneBy.set(n.id, li);
        lanes[li] = n.id;
      }
    }

    // Compute positions
    nodesP = sorted.map(n => {
      const lane = laneBy.get(n.id)!;
      const x = padding.l + lane * laneGap;
      const y = padding.t + n.order * rowGap;
      const color = palette[lane % palette.length];
      return { ...n, lane, x, y, color };
    });

    // Prepare edges
    const byId = new Map(nodesP.map(n => [n.id, n]));
    edgesP = g.edges.map(e => {
      const a = byId.get(e.from)!;
      const b = byId.get(e.to)!;
      const dash = e.tag === "conditional" ? "6 5" : undefined;
      return {
        from: e.from,
        to: e.to,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        color: a.color,
        dash
      };
    });

    // Calculate SVG dimensions
    width = padding.l + (lanes.length - 1) * laneGap + padding.r + 160;
    height = padding.t + (sorted.length - 1) * rowGap + padding.b + 40;
    viewBox = `0 0 ${width} ${height}`;
  }

  /**
   * Generate S-curve bezier path between two nodes
   */
  function path(e: PEdge): string {
    const dx = e.x2 - e.x1;
    const c1 = e.x1 + 0.35 * dx;
    const c2 = e.x2 - 0.35 * dx;
    return `M ${e.x1} ${e.y1} C ${c1} ${e.y1}, ${c2} ${e.y2}, ${e.x2} ${e.y2}`;
  }

  // Reactive layout on graph changes
  $effect(() => {
    layout(graph);
  });
</script>

<svg {viewBox} class="w-full h-full">
  <!-- Vertical lane rails -->
  {#each Array.from(new Set(nodesP.map(n => n.lane))).sort((a, b) => a - b) as lane}
    {#if nodesP.some(n => n.lane === lane)}
      <line
        x1={padding.l + lane * laneGap}
        y1={padding.t - rowGap}
        x2={padding.l + lane * laneGap}
        y2={height - padding.b + rowGap}
        stroke-width="4"
        stroke-opacity=".25"
        stroke={palette[lane % palette.length]}
      />
    {/if}
  {/each}

  <!-- Edges with S-curves -->
  {#each edgesP as e (e.from + "->" + e.to)}
    <path
      d={path(e)}
      fill="none"
      stroke={e.color}
      stroke-width="3.5"
      stroke-linecap="round"
      stroke-dasharray={e.dash}
    />
  {/each}

  <!-- Node dots with labels -->
  {#each nodesP as n (n.id)}
    <g class="cursor-pointer">
      <title>{n.title}</title>
      <circle cx={n.x} cy={n.y} r={dotR} fill={n.color}/>
      <text
        x={n.x + 14}
        y={n.y}
        dominant-baseline="middle"
        class="fill-slate-800 dark:fill-slate-100 text-[13px] select-none"
      >
        {n.title}
      </text>
    </g>
  {/each}
</svg>
