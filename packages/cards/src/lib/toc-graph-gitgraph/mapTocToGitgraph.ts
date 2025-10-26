import type { BranchUserApi, GitgraphUserApi } from "@gitgraph/core";

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
  const laneByScene = new Map<string, LaneContext>();
  const branchesByLane = new Map<number, BranchUserApi<SVGElement>>();

  const sortedNodes = [...nodes].sort((a, b) => a.order - b.order);
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

  let nextLane = 0;

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

  sortedNodes.forEach((node) => {
    const incomingEdges = incoming.get(node.id) ?? [];
    const parentLanes = incomingEdges
      .map((edge) => laneByScene.get(edge.from)?.lane)
      .filter((lane): lane is number => typeof lane === "number")
      .sort((a, b) => a - b);

    const lane =
      typeof node.lane === "number"
        ? node.lane
        : parentLanes.length > 0
          ? parentLanes[0]!
          : laneByScene.get(node.id)?.lane ?? nextLane++;

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

    const ctx = { lane, branch };
    laneByScene.set(node.id, ctx);
    node.lane = lane;
  });

  // Links will be rendered in a later iteration; keep the data pass-through so callers
  // can verify counts without breaking the flow.
  void links;
}
