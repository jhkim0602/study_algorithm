import { useMemo, useState } from 'react'

const DEFAULT = '50, 30, 40, 10, 20, 35, 15'

function parseArray(text) {
  return text
    .split(/[,\s]+/)
    .map((s) => Number(s))
    .filter((x) => Number.isFinite(x))
    .slice(0, 15)
}

// 완전이진트리 인덱스 관계 (0-based)
const parentOf = (i) => Math.floor((i - 1) / 2)
const leftOf = (i) => 2 * i + 1
const rightOf = (i) => 2 * i + 2

export default function HeapArrayViz() {
  const [text, setText] = useState(DEFAULT)
  const [arr, setArr] = useState(() => parseArray(DEFAULT))
  const [sel, setSel] = useState(2)

  const apply = () => {
    const next = parseArray(text)
    if (next.length >= 1) {
      setArr(next)
      setSel((s) => Math.min(s, next.length - 1))
    }
  }
  const randomize = () => {
    const len = Math.floor(Math.random() * 6) + 7 // 7~12개
    const next = Array.from({ length: len }, () => Math.floor(Math.random() * 90) + 10)
    setText(next.join(', '))
    setArr(next)
    setSel((s) => Math.min(s, next.length - 1))
  }

  const n = arr.length

  // 선택 i 기준 관계 인덱스
  const p = sel > 0 ? parentOf(sel) : -1
  const l = leftOf(sel)
  const r = rightOf(sel)
  const lOk = l < n
  const rOk = r < n

  // 인덱스 i 의 강조 색 (배열 셀 / 트리 노드 공통)
  const colorOf = (i) => {
    if (i === sel) return 'var(--viz-compare)' // 선택
    if (i === p) return 'var(--viz-pivot)' // 부모
    if (i === l || i === r) return 'var(--viz-sorted)' // 자식
    return null
  }
  const isHi = (i) => colorOf(i) !== null

  // ── 완전이진트리 레벨 순서 배치 ──
  // 노드 i 의 레벨 L = floor(log2(i+1)). 레벨 L 은 인덱스 2^L-1 .. 2^(L+1)-2.
  // 화면 폭을 균등 분할하여 레벨 내 위치를 잡으면 가장 넓은(마지막) 레벨이 꽉 차게 펼쳐진다.
  const layout = useMemo(() => {
    if (n === 0) return { nodes: [], edges: [], W: 360, H: 120 }
    const levels = Math.floor(Math.log2(n)) + 1 // 트리 깊이(레벨 수)
    const lastLevelSlots = 2 ** (levels - 1) // 가장 넓은 레벨의 칸 수
    const COL = 56 // 칸 너비
    const ROW = 70 // 레벨 간 높이
    const R = 19 // 노드 반지름
    const W = Math.max(lastLevelSlots * COL, 360)
    const H = 30 + levels * ROW

    const xy = (i) => {
      const L = Math.floor(Math.log2(i + 1))
      const first = 2 ** L - 1 // 그 레벨의 첫 인덱스
      const posInLevel = i - first // 레벨 내 순번 (0..)
      const slots = 2 ** L // 그 레벨의 칸 수
      const x = (W * (posInLevel + 0.5)) / slots
      const y = 30 + L * ROW
      return { x, y }
    }

    const nodes = arr.map((v, i) => ({ i, v, ...xy(i) }))
    const edges = []
    for (let i = 1; i < n; i += 1) {
      const a = xy(parentOf(i))
      const b = xy(i)
      edges.push({ a, b, child: i })
    }
    return { nodes, edges, W, H, R }
  }, [arr, n])

  // ── 배열 셀 가로 배치 (SVG) ──
  const CELL = 54
  const CW = Math.max(n * CELL + 16, 360)
  const CH = 64

  const note = (() => {
    if (n === 0) return '배열이 비어 있습니다.'
    const lText = lOk ? `${l}` : `${l} (범위 밖, 자식 없음)`
    const rText = rOk ? `${r}` : `${r} (범위 밖, 자식 없음)`
    const pText = sel === 0 ? '없음 (루트)' : `(${sel}-1)//2=${p}`
    return `선택 i=${sel} → 부모=${pText}, 왼쪽=2·${sel}+1=${lText}, 오른쪽=2·${sel}+2=${rText}`
  })()

  return (
    <div className="viz">
      <div className="viz-title">
        <span className="viz-tag">시각화</span> 완전이진트리 ↔ 배열 인덱스 매핑
      </div>

      <div className="viz-controls">
        <label>배열</label>
        <input
          className="viz-input mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: 50, 30, 40, 10, 20"
        />
        <button className="viz-btn primary" onClick={apply}>적용</button>
        <button className="viz-btn" onClick={randomize}>무작위</button>
      </div>

      <div className="viz-stage">
        {/* 배열 뷰 */}
        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          width="100%"
          height={CH}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="배열 표현"
        >
          {arr.map((v, i) => {
            const x = 8 + i * CELL
            const fill = colorOf(i)
            return (
              <g
                key={i}
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={22}
                  width={CELL - 6}
                  height={34}
                  rx="5"
                  fill={fill || 'var(--bg)'}
                  stroke={i === sel ? 'var(--accent)' : 'var(--border-strong)'}
                  strokeWidth={i === sel ? 2 : 1}
                />
                <text
                  x={x + (CELL - 6) / 2}
                  y={12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-faint)"
                  fontFamily="var(--font-mono)"
                >
                  {i}
                </text>
                <text
                  x={x + (CELL - 6) / 2}
                  y={39}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="15"
                  fontWeight="700"
                  fill={isHi(i) ? '#000' : 'var(--text)'}
                >
                  {v}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="viz-stage" style={{ marginTop: '6px' }}>
        {/* 완전이진트리 뷰 */}
        <svg
          viewBox={`0 0 ${layout.W} ${layout.H}`}
          width="100%"
          height={layout.H}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="완전이진트리 표현"
        >
          {layout.edges.map(({ a, b }, k) => (
            <line
              key={k}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--border-strong)"
              strokeWidth="2"
            />
          ))}
          {layout.nodes.map(({ i, v, x, y }) => {
            const fill = colorOf(i)
            return (
              <g
                key={i}
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={layout.R}
                  fill={fill || 'var(--accent-soft)'}
                  stroke={i === sel ? 'var(--accent)' : 'var(--accent)'}
                  strokeWidth={i === sel ? 3 : 1.5}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="700"
                  fill={isHi(i) ? '#000' : 'var(--accent-text)'}
                >
                  {v}
                </text>
                <text
                  x={x}
                  y={y + layout.R + 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--text-faint)"
                  fontFamily="var(--font-mono)"
                >
                  i={i}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="viz-note">{note}</div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-compare)' }} /> 선택 i</span>
        <span><i style={{ background: 'var(--viz-pivot)' }} /> 부모 (i-1)//2</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 자식 2i+1 / 2i+2</span>
      </div>
    </div>
  )
}
