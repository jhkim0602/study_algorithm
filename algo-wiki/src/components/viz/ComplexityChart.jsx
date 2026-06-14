import { useMemo, useState } from 'react'

const ROWS = [
  { name: '버블 정렬', avg: 'O(n²)', worst: 'O(n²)', stable: '안정', inplace: 'O' },
  { name: '선택 정렬', avg: 'O(n²)', worst: 'O(n²)', stable: '불안정', inplace: 'O' },
  { name: '삽입 정렬', avg: 'O(n²)', worst: 'O(n²)', stable: '안정', inplace: 'O' },
  { name: '쉘 정렬', avg: 'O(n^1.3~1.5)', worst: 'O(n²)', stable: '불안정', inplace: 'O' },
  { name: '퀵 정렬', avg: 'O(n log n)', worst: 'O(n²)', stable: '불안정', inplace: 'O' },
  { name: '병합 정렬', avg: 'O(n log n)', worst: 'O(n log n)', stable: '안정', inplace: 'X' },
  { name: '힙 정렬', avg: 'O(n log n)', worst: 'O(n log n)', stable: '불안정', inplace: 'O' },
  { name: '도수 정렬', avg: 'O(n+k)', worst: 'O(n+k)', stable: '안정', inplace: 'X' },
]

const N_OPTIONS = [8, 16, 32, 64, 128, 256, 512, 1024]

// 대표 증가율 클래스: 연산 횟수 근사값
const CLASSES = [
  {
    key: 'n2',
    label: 'n²',
    color: 'var(--viz-swap)',
    rep: '버블·선택·삽입',
    formula: (n) => `n²=${(n * n).toLocaleString()}`,
    value: (n) => n * n,
  },
  {
    key: 'nlogn',
    label: 'n log n',
    color: 'var(--viz-sorted)',
    rep: '퀵(평균)·병합·힙',
    formula: (n) => `n·log₂n=${Math.round(n * Math.log2(n)).toLocaleString()}`,
    value: (n) => n * Math.log2(n),
  },
  {
    key: 'nk',
    label: 'n+k',
    color: 'var(--viz-pivot)',
    rep: '도수 (k≈n)',
    formula: (n) => `n+k=${(2 * n).toLocaleString()}`,
    value: (n) => 2 * n,
  },
]

export default function ComplexityChart() {
  const [n, setN] = useState(128)

  const bars = useMemo(() => CLASSES.map((c) => ({ ...c, ops: c.value(n) })), [n])

  // 로그 스케일: n² 와 n log n 의 거대한 차이를 한 화면에 담는다.
  const maxLog = Math.log10(Math.max(...bars.map((b) => b.ops), 10))

  const W = 660
  const H = 280
  const padTop = 30
  const padBottom = 56
  const plotH = H - padTop - padBottom
  const barW = 110
  const slot = W / bars.length

  const stableStyle = (s) => ({
    color: s === '안정' ? 'var(--ok)' : 'var(--text-faint)',
    fontWeight: 700,
  })

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시각화</span> 정렬 복잡도 비교</div>

      <table className="wiki-table">
        <thead>
          <tr>
            <th>알고리즘</th>
            <th>평균</th>
            <th>최악</th>
            <th>안정성</th>
            <th>제자리</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.name}>
              <td style={{ fontWeight: 700 }}>{r.name}</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{r.avg}</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{r.worst}</td>
              <td style={stableStyle(r.stable)}>{r.stable}</td>
              <td style={{ fontFamily: 'var(--font-mono)', color: r.inplace === 'O' ? 'var(--ok)' : 'var(--text-faint)' }}>{r.inplace}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="viz-controls">
        <label>입력 크기 n</label>
        {N_OPTIONS.map((v) => (
          <button
            key={v}
            className={v === n ? 'viz-btn primary' : 'viz-btn'}
            onClick={() => setN(v)}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
          {/* 기준선 */}
          <line x1="0" y1={H - padBottom} x2={W} y2={H - padBottom} stroke="var(--border-strong)" strokeWidth="1" />
          {bars.map((b, i) => {
            const cx = slot * i + slot / 2
            const x = cx - barW / 2
            // 로그 스케일 높이 (값이 1 이상이라고 가정)
            const ratio = Math.log10(Math.max(b.ops, 1)) / maxLog
            const barH = Math.max(ratio * plotH, 4)
            const y = H - padBottom - barH
            return (
              <g key={b.key}>
                <rect x={x} y={y} width={barW} height={barH} rx="5" fill={b.color} />
                {/* 막대 위: 공식 = 값 */}
                <text x={cx} y={y - 9} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">
                  {b.label}
                </text>
                {/* 막대 아래: 계산값 */}
                <text x={cx} y={H - padBottom + 18} textAnchor="middle" fontSize="11.5" fontWeight="700" fontFamily="var(--font-mono)" fill="var(--text)">
                  {b.formula(n)}
                </text>
                <text x={cx} y={H - padBottom + 34} textAnchor="middle" fontSize="11" fill="var(--text-faint)">
                  {b.rep}
                </text>
              </g>
            )
          })}
          {/* 스케일 안내 */}
          <text x={W - 4} y={16} textAnchor="end" fontSize="11" fill="var(--text-faint)">
            세로축: log₁₀ 스케일 (n = {n})
          </text>
        </svg>
      </div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-swap)' }} /> O(n²) — 버블·선택·삽입</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> O(n log n) — 퀵·병합·힙</span>
        <span><i style={{ background: 'var(--viz-pivot)' }} /> O(n+k) — 도수</span>
      </div>

      <div className="viz-note">
        n이 커질수록 O(n²)와 O(n log n)의 격차가 급격히 벌어진다 (n=1024일 때 n²는 약 100만, n log n은 약 1만 — 100배 차이). 세로축은 log 스케일이라 막대 높이 차이보다 실제 연산 수 차이가 훨씬 크다. 비교 기반 정렬의 이론적 하한은 Ω(n log n)이므로, 도수 정렬처럼 O(n+k)를 내려면 비교가 아닌 키 분포를 이용해야 한다.
      </div>
    </div>
  )
}
