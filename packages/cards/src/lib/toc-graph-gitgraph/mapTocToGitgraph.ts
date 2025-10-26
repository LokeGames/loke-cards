import type { GitgraphUserApi } from "@gitgraph/js";
import type { BranchUserApi } from "@gitgraph/core";

export interface GraphSceneNode {
  id: string;
  title: string;
  order: number;
  lane?: number;
}

export type GraphSceneLinkTag = "choice" | "conditional";

export interface GraphSceneLink {
  from: string;
  to: string;
  tag: GraphSceneLinkTag;
}

export interface TocGraphGitgraphOptions {
  colors: string[];
}

const DEFAULT_COLORS = [
  "#60a5fa",
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#f472b6",
  "#f59e0b",
  "#ef4444",
];

function lighten(hex: string, amount = 0.35): string {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return hex;
  const num = parseInt(raw, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const next = (channel: number) =>
    Math.min(255, Math.round(channel + (255 - channel) * amount));
  return `#${next(r).toString(16).padStart(2, "0")}${next(g)
    .toString(16)
    .padStart(2, "0")}${next(b).toString(16).padStart(2, "0")}`;
}

export interface GraphLayout {
  nodes: GraphSceneNode[];
  laneByScene: Map<string, number>;
  incoming: Map<string, GraphSceneLink[]>;
  outgoing: Map<string, GraphSceneLink[]>;
  laneCount: number;
}

export function layoutSceneGraph(
  nodes: GraphSceneNode[],
  links: GraphSceneLink[],
): GraphLayout {
  const clonedNodes = nodes.map((node) => ({ ...node }));
  const sortedNodes = [...clonedNodes].sort((a, b) => a.order - b.order);

  const incoming = new Map<string, GraphSceneLink[]>();
  const outgoing = new Map<string, GraphSceneLink[]>();
  sortedNodes.forEach((node) => {
    incoming.set(node.id, []);
    outgoing.set(node.id, []);
  });
  links.forEach((link) => {
    if (!incoming.has(link.to)) {
      incoming.set(link.to, []);
    }
    if (!outgoing.has(link.from)) {
      outgoing.set(link.from, []);
    }
    incoming.get(link.to)?.push(link);
    outgoing.get(link.from)?.push(link);
  });

  const laneByScene = new Map<string, number>();
  const laneSlots: (string | null)[] = [];

  for (const node of sortedNodes) {
    const incomingEdges = incoming.get(node.id) ?? [];
    const parentLanes = incomingEdges
      .map((edge) => laneByScene.get(edge.from))
      .filter((lane): lane is number => typeof lane === "number")
      .sort((a, b) => a - b);

    let lane: number;
    if (typeof node.lane === "number") {
      lane = node.lane;
    } else if (parentLanes.length > 0) {
      lane = parentLanes[0]!;
    } else {
      const freeIndex = laneSlots.findIndex((slot) => slot === null);
      lane = freeIndex === -1 ? laneSlots.length : freeIndex;
    }

    laneSlots[lane] = node.id;
    laneByScene.set(node.id, lane);
    node.lane = lane;

    if (incomingEdges.length > 1) {
      const parentLaneValues = parentLanes.slice(1);
      parentLaneValues.forEach((parentLane) => {
        if (parentLane != null) {
          laneSlots[parentLane] = null;
        }
      });
    }
  }

  return {
    nodes: sortedNodes,
    laneByScene,
    incoming,
    outgoing,
    laneCount: laneSlots.length || 1,
  };
}

interface LaneContext {
  lane: number;
  branch: BranchUserApi<SVGElement>;
}

export function mapTocToGitgraph(
  gitgraph: GitgraphUserApi<SVGElement>,
  nodes: GraphSceneNode[],
  links: GraphSceneLink[],
  options?: Partial<TocGraphGitgraphOptions>,
) {
  const colors = options?.colors ?? DEFAULT_COLORS;
  const branchesByLane = new Map<number, BranchUserApi<SVGElement>>();

  const { nodes: sortedNodes, laneByScene, incoming } = layoutSceneGraph(
    nodes,
    links,
  );

  let linkCounter = 0;

  function ensureBranch(lane: number): LaneContext {
    const existing = branchesByLane.get(lane);
    if (existing) {
      return { lane, branch: existing };
    }

    const branch = gitgraph.branch({
      name: `lane-${lane}`,
      style: {
        color: colors[lane % colors.length],
        label: {
          display: false,
        },
      },
      commitDefaultOptions: {
        style: {
          message: {
            display: false,
          },
        },
      },
    });

    branchesByLane.set(lane, branch);
    return { lane, branch };
  }

  const nodeLookup = new Map(nodes.map((node) => [node.id, node]));

  sortedNodes.forEach((node) => {
    const lane = laneByScene.get(node.id) ?? 0;
    const { branch } = ensureBranch(lane);

    branch.commit({
      subject: node.title,
      hash: node.id,
      style: {
        message: {
          display: false,
        },
      },
    });

    const original = nodeLookup.get(node.id);
    if (original) {
      original.lane = lane;
    }

    const edgesToNode = incoming.get(node.id) ?? [];
    edgesToNode.forEach((edge) => {
      const sourceLane = laneByScene.get(edge.from);
      if (sourceLane == null || sourceLane === lane) {
        return;
      }

      linkCounter += 1;
      const sourceBranch = branchesByLane.get(sourceLane);
      if (!sourceBranch) {
        return;
      }

      const linkColor =
        edge.tag === "conditional"
          ? lighten(colors[sourceLane % colors.length])
          : colors[sourceLane % colors.length];

      const linkBranch = sourceBranch.branch({
        name: `link-${linkCounter}`,
        style: {
          color: linkColor,
          lineWidth: edge.tag === "conditional" ? 2 : 3,
          label: { display: false },
        },
        commitDefaultOptions: {
          style: {
            message: { display: false },
            dot: { size: 0, strokeWidth: 0 },
          },
        },
      });

      linkBranch.commit({
        subject: "",
        style: {
          message: { display: false },
          dot: { size: 0, strokeWidth: 0 },
        },
      });

      branch.merge({
        branch: linkBranch,
        commitOptions: {
          subject: "",
          style: {
            message: { display: false },
            dot: { size: 0, strokeWidth: 0 },
          },
        },
      });

      try {
        linkBranch.delete();
      } catch {
        // ignore cleanup errors for already-deleted branches
      }
    });
  });

  void links;
}
