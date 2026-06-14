import { useMemo, useState } from 'react'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

// 샘플 삽입 순서: 첫 렌더에 적당히 깊은 트리가 보이도록.
const SAMPLE = [8, 3, 10, 1, 6, 14, 4, 7, 13]

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

function minNode(node) {
  let cur = node
  while (cur.left) cur = cur.left
  return cur
}

function remove(node, value) {
  if (!node) return null
  if (value < node.value) return { ...node, left: remove(node.left, value) }
  if (value > node.value) return { ...node, right: remove(node.right, value) }
  // 일치: 삭제 대상
  if (!node.left) return node.right
  if (!node.right) return node.left
  // 자식 2개 → 오른쪽 서브트리 최소값(중위 후계자)으로 대체
  const succ = minNode(node.right)
  return { ...node, value: succ.value, right: remove(node.right, succ.value) }
}

function buildFromValues(values) {
  let root = null
  for (const v of values) root = insert(root, v)
  return root
}

function contains(node, value) {
  let cur = node
  while (cur) {
    if (value === cur.value) return true
    cur = value < cur.value ? cur.left : cur.right
  }
  return false
}

// ---- 레이아웃: 중위 순회로 x 열, 깊이로 y 행 (MiniTree 방식) ----
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

// ---- 검색 프레임 생성 ----
function searchFrames(root, target) {
  const frames = []
  let cur = root
  let k = 0
  const path = []
  if (!root) {
    return [{ current: null, visited: [], note: '빈 트리입니다. 검색할 노드가 없습니다.' }]
  }
  while (cur) {
    k += 1
    path.push(cur.value)
    if (target === cur.value) {
      frames.push({
        current: cur.value, visited: path.slice(), found: cur.value,
        note: `값 ${target} 발견 (비교 ${k}회)`,
      })
      return frames
    }
    if (target < cur.value) {
      frames.push({
        current: cur.value, visited: path.slice(),
        note: `${target} < ${cur.value} → 왼쪽으로 (비교 ${k}회)`,
      })
      cur = cur.left
    } else {
      frames.push({
        current: cur.value, visited: path.slice(),
        note: `${target} > ${cur.value} → 오른쪽으로 (비교 ${k}회)`,
      })
      cur = cur.right
    }
  }
  frames.push({
    current: null, visited: path.slice(),
    note: `값 ${target} 없음 (비교 ${k}회)`,
  })
  return frames
}

// ---- 순회 프레임 생성 ----
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

const TRAVERSAL_LABEL = { pre: '전위', in: '중위', post: '후위', level: '레벨' }

function traversalFrames(root, kind) {
  if (!root) {
    return [{ current: null, visited: [], note: '빈 트리입니다. 순회할 노드가 없습니다.' }]
  }
  const order = traversalOrder(root, kind)
  const frames = []
  for (let i = 0; i < order.length; i++) {
    const visited = order.slice(0, i + 1)
    const seq = visited.join(' ')
    let note = `${TRAVERSAL_LABEL[kind]} 순회: ${seq}`
    if (kind === 'in' && i === order.length - 1) {
      note += '  (BST의 중위 순회는 항상 오름차순)'
    }
    frames.push({ current: order[i], visited, note })
  }
  return frames
}

const IDLE = [{ current: null, visited: [], note: '값을 입력하고 삽입·삭제·검색을 누르거나, 순회 버튼을 눌러보세요.' }]

function randomValues(count = 8) {
  const pool = []
  while (pool.length < count) {
    const v = Math.floor(Math.random() * 99) + 1
    if (!pool.includes(v)) pool.push(v)
  }
  return pool
}

export default function BSTVisualizer() {
  const [root, setRoot] = useState(() => buildFromValues(SAMPLE))
  const [text, setText] = useState('7')
  // 애니메이션 세션: { op, frames }. 편집 시 IDLE로 리셋.
  const [session, setSession] = useState({ op: 'idle', frames: IDLE })

  const frames = useMemo(() => session.frames, [session])
  const player = useStepPlayer(frames)
  const { frame } = player

  const parseValue = () => {
    const v = Number(text)
    return Number.isFinite(v) ? Math.trunc(v) : null
  }

  // ---- 편집: 삽입 ----
  const handleInsert = () => {
    const v = parseValue()
    if (v === null) return
    if (contains(root, v)) {
      setSession({ op: 'edit', frames: [{ current: v, visited: [v], note: `값 ${v}은(는) 이미 트리에 있습니다 (중복 무시).` }] })
      return
    }
    setRoot((r) => insert(r, v))
    setSession({ op: 'edit', frames: [{ current: v, visited: [v], note: `삽입: 루트부터 비교하며 ${v}보다 크면 오른쪽, 작으면 왼쪽으로 내려가 빈 위치에 새 노드 ${v} 추가.` }] })
  }

  // ---- 편집: 삭제 ----
  const handleDelete = () => {
    const v = parseValue()
    if (v === null) return
    if (!contains(root, v)) {
      setSession({ op: 'edit', frames: [{ current: null, visited: [], deleteTarget: v, note: `값 ${v}은(는) 트리에 없어 삭제할 수 없습니다.` }] })
      return
    }
    // 삭제 케이스 설명 만들기 (실제 노드 찾기)
    let cur = root
    while (cur && cur.value !== v) cur = v < cur.value ? cur.left : cur.right
    let caseNote
    if (cur.left && cur.right) {
      const succ = minNode(cur.right)
      caseNote = `삭제: 자식 2개 → 오른쪽 서브트리 최소값 ${succ.value}(으)로 대체.`
    } else if (cur.left || cur.right) {
      const child = cur.left || cur.right
      caseNote = `삭제: 자식 1개 → 자식 ${child.value}(으)로 끌어올림.`
    } else {
      caseNote = `삭제: 잎 노드 → 그냥 제거.`
    }
    setRoot((r) => remove(r, v))
    setSession({ op: 'edit', frames: [{ current: null, visited: [], deleteTarget: v, note: caseNote }] })
  }

  // ---- 검색 ----
  const handleSearch = () => {
    const v = parseValue()
    if (v === null) return
    setSession({ op: 'search', frames: searchFrames(root, v) })
  }

  // ---- 초기화 / 무작위 ----
  const handleReset = () => {
    setRoot(buildFromValues(SAMPLE))
    setSession({ op: 'idle', frames: IDLE })
  }
  const handleRandom = () => {
    setRoot(buildFromValues(randomValues(8)))
    setSession({ op: 'idle', frames: IDLE })
  }

  // ---- 순회 ----
  const runTraversal = (kind) => {
    setSession({ op: 'traversal', frames: traversalFrames(root, kind) })
  }

  // ---- 레이아웃 + SVG 좌표 ----
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
  const found = frame?.found ?? null
  const deleteTarget = frame?.deleteTarget ?? null

  const fillOf = (value) => {
    if (deleteTarget === value) return 'var(--viz-swap)'
    if (current === value) return 'var(--viz-compare)'
    if (found === value) return 'var(--viz-sorted)'
    if (visited.includes(value)) return 'var(--viz-sorted)'
    return 'var(--accent-soft)'
  }
  const textFillOf = (value) => {
    const fill = fillOf(value)
    // 채워진 강조색 위에서는 검은 글자가 잘 보임
    return fill === 'var(--accent-soft)' ? 'var(--accent-text)' : '#000'
  }

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시각화</span> 이진 검색 트리(BST) 실습</div>

      <div className="viz-controls">
        <label>값</label>
        <input className="viz-input mono" type="number" value={text}
          onChange={(e) => setText(e.target.value)} placeholder="예: 7" style={{ minWidth: '90px' }} />
        <button className="viz-btn primary" onClick={handleInsert}>삽입</button>
        <button className="viz-btn" onClick={handleDelete}>삭제</button>
        <button className="viz-btn" onClick={handleSearch}>검색</button>
        <button className="viz-btn" onClick={handleReset}>초기화</button>
        <button className="viz-btn" onClick={handleRandom}>무작위</button>
      </div>

      <div className="viz-controls">
        <label>순회</label>
        <button className="viz-btn" onClick={() => runTraversal('pre')}>전위</button>
        <button className="viz-btn" onClick={() => runTraversal('in')}>중위</button>
        <button className="viz-btn" onClick={() => runTraversal('post')}>후위</button>
        <button className="viz-btn" onClick={() => runTraversal('level')}>레벨</button>
      </div>

      <VizControls player={player} />

      <div className="viz-stage">
        {nodes.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-faint)', fontSize: '14px' }}>
            (빈 트리)
          </div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet"
            role="img" aria-label="이진 검색 트리">
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
        )}
      </div>

      <div className="viz-note">{frame?.note}</div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--accent-soft)' }} /> 기본 노드</span>
        <span><i style={{ background: 'var(--viz-compare)' }} /> 현재 노드</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 방문·찾음</span>
        <span><i style={{ background: 'var(--viz-swap)' }} /> 삭제 대상</span>
      </div>
    </div>
  )
}
