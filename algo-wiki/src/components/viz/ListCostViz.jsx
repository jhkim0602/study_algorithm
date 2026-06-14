import { useState } from 'react'

// 고정 샘플 데이터
const VALUES = [10, 20, 30, 40, 50]
const MID_INDEX = 3 // "중간(3번 위치)" 기준 인덱스
const ACCESS_INDEX = 3 // arr[3]
const SEARCH_VALUE = 40 // 값 탐색 대상 (인덱스 3에 위치)

// 연산 정의
const OPS = [
  { key: 'insertFront', label: '맨 앞 삽입' },
  { key: 'insertBack', label: '맨 뒤 삽입' },
  { key: 'insertMid', label: '중간(3번 위치) 삽입' },
  { key: 'deleteFront', label: '맨 앞 삭제' },
  { key: 'access', label: '인덱스 접근(arr[3])' },
  { key: 'search', label: '값 탐색' },
]

// 각 연산에 대한 배열/연결 리스트의 비용 모델
//  array.shift : 이동해야 하는 셀 인덱스 목록 (--viz-swap)
//  array.access : 직접 접근하는 셀 인덱스 (--viz-sorted)
//  list.traverse : 순차 탐색으로 방문하는 노드 인덱스 (--viz-compare)
//  list.changeBefore / list.changeAfter : 링크가 바뀌는 두 노드 인덱스 (--viz-sorted)
//  list.headChange : head 포인터 자체가 바뀜
function modelFor(op) {
  const n = VALUES.length
  const allIdx = VALUES.map((_, i) => i)
  switch (op) {
    case 'insertFront':
      return {
        array: {
          shift: allIdx, // 전부 한 칸씩 뒤로 이동
          cost: 'O(n)',
          costNote: '새 칸을 만들려면 모든 원소를 한 칸씩 뒤로 밀어야 함 (데이터 이동)',
        },
        list: {
          traverse: [],
          headChange: true,
          changeBefore: null,
          changeAfter: 0, // 새 노드.next = 기존 head(0번)
          cost: 'O(1)',
          costNote: 'head = 새 노드, 새 노드.next = 기존 head — 링크 두 번만 바꾸면 끝',
        },
      }
    case 'insertBack':
      return {
        array: {
          shift: [], // 빈 칸이 있으면 끝에 바로 저장
          appendAt: n,
          cost: 'O(1)*',
          costNote: '빈 공간이 있으면 맨 끝에 바로 저장 (이동 없음, 상각 O(1))',
        },
        list: {
          traverse: allIdx, // head에 tail 포인터가 없으면 끝까지 순차 탐색
          headChange: false,
          changeBefore: n - 1, // 기존 tail.next = 새 노드
          changeAfter: null,
          appendAt: n,
          cost: 'O(n)',
          costNote: 'tail 포인터가 없으면 head부터 끝 노드까지 순차 탐색 후 링크 변경',
        },
      }
    case 'insertMid':
      return {
        array: {
          shift: allIdx.slice(MID_INDEX), // 3번 이후 셀을 뒤로 이동
          cost: 'O(n)',
          costNote: `${MID_INDEX}번 자리를 비우려면 그 뒤 원소들을 한 칸씩 뒤로 이동`,
        },
        list: {
          traverse: allIdx.slice(0, MID_INDEX), // 삽입 위치 직전까지 순차 탐색
          headChange: false,
          changeBefore: MID_INDEX - 1, // 이전 노드.next = 새 노드
          changeAfter: MID_INDEX, // 새 노드.next = 기존 3번 노드
          cost: 'O(n)',
          costNote: `위치 찾는 순차 탐색은 O(n), 위치를 알면 링크 변경은 O(1)`,
        },
      }
    case 'deleteFront':
      return {
        array: {
          shift: allIdx.slice(1), // 1번부터 앞으로 당김
          cost: 'O(n)',
          costNote: '0번을 지우면 뒤 원소를 모두 한 칸씩 앞으로 당겨야 함 (데이터 이동)',
        },
        list: {
          traverse: [],
          headChange: true,
          changeBefore: null,
          changeAfter: 1, // head = 1번 노드
          cost: 'O(1)',
          costNote: 'head = head.next — 포인터 한 번만 옮기면 끝',
        },
      }
    case 'access':
      return {
        array: {
          access: ACCESS_INDEX, // 시작 주소 + 인덱스로 한 번에 접근
          cost: 'O(1)',
          costNote: `시작 주소 + ${ACCESS_INDEX}×원소크기로 한 번에 직접 접근 (임의 접근)`,
        },
        list: {
          traverse: [0, 1, 2, 3], // head부터 3번 노드까지 한 칸씩 이동
          headChange: false,
          changeBefore: null,
          changeAfter: null,
          accessTarget: ACCESS_INDEX,
          cost: 'O(n)',
          costNote: 'head부터 next를 따라 3번 노드까지 순차 이동 — 임의 접근 불가',
        },
      }
    case 'search':
      return {
        array: {
          scan: allIdx.slice(0, VALUES.indexOf(SEARCH_VALUE) + 1), // 선형 탐색 경로
          access: VALUES.indexOf(SEARCH_VALUE),
          cost: 'O(n)',
          costNote: `값 ${SEARCH_VALUE}를 찾을 때까지 앞에서부터 차례로 비교 (선형 탐색)`,
        },
        list: {
          traverse: allIdx.slice(0, VALUES.indexOf(SEARCH_VALUE) + 1),
          headChange: false,
          changeBefore: null,
          changeAfter: null,
          foundAt: VALUES.indexOf(SEARCH_VALUE),
          cost: 'O(n)',
          costNote: `head부터 값 ${SEARCH_VALUE}를 만날 때까지 순차 비교 (선형 탐색)`,
        },
      }
    default:
      return { array: {}, list: {} }
  }
}

export default function ListCostViz() {
  const [op, setOp] = useState('insertFront')
  const model = modelFor(op)
  const arr = model.array
  const list = model.list

  // ---- 레이아웃 공통 ----
  const W = 640
  const CELL_W = 70
  const CELL_H = 46
  const GAP_ARR = 6 // 배열은 인접(contiguous)하므로 간격을 좁게
  const GAP_LL = 52 // 연결 리스트는 화살표 자리 확보
  const PAD_X = 70 // 좌측 라벨 영역
  const ROW1_Y = 56 // 배열 행
  const ROW2_Y = 168 // 연결 리스트 행

  const arrStepX = CELL_W + GAP_ARR
  const llStepX = CELL_W + GAP_LL
  const arrX = (i) => PAD_X + i * arrStepX
  const llX = (i) => PAD_X + i * llStepX
  const arrMidY = ROW1_Y + CELL_H / 2
  const llMidY = ROW2_Y + CELL_H / 2

  const H = 244

  // ---- 배열 셀 색 ----
  const arrFill = (i) => {
    if (arr.shift?.includes(i)) return 'var(--viz-swap)'
    if (arr.scan?.includes(i)) {
      return i === arr.access ? 'var(--viz-sorted)' : 'var(--viz-compare)'
    }
    if (arr.access === i) return 'var(--viz-sorted)'
    return 'var(--bg)'
  }
  const arrTextFill = (i) => {
    const f = arrFill(i)
    return f === 'var(--bg)' ? 'var(--text)' : '#000'
  }

  // ---- 연결 리스트 노드 색 ----
  const llFill = (i) => {
    const isLink = list.changeBefore === i || list.changeAfter === i
    const isTraverse = list.traverse?.includes(i)
    if (isLink) return 'var(--viz-sorted)'
    if (i === list.foundAt) return 'var(--viz-sorted)'
    if (i === list.accessTarget) return 'var(--viz-sorted)'
    if (isTraverse) return 'var(--viz-compare)'
    return 'var(--bg)'
  }
  const llTextFill = (i) => {
    const f = llFill(i)
    return f === 'var(--bg)' ? 'var(--text)' : '#000'
  }
  // 링크(화살표) 색: 변경되는 링크는 강조, 탐색 경로는 비교색
  const llArrowStroke = (i) => {
    // i번 노드 -> i+1번 노드 화살표
    if (list.changeBefore === i || list.changeAfter === i + 1) return 'var(--viz-sorted)'
    if (list.traverse?.includes(i) && list.traverse?.includes(i + 1)) return 'var(--viz-compare)'
    return 'var(--text-soft)'
  }

  const n = VALUES.length

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시각화</span> 배열 vs 연결 리스트 연산 비용</div>

      <div className="viz-controls">
        <label>연산</label>
        <select className="viz-select" value={op} onChange={(e) => setOp(e.target.value)}>
          {OPS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="lc-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
              <path d="M0,0 L8,3.2 L0,6.4 Z" fill="var(--text-soft)" />
            </marker>
            <marker id="lc-arrow-hi" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
              <path d="M0,0 L8,3.2 L0,6.4 Z" fill="var(--viz-sorted)" />
            </marker>
            <marker id="lc-arrow-scan" markerWidth="9" markerHeight="9" refX="7" refY="3.2" orient="auto">
              <path d="M0,0 L8,3.2 L0,6.4 Z" fill="var(--viz-compare)" />
            </marker>
          </defs>

          {/* ===== 행 라벨 + 비용 배지 ===== */}
          <text x={8} y={ROW1_Y - 18} fontSize="13" fontWeight="800" fill="var(--text)">배열 (Array)</text>
          <CostBadge x={W - 8} y={ROW1_Y - 30} cost={arr.cost} />

          <text x={8} y={ROW2_Y - 18} fontSize="13" fontWeight="800" fill="var(--text)">연결 리스트 (Linked list)</text>
          <CostBadge x={W - 8} y={ROW2_Y - 30} cost={list.cost} />

          {/* ===== 배열 행: 연속된 셀 ===== */}
          {VALUES.map((v, i) => {
            const x = arrX(i)
            return (
              <g key={`arr-${i}`}>
                <rect x={x} y={ROW1_Y} width={CELL_W} height={CELL_H} rx="4"
                  fill={arrFill(i)} stroke="var(--border-strong)" strokeWidth="1.4" />
                <text x={x + CELL_W / 2} y={arrMidY + 5} textAnchor="middle" fontSize="16" fontWeight="700"
                  fill={arrTextFill(i)}>{v}</text>
                <text x={x + CELL_W / 2} y={ROW1_Y + CELL_H + 14} textAnchor="middle" fontSize="10"
                  fill="var(--text-faint)">{i}</text>
              </g>
            )
          })}

          {/* 배열: 이동 방향 표시 (삽입=오른쪽, 삭제=왼쪽) */}
          {arr.shift?.length > 0 && (
            <ShiftHint
              x1={arrX(arr.shift[0]) + CELL_W / 2}
              x2={arrX(arr.shift[arr.shift.length - 1]) + CELL_W / 2}
              y={ROW1_Y - 6}
              direction={op === 'deleteFront' ? 'left' : 'right'}
            />
          )}

          {/* 배열: 인덱스 접근 — 직접 접근 화살표 */}
          {arr.access != null && arr.shift == null && arr.scan == null && (
            <g>
              <text x={arrX(arr.access) + CELL_W / 2} y={ROW1_Y - 6} textAnchor="middle" fontSize="11"
                fontWeight="700" fill="var(--viz-sorted)">직접 접근</text>
            </g>
          )}
          {/* 배열: 값 탐색 — 선형 스캔 경로 */}
          {arr.scan?.length > 0 && (
            <text x={(arrX(arr.scan[0]) + arrX(arr.scan[arr.scan.length - 1]) + CELL_W) / 2} y={ROW1_Y - 6}
              textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--viz-compare)">선형 탐색 →</text>
          )}

          {/* ===== 연결 리스트 행: 노드 + next 화살표 ===== */}
          {/* head 라벨 */}
          <g>
            <text x={llX(0) + CELL_W / 2} y={ROW2_Y - 4} textAnchor="middle" fontSize="11" fontWeight="700"
              fill={list.headChange ? 'var(--viz-sorted)' : 'var(--accent-text)'}>head</text>
          </g>

          {/* next 화살표 (노드 사이) */}
          {VALUES.map((v, i) => {
            if (i === n - 1) return null
            const x1 = llX(i) + CELL_W
            const x2 = llX(i + 1)
            const stroke = llArrowStroke(i)
            const marker = stroke === 'var(--viz-sorted)' ? 'url(#lc-arrow-hi)'
              : stroke === 'var(--viz-compare)' ? 'url(#lc-arrow-scan)' : 'url(#lc-arrow)'
            return (
              <line key={`ll-next-${i}`} x1={x1} y1={llMidY} x2={x2 - 3} y2={llMidY}
                stroke={stroke} strokeWidth={stroke === 'var(--text-soft)' ? 1.6 : 2.2} markerEnd={marker} />
            )
          })}

          {/* 마지막 노드 -> None */}
          {(() => {
            const noneX = llX(n - 1) + CELL_W
            const stroke = list.changeBefore === n - 1 ? 'var(--viz-sorted)' : 'var(--text-soft)'
            const marker = stroke === 'var(--viz-sorted)' ? 'url(#lc-arrow-hi)' : 'url(#lc-arrow)'
            return (
              <g>
                <line x1={noneX} y1={llMidY} x2={noneX + GAP_LL - 8} y2={llMidY}
                  stroke={stroke} strokeWidth={stroke === 'var(--text-soft)' ? 1.6 : 2.2} markerEnd={marker} />
                <text x={noneX + GAP_LL + 4} y={llMidY + 4} fontSize="12" fill="var(--text-faint)">∅</text>
              </g>
            )
          })()}

          {/* 노드 본체 (data | next) */}
          {VALUES.map((v, i) => {
            const x = llX(i)
            const dataW = CELL_W * 0.62
            return (
              <g key={`ll-${i}`}>
                <rect x={x} y={ROW2_Y} width={CELL_W} height={CELL_H} rx="8"
                  fill={llFill(i)} stroke="var(--border-strong)" strokeWidth="1.4" />
                <line x1={x + dataW} y1={ROW2_Y} x2={x + dataW} y2={ROW2_Y + CELL_H}
                  stroke="var(--border-strong)" strokeWidth="1" />
                <text x={x + dataW / 2} y={llMidY + 5} textAnchor="middle" fontSize="15" fontWeight="700"
                  fill={llTextFill(i)}>{v}</text>
                <text x={x + dataW + (CELL_W - dataW) / 2} y={llMidY + 4} textAnchor="middle" fontSize="9"
                  fill={llFill(i) === 'var(--bg)' ? 'var(--text-faint)' : '#000'}>next</text>
                <text x={x + CELL_W / 2} y={ROW2_Y + CELL_H + 14} textAnchor="middle" fontSize="10"
                  fill="var(--text-faint)">{i}</text>
              </g>
            )
          })}

          {/* 연결 리스트: 순차 탐색 경로 라벨 */}
          {list.traverse?.length > 1 && (
            <text x={(llX(list.traverse[0]) + llX(list.traverse[list.traverse.length - 1]) + CELL_W) / 2}
              y={ROW2_Y - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--viz-compare)">
              순차 탐색 →
            </text>
          )}
        </svg>
      </div>

      {/* 선택된 연산의 비용 요약 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
        <CostCard title="배열" cost={arr.cost} note={arr.costNote} />
        <CostCard title="연결 리스트" cost={list.cost} note={list.costNote} />
      </div>

      <div className="viz-note">
        배열은 임의 접근(arr[i])이 O(1)로 빠르지만 중간·앞쪽 삽입/삭제 시 데이터 이동이 비싸다(O(n)).
        연결 리스트는 위치만 알면 삽입/삭제가 O(1)로 싸지만, 그 위치를 찾는 임의 접근·탐색이 O(n)으로 느리다.
      </div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-swap)' }} /> 이동 셀(배열)</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 링크 변경 / 직접 접근</span>
        <span><i style={{ background: 'var(--viz-compare)' }} /> 순차 탐색</span>
      </div>
    </div>
  )
}

// 비용 배지 (SVG, 우측 정렬)
function CostBadge({ x, y, cost }) {
  const isFast = cost === 'O(1)' || cost === 'O(1)*'
  const fill = isFast ? 'var(--ok-soft)' : 'var(--accent-soft)'
  const textFill = isFast ? 'var(--ok)' : 'var(--accent-text)'
  const w = 56
  const h = 22
  return (
    <g>
      <rect x={x - w} y={y} width={w} height={h} rx="6" fill={fill} stroke="var(--border)" strokeWidth="1" />
      <text x={x - w / 2} y={y + 15} textAnchor="middle" fontSize="12" fontWeight="800"
        fill={textFill} fontFamily="var(--font-mono)">{cost}</text>
    </g>
  )
}

// 셀 이동 방향 힌트 (배열 위 화살표)
function ShiftHint({ x1, x2, y, direction }) {
  // direction: 'right'(삽입) 이면 →, 'left'(삭제) 이면 ←
  const from = direction === 'right' ? x1 : x2
  const to = direction === 'right' ? x2 : x1
  return (
    <g>
      <line x1={from} y1={y} x2={to} y2={y} stroke="var(--viz-swap)" strokeWidth="2"
        markerEnd="url(#lc-arrow)" />
      <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" fontSize="11" fontWeight="700"
        fill="var(--viz-swap)">
        {direction === 'right' ? '뒤로 이동' : '앞으로 이동'}
      </text>
    </g>
  )
}

// 비용 카드 (HTML)
function CostCard({ title, cost, note }) {
  const isFast = cost === 'O(1)' || cost === 'O(1)*'
  return (
    <div style={{
      flex: '1 1 240px', minWidth: '220px', padding: '10px 12px',
      border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-elev)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text)' }}>{title}</span>
        <span style={{
          fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)',
          padding: '1px 8px', borderRadius: '6px',
          background: isFast ? 'var(--ok-soft)' : 'var(--accent-soft)',
          color: isFast ? 'var(--ok)' : 'var(--accent-text)',
        }}>{cost}</span>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-soft)', lineHeight: 1.5 }}>{note}</div>
    </div>
  )
}
