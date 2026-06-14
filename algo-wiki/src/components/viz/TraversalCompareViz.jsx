import { useMemo, useState } from 'react'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

// 고정 샘플 트리: 깊이 ≥ 3 이 되도록 삽입 순서를 정함.
const SAMPLE = [6, 3, 8, 1, 5, 7, 9, 4]

// ---- 순수 BST 삽입 (불변 트리: 새 노드 객체를 반환) ----
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

// ---- 레이아웃: 중위 순회로 x 열, 깊이로 y 행 (BSTVisualizer 방식) ----
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

// ---- 네 가지 순회 순서 계산 ----
function traversalOrder(root, kind) {
  const order = []
  function pre(n) { if (!n) return; order.push(n.value); pre(n.left); pre(n.right) }
  function ino(n) { if (!n) return; ino(n.left); order.push(n.value); ino(n.right) }
  function post(n) { if (!n) return; post(n.left); post(n.right); order.push(n.value) }
  if (kind === 'pre') pre(root)
  else if (kind === 'in') ino(root)
  else if (kind === 'post') post(root)
  else if (kind === 'level') {
    const q = root ? [root] : []
    while (q.length) {
      const n = q.shift()
      order.push(n.value)
      if (n.left) q.push(n.left)
      if (n.right) q.push(n.right)
    }
  }
  return order
}

const TRAVERSALS = [
  { key: 'pre', label: '전위', rule: '노드 → 왼쪽 → 오른쪽 (루트를 먼저 방문)' },
  { key: 'in', label: '중위', rule: '왼쪽 → 노드 → 오른쪽 (BST에서는 항상 오름차순)' },
  { key: 'post', label: '후위', rule: '왼쪽 → 오른쪽 → 노드 (루트를 가장 나중에 방문)' },
  { key: 'level', label: '레벨', rule: '위에서 아래로, 같은 레벨은 왼쪽부터 (BFS)' },
]

// ---- 선택된 순회의 단계별 프레임 생성 ----
function traversalFrames(root, kind) {
  const t = TRAVERSALS.find((x) => x.key === kind)
  if (!root) {
    return [{ current: null, visited: [], seqIndex: -1, note: '빈 트리입니다. 순회할 노드가 없습니다.' }]
  }
  const order = traversalOrder(root, kind)
  const frames = []
  for (let i = 0; i < order.length; i++) {
    const visited = order.slice(0, i + 1)
    let note = `${t.label} 순회 [${t.rule}] · 방문 순서: ${visited.join(' → ')}`
    if (kind === 'in' && i === order.length - 1) note += '  ← 오름차순 정렬됨'
    frames.push({ current: order[i], visited, seqIndex: i, note })
  }
  return frames
}

export default function TraversalCompareViz() {
  const root = useMemo(() => buildFromValues(SAMPLE), [])
  const [kind, setKind] = useState('pre')

  // 네 가지 순회 순서는 트리가 고정이므로 한 번만 계산.
  const orders = useMemo(() => ({
    pre: traversalOrder(root, 'pre'),
    in: traversalOrder(root, 'in'),
    post: traversalOrder(root, 'post'),
    level: traversalOrder(root, 'level'),
  }), [root])

  const frames = useMemo(() => traversalFrames(root, kind), [root, kind])
  const player = useStepPlayer(frames)
  const { frame } = player

  // ---- 레이아웃 + SVG 좌표 (BSTVisualizer 와 동일한 수치) ----
  const { nodes, edges, cols, maxDepth } = useMemo(() => layout(root), [root])
  const COL = 56
  const ROW = 64
  const R = 18
  const PAD = 30
  const W = Math.max(PAD * 2 + Math.max(cols - 1, 0) * COL, 320)
  const H = PAD * 2 + maxDepth * ROW + R * 2
  const xOf = (n) => PAD + n.col * COL
  const yOf = (n) => PAD + R + n.depth * ROW

  const current = frame?.current ?? null
  const visited = frame?.visited ?? []
  const seqIndex = frame?.seqIndex ?? -1
  const selected = TRAVERSALS.find((t) => t.key === kind)

  const fillOf = (value) => {
    if (current === value) return 'var(--viz-compare)'
    if (visited.includes(value)) return 'var(--viz-sorted)'
    return 'var(--accent-soft)'
  }
  const textFillOf = (value) => {
    const fill = fillOf(value)
    // 채워진 강조색 위에서는 검은 글자가 잘 보임
    return fill === 'var(--accent-soft)' ? 'var(--accent-text)' : '#000'
  }

  // 시퀀스 칩 한 줄의 색: 선택된 순회 행만 진행 상태를 반영.
  const chipStyle = (rowKey, idx) => {
    const isSelectedRow = rowKey === kind
    const base = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: '26px', height: '26px', padding: '0 6px',
      fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
      borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)',
      background: 'var(--bg)', color: 'var(--text)',
    }
    if (!isSelectedRow) return base
    if (idx === seqIndex) {
      return { ...base, background: 'var(--viz-compare)', borderColor: 'var(--viz-compare)', color: '#000' }
    }
    if (idx < seqIndex) {
      return { ...base, background: 'var(--viz-sorted)', borderColor: 'var(--viz-sorted)', color: '#000' }
    }
    return base
  }

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시각화</span> 순회 비교 (전위·중위·후위·레벨)</div>

      <div className="viz-controls">
        <label>애니메이션</label>
        {TRAVERSALS.map((t) => (
          <button
            key={t.key}
            className={`viz-btn${kind === t.key ? ' primary' : ''}`}
            onClick={() => setKind(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <VizControls player={player} />

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet"
          role="img" aria-label="순회 비교용 이진 검색 트리">
          {edges.map(([a, b], i) => (
            <line key={`e${i}`} x1={xOf(a)} y1={yOf(a)} x2={xOf(b)} y2={yOf(b)}
              stroke="var(--border-strong)" strokeWidth="2" />
          ))}
          {nodes.map((n, i) => (
            <g key={`n${i}`}>
              <circle cx={xOf(n)} cy={yOf(n)} r={R}
                fill={fillOf(n.value)} stroke="var(--accent)" strokeWidth="2" />
              <text x={xOf(n)} y={yOf(n)} textAnchor="middle" dominantBaseline="central"
                fontSize="14" fontWeight="700" fill={textFillOf(n.value)}>{n.value}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="viz-note">{frame?.note}</div>

      {/* 네 순회 시퀀스를 항상 표시해 한눈에 비교 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        {TRAVERSALS.map((t) => {
          const isSelectedRow = t.key === kind
          return (
            <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                width: '40px', flexShrink: 0, fontSize: '13px', fontWeight: 700,
                color: isSelectedRow ? 'var(--accent-text)' : 'var(--text-soft)',
              }}>
                {t.label}
              </span>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {orders[t.key].map((v, idx) => (
                  <span key={idx} style={chipStyle(t.key, idx)}>{v}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="viz-note" style={{ marginTop: '8px' }}>
        선택: {selected.label} 순회 — {selected.rule}
      </div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--accent-soft)' }} /> 기본 노드</span>
        <span><i style={{ background: 'var(--viz-compare)' }} /> 방문 중</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 방문 완료</span>
      </div>
    </div>
  )
}
