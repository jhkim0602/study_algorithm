import { useMemo, useState } from 'react'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

// 나쁜 문자(bad character) 테이블: 각 문자의 패턴 내 마지막 등장 인덱스
function buildLast(pattern) {
  const last = {}
  for (let i = 0; i < pattern.length; i++) last[pattern[i]] = i
  return last
}

// 보이어-무어(나쁜 문자 규칙) 검색 프레임 생성
function bmFrames(text, pattern) {
  const n = text.length
  const m = pattern.length
  const last = buildLast(pattern)
  const lastEntries = Object.keys(last).map((c) => [c, last[c]])
  const frames = []
  const found = []

  frames.push({
    text, pattern, last: lastEntries, s: 0, i: -1, j: -1, status: 'none', matched: [], badChar: null,
    found: [...found],
    note: `보이어-무어 시작: 나쁜 문자 테이블(문자 → 패턴 내 마지막 인덱스)을 미리 계산했습니다.`,
  })

  let s = 0
  while (s <= n - m) {
    const matched = []
    let j = m - 1
    let mismatched = false
    while (j >= 0) {
      const i = s + j
      // 비교 직전 프레임 (오른쪽 끝에서 왼쪽으로)
      frames.push({
        text, pattern, last: lastEntries, s, i, j, status: 'none', matched: [...matched], badChar: null,
        found: [...found],
        note: `위치 s=${s}: 오른쪽부터 비교 — text[${i}]='${text[i]}' 와 pattern[${j}]='${pattern[j]}'`,
      })
      if (text[i] === pattern[j]) {
        matched.push(j)
        frames.push({
          text, pattern, last: lastEntries, s, i, j, status: 'match', matched: [...matched], badChar: null,
          found: [...found],
          note: `일치: '${text[i]}' = '${pattern[j]}' → 왼쪽으로 한 칸 진행`,
        })
        j--
      } else {
        mismatched = true
        const c = text[i]
        const lc = c in last ? last[c] : -1
        const shift = Math.max(1, j - lc)
        const note = lc === -1
          ? `불일치: 텍스트 문자 '${c}'는 패턴에 없음 → s += j-(-1) = ${j + 1} 만큼 점프`
          : `불일치: '${c}'는 패턴 index ${lc}에 있음 → s += j-${lc} = ${shift} 만큼 점프`
        frames.push({
          text, pattern, last: lastEntries, s, i, j, status: 'mismatch', matched: [...matched], badChar: c,
          found: [...found],
          note,
        })
        s += shift
        break
      }
    }
    if (!mismatched) {
      // j 가 -1 까지 내려옴 → 전부 일치
      found.push(s)
      frames.push({
        text, pattern, last: lastEntries, s, i: s, j: 0, status: 'match',
        matched: Array.from({ length: m }, (_, k) => k), badChar: null,
        found: [...found],
        note: `패턴 발견! 시작 위치 ${s} → s += 1 로 다음 위치 탐색`,
      })
      s += 1
    }
  }

  frames.push({
    text, pattern, last: lastEntries, s: Math.max(0, n - m), i: -1, j: -1, status: 'none',
    matched: [], badChar: null,
    found: [...found],
    note: found.length
      ? `검색 완료: 발견 위치 [${found.join(', ')}]`
      : `검색 완료: 패턴을 찾지 못했습니다.`,
  })
  return frames
}

const DEFAULT_TEXT = 'HERE IS A SIMPLE EXAMPLE'
const DEFAULT_PATTERN = 'EXAMPLE'

export default function BoyerMooreViz() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [pattern, setPattern] = useState(DEFAULT_PATTERN)
  const [applied, setApplied] = useState({ text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN })
  const [error, setError] = useState('')

  const frames = useMemo(
    () => bmFrames(applied.text, applied.pattern),
    [applied],
  )
  const player = useStepPlayer(frames)
  const { frame } = player

  const run = () => {
    const t = text
    const p = pattern
    if (!p.length) { setError('패턴을 입력하세요.'); return }
    if (p.length > t.length) { setError('패턴이 텍스트보다 길 수 없습니다.'); return }
    setError('')
    setApplied({ text: t, pattern: p })
  }
  const reset = () => {
    setText(DEFAULT_TEXT)
    setPattern(DEFAULT_PATTERN)
    setError('')
    setApplied({ text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN })
  }

  // ----- SVG 레이아웃 -----
  const CELL = 30
  const PAD = 12
  const n = frame.text.length
  const m = frame.pattern.length
  const W = Math.max(n * CELL + PAD * 2, 320)
  const TEXT_Y = 34 // 텍스트 셀 y
  const PAT_Y = 92 // 패턴 셀 y
  const H = PAT_Y + CELL + 26

  // 현재 발견된 시작 위치들이 덮는 텍스트 인덱스 집합
  const foundCells = new Set()
  for (const st of frame.found) {
    for (let k = 0; k < m; k++) foundCells.add(st + k)
  }

  // 텍스트 셀 색상
  const textFill = (idx) => {
    if (frame.i === idx) {
      if (frame.status === 'match') return 'var(--viz-sorted)'
      if (frame.status === 'mismatch') return 'var(--viz-swap)'
      return 'var(--viz-compare)'
    }
    return 'var(--bg)'
  }
  // 패턴 셀 색상 (j 기준)
  const patFill = (k) => {
    if (frame.j === k) {
      if (frame.status === 'match') return 'var(--viz-sorted)'
      if (frame.status === 'mismatch') return 'var(--viz-swap)'
      return 'var(--viz-compare)'
    }
    if (frame.matched?.includes(k)) return 'var(--viz-sorted)'
    return 'var(--bg)'
  }
  const onColor = (fill) => (fill === 'var(--bg)' ? 'var(--text)' : '#fff')

  const cx = (idx) => PAD + idx * CELL + CELL / 2

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시각화</span> 보이어-무어 단계 시각화</div>

      <div className="viz-controls">
        <label>텍스트</label>
        <input className="viz-input mono" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="예: HERE IS A SIMPLE EXAMPLE" />
        <label>패턴</label>
        <input className="viz-input mono" value={pattern} onChange={(e) => setPattern(e.target.value)}
          placeholder="예: EXAMPLE" />
        <button className="viz-btn primary" onClick={run}>적용</button>
        <button className="viz-btn" onClick={reset}>예제 초기화</button>
      </div>

      {error && (
        <div className="viz-note" style={{ color: 'var(--viz-swap)' }}>{error}</div>
      )}

      <VizControls player={player} />

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
          {/* 텍스트 행 */}
          {frame.text.split('').map((ch, idx) => {
            const x = PAD + idx * CELL
            const fill = textFill(idx)
            const isFound = foundCells.has(idx)
            return (
              <g key={`t${idx}`}>
                <rect
                  x={x + 2} y={TEXT_Y} width={CELL - 4} height={CELL} rx="5"
                  fill={fill}
                  stroke={isFound ? 'var(--viz-sorted)' : 'var(--border-strong)'}
                  strokeWidth={isFound ? 2 : 1}
                />
                <text x={x + CELL / 2} y={TEXT_Y + CELL / 2 + 4} textAnchor="middle"
                  fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" fill={onColor(fill)}>{ch === ' ' ? '␣' : ch}</text>
                <text x={x + CELL / 2} y={TEXT_Y + CELL + 12} textAnchor="middle"
                  fontSize="9" fill="var(--text-faint)">{idx}</text>
              </g>
            )
          })}

          {/* i 포인터 */}
          {frame.i >= 0 && frame.i < n && (
            <text x={cx(frame.i)} y={TEXT_Y - 8} textAnchor="middle"
              fontSize="11" fontWeight="800" fill="var(--accent-text)">i</text>
          )}

          {/* 패턴 행 (s 만큼 오른쪽으로 이동) */}
          {frame.s >= 0 && frame.pattern.split('').map((ch, k) => {
            const idx = frame.s + k
            if (idx < 0 || idx >= n) return null
            const x = PAD + idx * CELL
            const fill = patFill(k)
            return (
              <g key={`p${k}`}>
                <rect
                  x={x + 2} y={PAT_Y} width={CELL - 4} height={CELL} rx="5"
                  fill={fill} stroke="var(--border-strong)" strokeWidth="1"
                />
                <text x={x + CELL / 2} y={PAT_Y + CELL / 2 + 4} textAnchor="middle"
                  fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" fill={onColor(fill)}>{ch === ' ' ? '␣' : ch}</text>
              </g>
            )
          })}

          {/* j 포인터 */}
          {frame.j >= 0 && frame.j < m && frame.s >= 0 && (frame.s + frame.j) < n && (
            <text x={cx(frame.s + frame.j)} y={PAT_Y - 8} textAnchor="middle"
              fontSize="11" fontWeight="800" fill="var(--accent-text)">j</text>
          )}
        </svg>
      </div>

      {/* 나쁜 문자 테이블 */}
      {frame.last && (
        <div className="viz-stage" style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '4px' }}>
            나쁜 문자 테이블 — 각 문자의 패턴 내 마지막 등장 인덱스 (없으면 -1)
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {frame.last.map(([c, idx]) => (
              <div key={c} style={{
                minWidth: '34px', textAlign: 'center', padding: '4px 6px', borderRadius: '6px',
                border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px',
                background: frame.badChar === c ? 'var(--viz-compare)' : 'var(--bg)',
                color: frame.badChar === c ? '#000' : 'var(--text)',
              }}>
                <div style={{ fontSize: '10px', color: frame.badChar === c ? '#000' : 'var(--text-faint)' }}>{c === ' ' ? '␣' : c}</div>
                <div style={{ fontWeight: 700 }}>{idx}</div>
              </div>
            ))}
            {frame.badChar != null && !frame.last.some(([c]) => c === frame.badChar) && (
              <div style={{
                minWidth: '34px', textAlign: 'center', padding: '4px 6px', borderRadius: '6px',
                border: '1px solid var(--viz-swap)', fontFamily: 'var(--font-mono)', fontSize: '12px',
                background: 'var(--viz-swap)', color: '#fff',
              }}>
                <div style={{ fontSize: '10px' }}>{frame.badChar === ' ' ? '␣' : frame.badChar}</div>
                <div style={{ fontWeight: 700 }}>-1</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="viz-note">{frame.note}</div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-compare)' }} /> 비교</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 일치</span>
        <span><i style={{ background: 'var(--viz-swap)' }} /> 불일치</span>
        <span><i style={{ background: 'var(--bg)', border: '2px solid var(--viz-sorted)' }} /> 발견 위치</span>
      </div>
    </div>
  )
}
