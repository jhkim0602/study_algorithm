import { useMemo, useState } from 'react'

// 브루트 포스: 모든 문자 비교(실패하는 비교 포함)를 센다.
function bruteForce(text, pattern) {
  const n = text.length
  const m = pattern.length
  let comparisons = 0
  const found = []
  for (let i = 0; i + m <= n; i++) {
    let j = 0
    while (j < m) {
      comparisons++ // text[i+j] === pattern[j] 비교 1회
      if (text[i + j] !== pattern[j]) break
      j++
    }
    if (j === m) found.push(i)
  }
  return { comparisons, found }
}

// KMP의 부분 일치 테이블(LPS). lps[k] = pattern[0..k]의 접두사이자 접미사인 최대 길이.
function buildLps(pattern) {
  const m = pattern.length
  const lps = new Array(m).fill(0)
  let len = 0
  let i = 1
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++
      lps[i] = len
      i++
    } else if (len > 0) {
      len = lps[len - 1]
    } else {
      lps[i] = 0
      i++
    }
  }
  return lps
}

// KMP: text[i] === pattern[j] 비교 1회씩을 센다.
function kmp(text, pattern) {
  const n = text.length
  const m = pattern.length
  const lps = buildLps(pattern)
  let comparisons = 0
  const found = []
  let i = 0
  let j = 0
  while (i < n) {
    comparisons++ // text[i] === pattern[j] 비교 1회
    if (text[i] === pattern[j]) {
      i++
      j++
      if (j === m) {
        found.push(i - j)
        j = lps[j - 1]
      }
    } else if (j > 0) {
      j = lps[j - 1] // 텍스트 포인터 i는 뒤로 가지 않는다
    } else {
      i++
    }
  }
  return { comparisons, found, lps }
}

const DEFAULT_TEXT = 'ABABABABABAB ABABCABAB'
const DEFAULT_PATTERN = 'ABABCABAB'
const MAX_TEXT = 120
const MAX_PATTERN = 40

export default function BFvsKMPViz() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [pattern, setPattern] = useState(DEFAULT_PATTERN)
  const [applied, setApplied] = useState({ text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN })
  const [error, setError] = useState('')

  const result = useMemo(() => {
    const bf = bruteForce(applied.text, applied.pattern)
    const km = kmp(applied.text, applied.pattern)
    return { bf, km }
  }, [applied])

  const run = () => {
    const t = text
    const p = pattern
    if (!p.length) { setError('패턴을 입력하세요.'); return }
    if (!t.length) { setError('텍스트를 입력하세요.'); return }
    if (p.length > t.length) { setError('패턴이 텍스트보다 길 수 없습니다.'); return }
    if (t.length > MAX_TEXT) { setError(`텍스트는 ${MAX_TEXT}자 이하로 입력하세요.`); return }
    if (p.length > MAX_PATTERN) { setError(`패턴은 ${MAX_PATTERN}자 이하로 입력하세요.`); return }
    setError('')
    setApplied({ text: t, pattern: p })
  }
  const reset = () => {
    setText(DEFAULT_TEXT)
    setPattern(DEFAULT_PATTERN)
    setError('')
    setApplied({ text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN })
  }

  const { bf, km } = result
  const maxC = Math.max(bf.comparisons, km.comparisons, 1)

  // ----- 막대 차트 레이아웃 -----
  const W = 640
  const PAD_L = 96 // 라벨 영역
  const PAD_R = 16
  const BAR_AREA = W - PAD_L - PAD_R
  const BAR_H = 36
  const ROW_H = 64
  const TOP = 14
  const H = TOP + ROW_H * 2 + 8

  const rows = [
    { label: '브루트 포스', value: bf.comparisons, color: 'var(--viz-swap)' },
    { label: 'KMP', value: km.comparisons, color: 'var(--viz-sorted)' },
  ]

  const ratio = km.comparisons > 0
    ? (bf.comparisons / km.comparisons).toFixed(2)
    : '∞'

  const samePositions =
    bf.found.length === km.found.length &&
    bf.found.every((v, i) => v === km.found[i])

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시각화</span> 브루트 포스 vs KMP 비교 횟수</div>

      <div className="viz-controls">
        <label>텍스트</label>
        <input className="viz-input mono" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="예: ABABABABABAB ABABCABAB" />
        <label>패턴</label>
        <input className="viz-input mono" value={pattern} onChange={(e) => setPattern(e.target.value)}
          placeholder="예: ABABCABAB" />
        <button className="viz-btn primary" onClick={run}>비교</button>
        <button className="viz-btn" onClick={reset}>예제 초기화</button>
      </div>

      {error && (
        <div className="viz-note" style={{ color: 'var(--viz-swap)' }}>{error}</div>
      )}

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
          {rows.map((row, idx) => {
            const y = TOP + idx * ROW_H
            const barLen = Math.max((row.value / maxC) * BAR_AREA, 2)
            const labelInside = barLen > 70
            return (
              <g key={row.label}>
                {/* 알고리즘 이름 */}
                <text x={PAD_L - 10} y={y + BAR_H / 2 + 5} textAnchor="end"
                  fontSize="13" fontWeight="700" fill="var(--text)">{row.label}</text>
                {/* 배경 트랙 */}
                <rect x={PAD_L} y={y} width={BAR_AREA} height={BAR_H} rx="6"
                  fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
                {/* 값 막대 */}
                <rect x={PAD_L} y={y} width={barLen} height={BAR_H} rx="6" fill={row.color} />
                {/* 횟수 라벨 */}
                <text
                  x={labelInside ? PAD_L + barLen - 10 : PAD_L + barLen + 8}
                  y={y + BAR_H / 2 + 5}
                  textAnchor={labelInside ? 'end' : 'start'}
                  fontSize="14" fontWeight="800"
                  fill={labelInside ? '#fff' : 'var(--text)'}>
                  {row.value}회
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* 통계 요약 */}
      <div className="viz-stage" style={{ marginTop: '6px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <SummaryCell label="텍스트 길이" value={`${applied.text.length}`} />
          <SummaryCell label="패턴 길이" value={`${applied.pattern.length}`} />
          <SummaryCell label="브루트 포스 비교" value={`${bf.comparisons}회`} color="var(--viz-swap)" />
          <SummaryCell label="KMP 비교" value={`${km.comparisons}회`} color="var(--viz-sorted)" />
          <SummaryCell label="비교 횟수 비율" value={`×${ratio}`} />
          <SummaryCell
            label="발견 위치"
            value={(samePositions ? km.found : []).length ? km.found.join(', ') : '없음'}
          />
        </div>
        {!samePositions && (
          <div style={{ fontSize: '12px', color: 'var(--viz-swap)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
            두 알고리즘 발견 위치 불일치 (BF: [{bf.found.join(', ')}], KMP: [{km.found.join(', ')}])
          </div>
        )}
      </div>

      {/* KMP 부분 일치 테이블 (LPS / skip table) */}
      <div className="viz-stage" style={{ marginTop: '6px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '4px' }}>
          KMP 부분 일치 테이블 (LPS) — 패턴 문자 → 접두사이자 접미사인 최대 길이
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {applied.pattern.split('').map((ch, k) => (
            <div key={k} style={{
              minWidth: '32px', textAlign: 'center', padding: '4px 6px', borderRadius: '6px',
              border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px',
              background: 'var(--bg)', color: 'var(--text)',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{k}</div>
              <div style={{ fontWeight: 700 }}>{ch === ' ' ? '␣' : ch}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-text)' }}>{km.lps[k]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="viz-note">
        같은 입력에서 KMP가 비교를 적게 하는 이유: 불일치가 나도 텍스트 포인터 i가 뒤로 돌아가지 않고,
        이미 일치한 접두사 정보를 skip table(LPS)로 재사용해 패턴만 적절히 당겨 다시 검사하기 때문입니다.
        브루트 포스는 매번 처음부터 다시 비교하므로 부분 일치가 많을수록 비교가 급증합니다.
      </div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-swap)' }} /> 브루트 포스 비교 횟수</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> KMP 비교 횟수</span>
      </div>
    </div>
  )
}

function SummaryCell({ label, value, color }) {
  return (
    <div style={{
      minWidth: '92px', padding: '6px 10px', borderRadius: '6px',
      border: '1px solid var(--border)', background: 'var(--bg)',
    }}>
      <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 600 }}>{label}</div>
      <div style={{
        fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)',
        color: color || 'var(--text)',
      }}>{value}</div>
    </div>
  )
}
