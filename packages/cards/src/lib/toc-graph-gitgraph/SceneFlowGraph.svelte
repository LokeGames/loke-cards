<script lang="ts">
  import type { GraphSceneLink, GraphSceneNode } from "./mapTocToGitgraph";

  export let nodes: GraphSceneNode[] = [];
  export let links: GraphSceneLink[] = [];
  export let positions: Array<{ id: string; y: number }> = [];
  export let laneCount = 1;
  export let colors: string[] = [
    "#60a5fa",
    "#22d3ee",
    "#a78bfa",
    "#34d399",
    "#f472b6",
    "#f59e0b",
    "#ef4444",
  ];
  export let height = 0;

  const laneSpacing = 56;
  const baseX = 32;
  const nodeRadius = 6;
  const strokeWidth = 3;

  $: positionMap = new Map(positions.map((p) => [p.id, p.y]));

  $: renderedNodes = nodes
    .map((node) => {
      const y = positionMap.get(node.id);
      if (typeof y !== "number" || typeof node.lane !== "number") {
        return null;
      }
      const x = baseX + node.lane * laneSpacing;
      const color = colors[node.lane % colors.length];
      return { ...node, x, y, color };
    })
    .filter((node): node is Required<typeof node> => node !== null);

  $: nodeLookup = new Map(renderedNodes.map((node) => [node.id, node]));

  $: renderedLinks = links
    .map((link) => {
      const from = nodeLookup.get(link.from);
      const to = nodeLookup.get(link.to);
      if (!from || !to) {
        return null;
      }
      return { from, to, tag: link.tag };
    })
    .filter((edge): edge is { from: typeof renderedNodes[number]; to: typeof renderedNodes[number]; tag: GraphSceneLink["tag"] } => edge !== null);

  $: svgHeight =
    height ||
    (renderedNodes.length > 0
      ? Math.max(...renderedNodes.map((node) => node.y)) + nodeRadius * 2
      : 0);

  $: svgWidth = baseX + (laneCount - 1) * laneSpacing + baseX;

  function linkPath(
    from: { x: number; y: number },
    to: { x: number; y: number },
  ): string {
    if (from.x === to.x) {
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }

    const dx = to.x - from.x;
    const curvature = Math.max(Math.abs(dx) * 0.4, laneSpacing);
    const c1x = from.x + Math.sign(dx) * curvature;
    const c2x = to.x - Math.sign(dx) * curvature;
    return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`;
  }
</script>

<svg
  class="h-full w-full"
  width={svgWidth}
  height={svgHeight}
  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
  preserveAspectRatio="none"
>
  {#each Array.from({ length: laneCount }) as _, laneIndex}
    {#if renderedNodes.some((node) => node.lane === laneIndex)}
      <line
        x1={baseX + laneIndex * laneSpacing}
        y1={0}
        x2={baseX + laneIndex * laneSpacing}
        y2={svgHeight}
        stroke={colors[laneIndex % colors.length]}
        stroke-width="2"
        stroke-opacity="0.25"
      />
    {/if}
  {/each}

  {#each renderedLinks as edge (edge.from.id + "->" + edge.to.id)}
    <path
      d={linkPath(edge.from, edge.to)}
      fill="none"
      stroke={edge.from.color}
      stroke-width={edge.tag === "conditional" ? strokeWidth - 1 : strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={edge.tag === "conditional" ? "6 4" : undefined}
    />
  {/each}

  {#each renderedNodes as node (node.id)}
    <g>
      <circle
        cx={node.x}
        cy={node.y}
        r={nodeRadius}
        fill={node.color}
        stroke="#0f172a"
        stroke-width="2"
      />
    </g>
  {/each}
</svg>
