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

interface LaneContext {
  lane: number;
  branch: BranchUserApi<SVGElement>;
}

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

    const edgesToNode = incoming.get(node.id) ?? [];
    edgesToNode.forEach((edge) => {
      const sourceCtx = laneByScene.get(edge.from);
      if (!sourceCtx) {
        return;
      }
      if (sourceCtx.lane === lane) {
        return;
      }

      linkCounter += 1;
      const linkColor =
        edge.tag === "conditional"
          ? lighten(colors[sourceCtx.lane % colors.length])
          : colors[sourceCtx.lane % colors.length];

      const linkBranch = sourceCtx.branch.branch({
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

  // Links will be rendered in a later iteration; keep the data pass-through so callers
  // can verify counts without breaking the flow.
  void links;
}
