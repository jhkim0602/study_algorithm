import { useMemo, useState } from 'react'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

// 기본 리스트와 종류
const DEFAULT_VALUES = [10, 20, 30, 40]
const LIST_TYPES = [
  { key: 'single', label: '단순 연결 리스트' },
  { key: 'double', label: '이중 연결 리스트' },
  { key: 'circular', label: '원형 연결 리스트' },
]

// 유휴 상태(검색 전) 프레임
const IDLE_FRAME = { visiting: null, found: null, note: '검색 버튼을 누르면 head부터 차례대로 탐색합니다.' }

let uid = 0
const makeNode = (value) => ({ id: ++uid, value })

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState(() => DEFAULT_VALUES.map(makeNode))
  const [listType, setListType] = useState('single')
  const [inputValue, setInputValue] = useState(50)
  // 삽입/삭제용 일시 강조: { id, kind } (kind: 'insert' | 'delete')
  const [highlight, setHighlight] = useState(null)
  // 검색 세션 프레임 (편집 시 유휴로 초기화)
  const [searchFrames, setSearchFrames] = useState([IDLE_FRAME])

  const player = useStepPlayer(searchFrames)
  const { frame } = player

  const val = () => {
    const n = Number(inputValue)
    return Number.isFinite(n) ? n : 0
  }

  // 편집 시 검색 세션 리셋 + 일시 강조 설정
  const resetSearch = () => setSearchFrames([IDLE_FRAME])

  const insertHead = () => {
    const node = makeNode(val())
    setNodes((prev) => [node, ...prev])
    setHighlight({ id: node.id, kind: 'insert' })
    resetSearch()
    setNote(`맨 앞 삽입: 새 노드.next = 기존 head, head = 새 노드 (값 ${node.value})`)
  }

  const insertTail = () => {
    const node = makeNode(val())
    setNodes((prev) => [...prev, node])
    setHighlight({ id: node.id, kind: 'insert' })
    resetSearch()
    const tailMsg = listType === 'circular'
      ? `맨 뒤 삽입: 기존 tail.next = 새 노드, 새 노드.next = head (원형 유지, 값 ${node.value})`
      : `맨 뒤 삽입: 기존 tail.next = 새 노드, 새 노드.next = None (값 ${node.value})`
    setNote(tailMsg)
  }

  const deleteValue = () => {
    const target = val()
    const idx = nodes.findIndex((n) => n.value === target)
    if (idx === -1) {
      setHighlight(null)
      resetSearch()
      setNote(`값 ${target} 삭제 실패: 일치하는 노드가 없습니다.`)
      return
    }
    // 먼저 삭제 대상을 빨강으로 강조한 뒤 실제 삭제
    setNodes((prev) => prev.filter((_, i) => i !== idx))
    setHighlight(null)
    resetSearch()
    const prevTxt = idx === 0 ? 'head' : '이전 노드'
    const linkTxt = idx === 0 ? 'head = 삭제 노드.next' : `${prevTxt}.next = 삭제 노드.next`
    setNote(`값 ${target} 삭제 (${idx + 1}번째 노드): ${linkTxt}`)
  }

  const search = () => {
    const target = val()
    setHighlight(null)
    if (nodes.length === 0) {
      setSearchFrames([{ visiting: null, found: null, note: '(빈 리스트) 탐색할 노드가 없습니다.' }])
      return
    }
    const frames = []
    // head부터 next를 따라가며 방문 (원형은 한 바퀴까지)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (node.value === target) {
        frames.push({
          visiting: node.id,
          found: node.id,
          note: `값 ${target} 발견 (${i + 1}번째 노드)`,
        })
        setSearchFrames(frames)
        return
      }
      frames.push({
        visiting: node.id,
        found: null,
        note: `${i + 1}번째 노드 방문: 값 ${node.value} ≠ ${target}, next로 이동`,
      })
    }
    // 못 찾음 — 원형이면 한 바퀴 후 head로 돌아옴을 명시
    const tailNote = listType === 'circular'
      ? `값 ${target} 없음 (한 바퀴 순회 후 head로 복귀)`
      : `값 ${target} 없음`
    frames.push({ visiting: null, found: null, note: tailNote })
    setSearchFrames(frames)
  }

  const reset = () => {
    setNodes(DEFAULT_VALUES.map(makeNode))
    setListType((t) => t)
    setHighlight(null)
    resetSearch()
  }

  // 마지막 note (검색 외 편집 메시지를 유휴 프레임에 실어 보냄)
  const setNote = (text) => setSearchFrames([{ ...IDLE_FRAME, note: text }])

  const currentNote = frame?.note ?? IDLE_FRAME.note

  // 노드 색상 결정
  const fillOf = (node) => {
    if (frame?.found === node.id) return 'var(--viz-sorted)'
    if (frame?.visiting === node.id) return 'var(--viz-compare)'
    if (highlight?.id === node.id && highlight.kind === 'delete') return 'var(--viz-swap)'
    if (highlight?.id === node.id && highlight.kind === 'insert') return 'var(--accent-soft)'
    return 'var(--bg)'
  }
  // 강조 노드의 글자색 (채워진 색 위 가독성)
  const textOf = (node) => {
    if (frame?.found === node.id || frame?.visiting === node.id) return '#000'
    return 'var(--text)'
  }

  // ---- SVG 레이아웃 ----
  const NODE_W = 76
  const NODE_H = 46
  const GAP = 58
  const PAD_X = 28
  const isDouble = listType === 'double'
  const isCircular = listType === 'circular'
  // 단순 리스트는 끝에 None 박스를 둘 자리가 필요
  const noneSlot = !isCircular && nodes.length > 0 ? 1 : 0
  const stepX = NODE_W + GAP
  const contentW = PAD_X * 2 + Math.max(nodes.length + noneSlot, 1) * NODE_W + Math.max(nodes.length + noneSlot - 1, 0) * GAP
  const W = Math.max(contentW, 360)
  // 원형 화살표가 위로 솟으므로 위쪽 여백을 넉넉히
  const topPad = isCircular ? 64 : 40
  const H = topPad + NODE_H + 36
  const nodeY = topPad
  const midY = nodeY + NODE_H / 2

  const xOf = (i) => PAD_X + i * stepX
  const noneX = xOf(nodes.length)

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시각화</span> 연결 리스트 조작 실습</div>

      <div className="viz-controls">
        <label>종류</label>
        <select className="viz-select" value={listType} onChange={(e) => { setListType(e.target.value); setHighlight(null); resetSearch() }}>
          {LIST_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <label>값</label>
        <input
          className="viz-input"
          type="number"
          style={{ minWidth: '90px' }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="viz-btn" onClick={insertHead}>맨 앞 삽입</button>
        <button className="viz-btn" onClick={insertTail}>맨 뒤 삽입</button>
        <button className="viz-btn" onClick={deleteValue}>값 삭제</button>
        <button className="viz-btn primary" onClick={search}>검색</button>
        <button className="viz-btn" onClick={reset}>초기화</button>
      </div>

      <VizControls player={player} />

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="ll-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
              <path d="M0,0 L8,3.2 L0,6.4 Z" fill="var(--text-soft)" />
            </marker>
            <marker id="ll-arrow-prev" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
              <path d="M0,0 L8,3.2 L0,6.4 Z" fill="var(--text-faint)" />
            </marker>
          </defs>

          {nodes.length === 0 && (
            <text x={W / 2} y={midY} textAnchor="middle" fontSize="14" fill="var(--text-soft)">
              (빈 리스트) head = None
            </text>
          )}

          {/* head 포인터 라벨 */}
          {nodes.length > 0 && (
            <g>
              <text x={xOf(0) + NODE_W / 2} y={nodeY - (isCircular ? 30 : 16)} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent-text)">head</text>
              <line
                x1={xOf(0) + NODE_W / 2} y1={nodeY - (isCircular ? 24 : 12)}
                x2={xOf(0) + NODE_W / 2} y2={nodeY - 2}
                stroke="var(--accent-text)" strokeWidth="1.5" markerEnd="url(#ll-arrow)"
              />
            </g>
          )}

          {/* next 화살표 (연속 노드 사이) */}
          {nodes.map((node, i) => {
            if (i === nodes.length - 1) return null
            const x1 = xOf(i) + NODE_W
            const x2 = xOf(i + 1)
            return (
              <line key={`next-${node.id}`}
                x1={x1} y1={isDouble ? midY - 6 : midY}
                x2={x2 - 3} y2={isDouble ? midY - 6 : midY}
                stroke="var(--text-soft)" strokeWidth="1.6" markerEnd="url(#ll-arrow)"
              />
            )
          })}

          {/* prev 화살표 (이중 연결 리스트) */}
          {isDouble && nodes.map((node, i) => {
            if (i === 0) return null
            const x1 = xOf(i)
            const x2 = xOf(i - 1) + NODE_W
            return (
              <line key={`prev-${node.id}`}
                x1={x1} y1={midY + 8}
                x2={x2 + 3} y2={midY + 8}
                stroke="var(--text-faint)" strokeWidth="1.4" markerEnd="url(#ll-arrow-prev)"
              />
            )
          })}

          {/* 단순 리스트: 마지막 노드 next -> None 박스 */}
          {!isCircular && nodes.length > 0 && (
            <g>
              <line
                x1={xOf(nodes.length - 1) + NODE_W} y1={isDouble ? midY - 6 : midY}
                x2={noneX - 3} y2={isDouble ? midY - 6 : midY}
                stroke="var(--text-soft)" strokeWidth="1.6" markerEnd="url(#ll-arrow)"
              />
              <rect x={noneX} y={nodeY + 8} width={NODE_W} height={NODE_H - 16} rx="6"
                fill="var(--bg)" stroke="var(--border)" strokeDasharray="4 3" />
              <text x={noneX + NODE_W / 2} y={midY + 4} textAnchor="middle" fontSize="14" fill="var(--text-faint)">∅ None</text>
            </g>
          )}

          {/* 원형 리스트: 마지막 노드 next -> 첫 노드 (위로 곡선) */}
          {isCircular && nodes.length > 0 && (
            <g>
              <path
                d={`M ${xOf(nodes.length - 1) + NODE_W / 2} ${nodeY - 2}
                    C ${xOf(nodes.length - 1) + NODE_W / 2} ${nodeY - 46},
                      ${xOf(0) + NODE_W / 2} ${nodeY - 46},
                      ${xOf(0) + NODE_W / 2} ${nodeY - 2}`}
                fill="none" stroke="var(--viz-pivot)" strokeWidth="1.6" markerEnd="url(#ll-arrow)"
              />
              <text
                x={(xOf(0) + xOf(nodes.length - 1) + NODE_W) / 2}
                y={nodeY - 50} textAnchor="middle" fontSize="11" fill="var(--viz-pivot)" fontWeight="700">
                tail.next → head
              </text>
            </g>
          )}

          {/* 노드 본체 (data | next 두 칸) */}
          {nodes.map((node, i) => {
            const x = xOf(i)
            const dataW = NODE_W * 0.62
            return (
              <g key={node.id}>
                <rect x={x} y={nodeY} width={NODE_W} height={NODE_H} rx="8"
                  fill={fillOf(node)} stroke="var(--border-strong)" strokeWidth="1.4" />
                {/* data | next 구분선 */}
                <line x1={x + dataW} y1={nodeY} x2={x + dataW} y2={nodeY + NODE_H}
                  stroke="var(--border-strong)" strokeWidth="1" />
                <text x={x + dataW / 2} y={midY + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={textOf(node)}>
                  {node.value}
                </text>
                <text x={x + dataW + (NODE_W - dataW) / 2} y={midY + 4} textAnchor="middle" fontSize="10" fill="var(--text-faint)">
                  next
                </text>
                <text x={x + NODE_W / 2} y={nodeY + NODE_H + 14} textAnchor="middle" fontSize="10" fill="var(--text-faint)">
                  {i}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="viz-note">{currentNote}</div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-compare)' }} /> 현재 노드</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 찾음</span>
        <span><i style={{ background: 'var(--viz-swap)' }} /> 삭제 대상</span>
      </div>
    </div>
  )
}
