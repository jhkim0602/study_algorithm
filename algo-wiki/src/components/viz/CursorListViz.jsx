import { useMemo, useState } from 'react'

const SIZE = 8
const NIL = -1

// 초기 상태: 사용 리스트 [10→20→30]은 인덱스 0,1,2 차지,
// 나머지 3..7 은 free list 로 연결
function makeInitial() {
  const slots = Array.from({ length: SIZE }, () => ({ data: null, next: NIL }))
  // 사용 리스트 (head=0)
  slots[0] = { data: 10, next: 1 }
  slots[1] = { data: 20, next: 2 }
  slots[2] = { data: 30, next: NIL }
  // free list (free=3)
  slots[3] = { data: null, next: 4 }
  slots[4] = { data: null, next: 5 }
  slots[5] = { data: null, next: 6 }
  slots[6] = { data: null, next: 7 }
  slots[7] = { data: null, next: NIL }
  return { slots, head: 0, free: 3 }
}

// head 부터 next 인덱스를 따라가며 체인에 속한 인덱스 집합/순서를 구한다
function chainOf(slots, start) {
  const order = []
  const set = new Set()
  let cur = start
  let guard = 0
  while (cur !== NIL && guard <= SIZE) {
    if (set.has(cur)) break // 순환 방지
    order.push(cur)
    set.add(cur)
    cur = slots[cur]?.next ?? NIL
    guard += 1
  }
  return { order, set }
}

export default function CursorListViz() {
  const [state, setState] = useState(makeInitial)
  const [value, setValue] = useState('40')
  // 방금 할당된(insert) 슬롯, 방금 반납된(delete) 슬롯, 안내 메시지
  const [allocated, setAllocated] = useState(NIL)
  const [freed, setFreed] = useState(NIL)
  const [note, setNote] = useState(
    'head=0 의 사용 리스트는 10→20→30, free=3 의 free list 는 빈 칸 3→4→5→6→7 로 연결되어 있습니다.',
  )

  const { slots, head, free } = state

  const used = useMemo(() => chainOf(slots, head), [slots, head])
  const freeChain = useMemo(() => chainOf(slots, free), [slots, free])

  const insertFront = () => {
    const v = Number(value)
    if (!Number.isFinite(v)) {
      setNote('삽입할 정수 값을 입력하세요.')
      return
    }
    if (free === NIL) {
      setNote('free list 가 비어 있어 더 이상 삽입할 수 없습니다 (배열이 가득 참).')
      setAllocated(NIL)
      setFreed(NIL)
      return
    }
    const idx = free // free list 의 맨 앞 슬롯을 꺼낸다
    const nextFree = slots[idx].next
    const newSlots = slots.map((s) => ({ ...s }))
    newSlots[idx] = { data: v, next: head } // 새 노드를 사용 리스트 맨 앞에 연결
    setState({ slots: newSlots, head: idx, free: nextFree })
    setAllocated(idx)
    setFreed(NIL)
    setNote(
      `삽입: free 의 맨 앞 칸 [${idx}] 을 꺼내(free=${nextFree === NIL ? '-1' : nextFree}) ` +
        `값 ${v} 저장 후 next=${head === NIL ? '-1' : head} 로 사용 리스트 맨 앞에 연결, head=${idx}.`,
    )
  }

  const deleteValue = () => {
    const v = Number(value)
    if (!Number.isFinite(v)) {
      setNote('삭제할 정수 값을 입력하세요.')
      return
    }
    // 사용 체인을 따라가며 값이 v 인 첫 노드와 그 직전 노드를 찾는다
    let prev = NIL
    let cur = head
    while (cur !== NIL && slots[cur].data !== v) {
      prev = cur
      cur = slots[cur].next
    }
    if (cur === NIL) {
      setNote(`값 ${v} 을(를) 사용 리스트에서 찾지 못했습니다.`)
      setAllocated(NIL)
      setFreed(NIL)
      return
    }
    const newSlots = slots.map((s) => ({ ...s }))
    let newHead = head
    // 사용 체인에서 cur 분리
    if (prev === NIL) {
      newHead = newSlots[cur].next
    } else {
      newSlots[prev].next = newSlots[cur].next
    }
    // 분리한 슬롯을 free list 맨 앞으로 반납
    newSlots[cur] = { data: null, next: free }
    setState({ slots: newSlots, head: newHead, free: cur })
    setAllocated(NIL)
    setFreed(cur)
    setNote(
      `삭제: 값 ${v} 인 칸 [${cur}] 을 사용 리스트에서 분리한 뒤 ` +
        `next=${free === NIL ? '-1' : free} 로 free list 맨 앞에 반납, free=${cur}. 이 칸은 다음 삽입에서 재사용됩니다.`,
    )
  }

  const reset = () => {
    setState(makeInitial())
    setAllocated(NIL)
    setFreed(NIL)
    setNote(
      'head=0 의 사용 리스트는 10→20→30, free=3 의 free list 는 빈 칸 3→4→5→6→7 로 연결되어 있습니다.',
    )
  }

  // ── SVG 레이아웃 ──
  const cellW = 88
  const cellH = 74
  const gap = 14
  const padX = 16
  const topY = 64
  const W = padX * 2 + SIZE * cellW + (SIZE - 1) * gap
  const H = topY + cellH + 70

  const cellX = (i) => padX + i * (cellW + gap)

  const fillOf = (i) => {
    if (i === allocated) return 'var(--viz-sorted)' // 방금 할당
    if (i === freed) return 'var(--viz-swap)' // 방금 반납
    if (used.set.has(i)) return 'var(--accent-soft)' // 사용 노드
    return 'var(--bg)' // free / 빈 슬롯
  }
  const isFreeCell = (i) => freeChain.set.has(i) && i !== allocated && i !== freed
  const textOnFill = (i) => (i === allocated || i === freed ? '#000' : 'var(--text)')

  // 사용 체인의 인접 노드를 잇는 곡선 화살표 경로
  const linkArrows = used.order
    .map((idx, k) => {
      const nx = slots[idx].next
      if (nx === NIL) return null
      const x1 = cellX(idx) + cellW
      const x2 = cellX(nx)
      const y = topY + cellH / 2
      const dir = x2 >= x1 ? 1 : -1
      const sx = dir === 1 ? x1 : cellX(idx)
      const ex = dir === 1 ? x2 : cellX(nx) + cellW
      const lift = 30 + Math.min(Math.abs(nx - idx), SIZE) * 6
      const midX = (sx + ex) / 2
      const cy = topY - lift
      return (
        <path
          key={`lk-${idx}-${k}`}
          d={`M ${sx} ${y - 18} C ${sx} ${cy}, ${ex} ${cy}, ${ex} ${y - 18}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          markerEnd="url(#cl-arrow)"
        />
      )
    })
    .filter(Boolean)

  return (
    <div className="viz">
      <div className="viz-title">
        <span className="viz-tag">시각화</span> 커서 기반 연결 리스트 + free list
      </div>

      <div className="viz-controls">
        <label>값</label>
        <input
          className="viz-input mono"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="예: 40"
          style={{ minWidth: '90px' }}
        />
        <button className="viz-btn primary" onClick={insertFront}>맨 앞 삽입</button>
        <button className="viz-btn" onClick={deleteValue}>값 삭제</button>
        <button className="viz-btn" onClick={reset}>초기화</button>
      </div>

      <div className="viz-controls" style={{ margin: '0 0 4px', gap: '18px' }}>
        <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--accent-text)', fontWeight: 700 }}>
          head = {head === NIL ? '-1' : head}
        </span>
        <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-soft)', fontWeight: 700 }}>
          free = {free === NIL ? '-1' : free}
        </span>
      </div>

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="cl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* 사용 체인 링크 화살표 */}
          {linkArrows}

          {/* head / free 포인터 라벨 */}
          {head !== NIL && (
            <g>
              <text x={cellX(head) + cellW / 2} y={topY + cellH + 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent-text)">
                head
              </text>
              <path
                d={`M ${cellX(head) + cellW / 2} ${topY + cellH + 30} L ${cellX(head) + cellW / 2} ${topY + cellH + 4}`}
                stroke="var(--accent-text)" strokeWidth="2" markerEnd="url(#cl-arrow)"
              />
            </g>
          )}
          {free !== NIL && (
            <g>
              <text x={cellX(free) + cellW / 2} y={topY + cellH + 50} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text-soft)">
                free
              </text>
              <path
                d={`M ${cellX(free) + cellW / 2} ${topY + cellH + 54} L ${cellX(free) + cellW / 2} ${topY + cellH + 4}`}
                stroke="var(--text-soft)" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#cl-arrow)"
              />
            </g>
          )}

          {/* 배열 슬롯 */}
          {slots.map((s, i) => {
            const x = cellX(i)
            const freeCell = isFreeCell(i)
            return (
              <g key={i}>
                {/* 인덱스 */}
                <text x={x + cellW / 2} y={topY - 44} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-faint)">
                  [{i}]
                </text>
                {/* 셀 본체 */}
                <rect
                  x={x} y={topY} width={cellW} height={cellH} rx="7"
                  fill={fillOf(i)}
                  stroke={freeCell ? 'var(--border-strong)' : 'var(--border-strong)'}
                  strokeWidth="1.5"
                  strokeDasharray={freeCell ? '5 4' : '0'}
                />
                {/* data | next 구분선 */}
                <line x1={x} y1={topY + cellH - 24} x2={x + cellW} y2={topY + cellH - 24} stroke="var(--border)" strokeWidth="1" />
                {/* data */}
                <text x={x + cellW / 2} y={topY + 28} textAnchor="middle" fontSize="17" fontWeight="800" fill={textOnFill(i)}>
                  {s.data === null ? '빈칸' : s.data}
                </text>
                {/* next 라벨 + 값 */}
                <text x={x + 8} y={topY + cellH - 8} textAnchor="start" fontSize="10" fill="var(--text-faint)">
                  next
                </text>
                <text x={x + cellW - 8} y={topY + cellH - 8} textAnchor="end" fontSize="12" fontWeight="700" fontFamily="var(--font-mono)" fill={textOnFill(i)}>
                  {s.next === NIL ? '-1' : s.next}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="viz-note">{note}</div>

      <div className="viz-note" style={{ fontFamily: 'var(--font-sans)' }}>
        포인터 대신 배열 인덱스로 연결을 표현하며, 삭제된 칸은 free list 로 관리해 다음 삽입에서 재사용합니다.
        삽입은 free 의 맨 앞 칸을 꺼내 쓰고, 삭제는 분리한 칸을 free 의 맨 앞으로 반납합니다.
        만약 삭제만 반복되고 재사용(삽입)이 일어나지 않으면 사용되지 않는 빈 레코드가 계속 쌓일 수 있습니다.
      </div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--accent-soft)' }} /> 사용 노드</span>
        <span><i style={{ background: 'var(--bg)', border: '1px dashed var(--border-strong)' }} /> free 슬롯</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 방금 할당</span>
        <span><i style={{ background: 'var(--viz-swap)' }} /> 방금 반납</span>
      </div>
    </div>
  )
}
