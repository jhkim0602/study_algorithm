import { useMemo, useState } from 'react'

// 삽입 순서에 따라 BST 모양이 어떻게 달라지는지 보여주는 시각화.
// 같은 값들이라도 삽입 순서가 다르면 균형 트리 vs 편향 트리로 갈린다.

const BALANCED_ORDER = [50, 30, 70, 20, 40, 60, 80]
const SORTED_ORDER = [10, 20, 30, 40, 50, 60, 70]

// ---- 순수 BST 연산 (불변 트리: 새 노드 객체를 반환) ----
function makeNode(value) {
  return { value, left: null, right: null }
}

function insert(node, value) {
  if (!node) return makeNode(value)
  if (value < node.value) return { ...node, left: insert(node.left, value) }
  if (value > node.value) return { ...node, right: insert(node.right, value) }
  return node // 중복 무시
}

function buildFromValues(values) {
  let root = null
  for (const v of values) root = insert(root, v)
  return root
}

// 노드 수
function countNodes(node) {
  if (!node) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

// 높이: 잎까지의 간선 수 (노드 1개 → 0, 빈 트리 → -1)
function height(node) {
  if (!node) return -1
  return 1 + Math.max(height(node.left), height(node.right))
}

// 가장 깊은 경로(루트→가장 먼 잎)의 value 집합. 편향 강조용.
function deepestPath(node) {
  if (!node) return []
  const lh = height(node.left)
  const rh = height(node.right)
  const rest = lh >= rh ? deepestPath(node.left) : deepestPath(node.right)
  return [node.value, ...rest]
}

// ---- 레이아웃: 중위 순회로 x 열, 깊이로 y 행 (MiniTree / BSTVisualizer 방식) ----
function layout(root) {
  const nodes = []
  const edges = []
  let col = 0
  let maxDepth = 0
  function walk(node, depth) {
    if (!node) return null
    const left = walk(node.left, depth + 1)
    const me = { value: node.value, col, depth }
    col += 1
    if (depth > maxDepth) maxDepth = depth
    nodes.push(me)
    const right = walk(node.right, depth + 1)
    if (left) edges.push([me, left])
    if (right) edges.push([me, right])
    return me
  }
  walk(root, 0)
  return { nodes, edges, cols: col, maxDepth }
}

function parseValues(text) {
  const seen = new Set()
  const out = []
  for (const s of text.split(/[,\s]+/)) {
    const n = Number(s)
    if (!Number.isFinite(n)) continue
    const v = Math.trunc(n)
    if (seen.has(v)) continue // 중복 제거 (BST가 무시하므로)
    seen.add(v)
    out.push(v)
    if (out.length >= 15) break
  }
  return out
}

// ---- 단일 트리 패널 (SVG) ----
function TreePanel({ title, values, tone }) {
  const root = useMemo(() => buildFromValues(values), [values])
  const { nodes, edges, cols, maxDepth } = useMemo(() => layout(root), [root])
  const path = useMemo(() => new Set(deepestPath(root)), [root])

  const h = height(root)
  const n = countNodes(root)

  const COL = 46
  const ROW = 56
  const R = 16
  const PAD = 26
  const W = Math.max(PAD * 2 + Math.max(cols - 1, 0) * COL, 220)
  const H = PAD * 2 + maxDepth * ROW + R * 2
  const xOf = (node) => PAD + node.col * COL
  const yOf = (node) => PAD + R + node.depth * ROW

  // tone: 'warn' → 편향 트리(가장 깊은 경로를 --warn 으로), 'ok' → 균형 트리
  const accentStroke = tone === 'warn' ? 'var(--warn)' : 'var(--ok)'
  const fillOf = (value) => {
    if (tone === 'warn' && path.has(value)) return 'var(--viz-swap)'
    if (tone === 'ok') return 'var(--accent-soft)'
    return 'var(--accent-soft)'
  }
  const textFillOf = (value) => (fillOf(value) === 'var(--viz-swap)' ? '#fff' : 'var(--accent-text)')

  return (
    <div
      style={{
        flex: '1 1 280px',
        minWidth: '260px',
        border: '1px solid var(--border-strong)',
        borderRadius: '8px',
        background: 'var(--bg)',
        padding: '10px 12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)' }}>{title}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: accentStroke }}>
          높이 {h} · 노드 {n}개
        </span>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
        삽입: [{values.join(', ')}]
      </div>
      <div className="viz-stage">
        {nodes.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-faint)', fontSize: '13px' }}>
            (빈 트리)
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`${title} 이진 검색 트리`}
          >
            {edges.map(([a, b], i) => {
              const onPath = tone === 'warn' && path.has(a.value) && path.has(b.value)
              return (
                <line
                  key={`e${i}`}
                  x1={xOf(a)}
                  y1={yOf(a)}
                  x2={xOf(b)}
                  y2={yOf(b)}
                  stroke={onPath ? 'var(--warn)' : 'var(--border-strong)'}
                  strokeWidth={onPath ? 3 : 2}
                />
              )
            })}
            {nodes.map((node, i) => (
              <g key={`n${i}`}>
                <circle
                  cx={xOf(node)}
                  cy={yOf(node)}
                  r={R}
                  fill={fillOf(node.value)}
                  stroke={tone === 'warn' && path.has(node.value) ? 'var(--warn)' : accentStroke}
                  strokeWidth="2"
                />
                <text
                  x={xOf(node)}
                  y={yOf(node)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="13"
                  fontWeight="700"
                  fill={textFillOf(node.value)}
                >
                  {node.value}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  )
}

const DEFAULT_CUSTOM = '50, 30, 70, 20, 40, 60, 80'

export default function BSTShapeViz() {
  const [text, setText] = useState(DEFAULT_CUSTOM)
  const [custom, setCustom] = useState(parseValues(DEFAULT_CUSTOM))

  const apply = () => {
    const vs = parseValues(text)
    if (vs.length >= 1) setCustom(vs)
  }
  const sortInsert = () => {
    const vs = parseValues(text)
    if (vs.length < 1) return
    const sorted = [...vs].sort((a, b) => a - b)
    setText(sorted.join(', '))
    setCustom(sorted)
  }
  const reset = () => {
    setText(DEFAULT_CUSTOM)
    setCustom(parseValues(DEFAULT_CUSTOM))
  }

  // 고정 비교쌍(같은 값 집합 1~7)의 높이 — note 에서 대조용
  const balancedH = useMemo(() => height(buildFromValues(BALANCED_ORDER)), [])
  const sortedH = useMemo(() => height(buildFromValues(SORTED_ORDER)), [])

  // 현재 사용자 트리가 한쪽으로 치우쳤는지 (편향 판정)
  const customRoot = useMemo(() => buildFromValues(custom), [custom])
  const customH = height(customRoot)
  const customN = countNodes(customRoot)
  const isSkewed = customN > 0 && customH === customN - 1

  return (
    <div className="viz">
      <div className="viz-title">
        <span className="viz-tag">시각화</span> 삽입 순서와 BST 모양: 균형 vs 편향
      </div>

      <div className="viz-controls">
        <label>삽입 순서</label>
        <input
          className="viz-input mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: 50, 30, 70, 20, 40"
          style={{ minWidth: '220px' }}
        />
        <button className="viz-btn primary" onClick={apply}>적용</button>
        <button className="viz-btn" onClick={sortInsert}>정렬 순서로 삽입</button>
        <button className="viz-btn" onClick={reset}>초기화</button>
      </div>

      <div className="viz-stage">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <TreePanel title="균형적 삽입 순서" values={BALANCED_ORDER} tone="ok" />
          <TreePanel title="정렬된 순서 삽입 (편향)" values={SORTED_ORDER} tone="warn" />
        </div>
      </div>

      <div className="viz-stage" style={{ marginTop: '12px' }}>
        <TreePanel
          title={`내 삽입 순서${isSkewed ? ' — 편향됨!' : ''}`}
          values={custom}
          tone={isSkewed ? 'warn' : 'ok'}
        />
      </div>

      <div className="viz-note">
        같은 값들이라도 <b>삽입 순서</b>에 따라 트리 모양이 달라진다. 균형 잡힌 BST는 높이 ≈ log₂n
        이라 탐색이 <b>O(log n)</b>. 하지만 정렬된 순서로 삽입하면 한쪽으로 치우쳐(편향) 연결 리스트처럼 되어
        높이 ≈ n 이 되고 탐색이 <b>O(n)</b>으로 나빠진다. 위 두 트리는 모두 7개 노드인데, 균형 트리는
        높이 {balancedH} (≈ log₂7), 편향 트리는 높이 {sortedH} (= n−1) 이다. ← 같은 자료, 전혀 다른 성능.
      </div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--accent-soft)' }} /> 일반 노드</span>
        <span><i style={{ background: 'var(--viz-swap)' }} /> 가장 깊은 경로 (편향)</span>
        <span><i style={{ border: '2px solid var(--ok)', background: 'transparent' }} /> 균형 트리</span>
        <span><i style={{ border: '2px solid var(--warn)', background: 'transparent' }} /> 편향 경로</span>
      </div>
    </div>
  )
}
