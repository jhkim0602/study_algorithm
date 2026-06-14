import { useMemo, useState } from 'react'

// 같은 키를 가진 카드를 한눈에 추적할 수 있도록 키별 색을 고정한다.
const KEY_COLORS = {
  1: 'var(--viz-pivot)',
  2: 'var(--viz-bar)',
  3: 'var(--viz-compare)',
}

// 고정 예시 데이터: 키 1과 3이 중복된다.
const CARDS = [
  { k: 3, t: 'A' },
  { k: 1, t: 'B' },
  { k: 3, t: 'C' },
  { k: 2, t: 'D' },
  { k: 1, t: 'E' },
]

// 안정 정렬: 키 오름차순 + 같은 키는 원래 순서 유지.
function stableSort(cards) {
  return cards
    .map((c, i) => ({ ...c, orig: i }))
    .sort((a, b) => a.k - b.k || a.orig - b.orig)
}

// 불안정 정렬: 키 오름차순이지만 같은 키 그룹 안에서는 순서를 뒤집는다(있을 법한 결과).
function unstableSort(cards) {
  return cards
    .map((c, i) => ({ ...c, orig: i }))
    .sort((a, b) => a.k - b.k || b.orig - a.orig)
}

function Card({ card, label }) {
  return (
    <g>
      <rect
        x={card.x}
        y={6}
        width={card.w}
        height={card.h}
        rx="8"
        fill={KEY_COLORS[card.k]}
        stroke="var(--border-strong)"
        strokeWidth="1"
      />
      <text
        x={card.x + card.w / 2}
        y={card.h * 0.5}
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="#000"
      >
        {card.k}
      </text>
      <text
        x={card.x + card.w / 2}
        y={card.h * 0.78}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#000"
        opacity="0.78"
      >
        {card.t}
      </text>
      {label != null && (
        <text
          x={card.x + card.w / 2}
          y={card.h + 22}
          textAnchor="middle"
          fontSize="11"
          fill="var(--text-faint)"
        >
          {label}
        </text>
      )}
    </g>
  )
}

export default function StabilityViz() {
  const [mode, setMode] = useState('stable')

  const sorted = useMemo(
    () => (mode === 'stable' ? stableSort(CARDS) : unstableSort(CARDS)),
    [mode],
  )

  const cardW = 56
  const cardH = 64
  const gap = 16
  const n = CARDS.length
  const W = n * cardW + (n + 1) * gap
  const rowH = cardH + 30

  const positions = CARDS.map((_, i) => gap + i * (cardW + gap))

  const original = CARDS.map((c, i) => ({
    ...c,
    orig: i,
    x: positions[i],
    w: cardW,
    h: cardH,
  }))
  const after = sorted.map((c, i) => ({
    ...c,
    x: positions[i],
    w: cardW,
    h: cardH,
  }))

  const isStable = mode === 'stable'

  return (
    <div className="viz">
      <div className="viz-title">
        <span className="viz-tag">시각화</span> 정렬 안정성 (Stable Sort)
      </div>

      <div className="viz-controls">
        <label>정렬 방식</label>
        <select
          className="viz-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="stable">안정 정렬 (삽입·병합 방식)</option>
          <option value="unstable">불안정 정렬 (선택·퀵 방식)</option>
        </select>
        <button
          className={'viz-btn' + (isStable ? ' primary' : '')}
          onClick={() => setMode('stable')}
        >
          안정
        </button>
        <button
          className={'viz-btn' + (!isStable ? ' primary' : '')}
          onClick={() => setMode('unstable')}
        >
          불안정
        </button>
      </div>

      <div className="viz-stage">
        <div style={{ fontSize: '12px', color: 'var(--text-faint)', margin: '6px 0 2px' }}>
          정렬 전 (원래 순서)
        </div>
        <svg
          viewBox={`0 0 ${W} ${rowH}`}
          width="100%"
          height={rowH}
          preserveAspectRatio="xMidYMid meet"
        >
          {original.map((c) => (
            <Card key={c.orig} card={c} label={`원래 ${c.orig}`} />
          ))}
        </svg>
      </div>

      <div className="viz-stage" style={{ marginTop: '6px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-faint)', margin: '6px 0 2px' }}>
          정렬 후 (키 오름차순)
        </div>
        <svg
          viewBox={`0 0 ${W} ${rowH}`}
          width="100%"
          height={rowH}
          preserveAspectRatio="xMidYMid meet"
        >
          {after.map((c) => (
            <Card key={c.orig} card={c} label={`원래 ${c.orig}`} />
          ))}
        </svg>
      </div>

      {isStable ? (
        <div
          className="viz-note"
          style={{ color: 'var(--ok)', borderLeft: '4px solid var(--ok)' }}
        >
          ✓ 같은 키의 상대 순서 유지 (A→C, B→E) — 정렬 전 A가 C보다 앞이었고 정렬 후에도 그대로다.
        </div>
      ) : (
        <div
          className="viz-note"
          style={{ color: 'var(--viz-swap)', borderLeft: '4px solid var(--viz-swap)' }}
        >
          ✗ 같은 키의 순서가 뒤바뀜 (C가 A보다 앞) — 키 값은 같은데 원래 순서(A→C, B→E)가 깨졌다.
        </div>
      )}

      <div className="viz-note">
        안정 정렬(stable sort)은 키가 같은 원소들의 원래 상대 순서를 정렬 후에도 그대로 유지한다.
        다중 키 정렬(예: 이름순 정렬 후 점수순 정렬)에서 앞선 정렬 결과를 보존하려면 안정 정렬이 필요하다.
        {'\n'}대표 안정 정렬: 삽입·버블·병합·도수(계수) 정렬
        {'\n'}대표 불안정 정렬: 선택·퀵·힙·쉘 정렬
      </div>

      <div className="viz-legend">
        <span><i style={{ background: KEY_COLORS[1] }} /> 키 = 1 (B, E)</span>
        <span><i style={{ background: KEY_COLORS[2] }} /> 키 = 2 (D)</span>
        <span><i style={{ background: KEY_COLORS[3] }} /> 키 = 3 (A, C)</span>
      </div>
    </div>
  )
}
