/**
 * Graph Builder Composable
 * Builds Vue Flow nodes and edges from scenes, chapters, and their relationships
 */

/**
 * Build chapter nodes for global view (chapters as containers)
 * @param {Array} chapters - Array of chapter objects
 * @returns {Array} Vue Flow nodes
 */
export function buildChapterNodes(chapters) {
  return chapters.map((chapter) => ({
    id: `chapter-${chapter.id}`,
    type: 'chapter',
    data: {
      title: chapter.name || chapter.id,
      chapterId: chapter.id,
    },
    position: chapter.position || { x: 0, y: 0 },
    class: 'chapter-node',
    style: {
      width: '400px',
      minHeight: '300px',
      padding: '20px',
    },
    draggable: true,
    selectable: true,
  }))
}

/**
 * Build scene nodes (can be standalone or parented to chapter)
 * @param {Array} scenes - Array of scene objects
 * @param {string} parentChapterId - Optional parent chapter ID for grouping
 * @returns {Array} Vue Flow nodes
 */
import { normalizeScene } from '@cards/lib/normalize.js'

export function buildSceneNodes(scenes, parentChapterId = null) {
  return scenes.map((raw) => {
    const scene = normalizeScene(raw)
    const node = {
      id: `scene-${scene.sceneId}`,
      type: 'scene',
      data: {
        title: scene.sceneId,
        sceneText: scene.sceneText || '',
        chapterId: scene.chapterId,
        choicesCount: scene.choices?.length || 0,
      },
      position: scene.position || { x: 0, y: 0 },
      class: 'scene-node',
      draggable: true,
      selectable: true,
    }

    // If in global view and we're grouping by chapter
    if (parentChapterId) {
      node.parentNode = `chapter-${parentChapterId}`
      node.extent = 'parent'
    }

    return node
  })
}

/**
 * Build edges from scene choices (scene connections)
 * @param {Array} scenes - Array of scene objects with choices
 * @returns {Array} Vue Flow edges
 */
export function buildEdgesFromScenes(scenes) {
  const edges = []

  scenes.forEach((raw) => {
    const scene = normalizeScene(raw)
    const sourceId = `scene-${scene.sceneId}`

    // Build edges from choices
    if (scene.choices && Array.isArray(scene.choices)) {
      scene.choices.forEach((choice, index) => {
        if (choice.nextScene) {
          edges.push({
            id: `edge-${scene.sceneId}-${choice.nextScene}-${index}`,
            source: sourceId,
            target: `scene-${choice.nextScene}`,
            data: {
              choiceText: choice.text,
              enabled: choice.enabled !== false,
            },
            animated: true,
            label: choice.text?.substring(0, 20) + (choice.text?.length > 20 ? '...' : ''),
            style: {
              stroke: choice.enabled !== false ? '#3b82f6' : '#9ca3af',
            },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: choice.enabled !== false ? '#3b82f6' : '#9ca3af',
            },
          })
        }
      })
    }
  })

  return edges
}

/**
 * Auto-layout using ELK algorithm
 * @param {Array} nodes - Vue Flow nodes
 * @param {Array} edges - Vue Flow edges
 * @returns {Promise<Array>} Nodes with computed positions
 */
export async function layoutGraph(nodes, edges) {
  // For now, simple grid layout
  // TODO: Integrate elkjs for proper hierarchical layout
  const columns = Math.ceil(Math.sqrt(nodes.length))
  const spacing = 250

  return nodes.map((node, index) => {
    const row = Math.floor(index / columns)
    const col = index % columns

    return {
      ...node,
      position: node.position?.x && node.position?.y
        ? node.position
        : { x: col * spacing + 50, y: row * spacing + 50 }
    }
  })
}

/**
 * Filter scenes by chapter
 * @param {Array} scenes - All scenes
 * @param {string} chapterId - Chapter ID to filter by
 * @returns {Array} Filtered scenes
 */
export function filterScenesByChapter(scenes, chapterId) {
  return scenes.filter(scene => {
    const sceneChapter = (scene.chapterId || scene.chapter)
    return sceneChapter === chapterId
  })
}

/**
 * Extract positions from nodes (for persistence)
 * @param {Array} nodes - Vue Flow nodes
 * @returns {Object} Map of node ID to position
 */
export function extractPositions(nodes) {
  const positions = {}
  nodes.forEach(node => {
    positions[node.id] = node.position
  })
  return positions
}
