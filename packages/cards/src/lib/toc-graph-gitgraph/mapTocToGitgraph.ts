import type { Branch } from "@gitgraph/js";
import type { GitgraphUserApi } from "@gitgraph/core";

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
  branch: Branch;
}

export function mapTocToGitgraph(
  gitgraph: GitgraphUserApi<SVGElement>,
  nodes: GraphSceneNode[],
  links: GraphSceneLink[],
  options?: Partial<TocGraphGitgraphOptions>,
) {
  const colors = options?.colors ?? DEFAULT_COLORS;
  const laneByScene = new Map<string, LaneContext>();
  const branchesByLane = new Map<number, Branch>();

  const sortedNodes = [...nodes].sort((a, b) => a.order - b.order);
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
    const lane =
      typeof node.lane === "number" ? node.lane : laneByScene.get(node.id)?.lane ?? nextLane++;
    const { branch } = ensureBranch(lane);

    const commit = branch.commit({
      subject: node.title,
      hash: node.id,
    });

    laneByScene.set(node.id, { lane, branch });

    // Reserve a lane for the commit reference when future links target it
    // to avoid opening duplicate branches.
    void commit;
  });

  // Links will be rendered in a later iteration; keep the data pass-through so callers
  // can verify counts without breaking the flow.
  void links;
}
