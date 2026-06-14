import { useMemo, useState } from 'react'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

// 브루트 포스 문자열 검색 프레임 생성
function bruteFrames(text, pattern) {
  const n = text.length
  const m = pattern.length
  const frames = []
  const found = []

  frames.push({
    text, pattern, s: 0, i: 0, j: 0, status: 'none', matched: [],
    found: [...found],
    note: `브루트 포스 시작: 패턴을 텍스트 위에서 한 칸씩 밀며 비교합니다.`,
  })

  for (let s = 0; s <= n - m; s++) {
    const matched = []
    let j = 0
    for (; j < m; j++) {
      const i = s + j
      // 비교 직전 프레임
      frames.push({
        text, pattern, s, i, j, status: 'none', matched: [...matched],
        found: [...found],
        note: `위치 s=${s}: text[${i}]='${text[i]}' 와 pattern[${j}]='${pattern[j]}' 비교`,
      })
      if (text[i] === pattern[j]) {
        matched.push(j)
        frames.push({
          text, pattern, s, i, j, status: 'match', matched: [...matched],
          found: [...found],
          note: `일치: '${text[i]}' = '${pattern[j]}' → 다음 문자로 진행`,
        })
      } else {
        frames.push({
          text, pattern, s, i, j, status: 'mismatch', matched: [...matched],
          found: [...found],
          note: `불일치 → 패턴을 한 칸 오른쪽으로 이동`,
        })
        break
      }
    }
    if (j === m) {
      found.push(s)
      frames.push({
        text, pattern, s, i: s + m - 1, j: m - 1, status: 'match', matched: [...matched],
        found: [...found],
        note: `패턴 발견! 시작 위치 ${s}`,
      })
    }
  }

  frames.push({
    text, pattern, s: Math.max(0, n - m), i: -1, j: -1, status: 'none', matched: [],
    found: [...found],
    note: found.length
      ? `검색 완료: 발견 위치 [${found.join(', ')}]`
      : `검색 완료: 패턴을 찾지 못했습니다.`,
  })
  return frames
}

// KMP 의 LPS(접두사=접미사 길이) 테이블 계산
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

// KMP 문자열 검색 프레임 생성
function kmpFrames(text, pattern) {
  const n = text.length
  const m = pattern.length
  const lps = buildLps(pattern)
  const frames = []
  const found = []

  frames.push({
    text, pattern, lps, s: 0, i: 0, j: 0, status: 'none', matched: [], lpsUsed: -1,
    found: [...found],
    note: `KMP 시작: skip table(lps) = [${lps.join(', ')}] 를 미리 계산했습니다.`,
  })

  let i = 0
  let j = 0
  while (i < n) {
    const s = i - j // 현재 패턴 정렬 위치
    const matched = []
    for (let k = 0; k < j; k++) matched.push(k)

    // 비교 직전 프레임
    frames.push({
      text, pattern, lps, s, i, j, status: 'none', matched: [...matched], lpsUsed: -1,
      found: [...found],
      note: `text[${i}]='${text[i]}' 와 pattern[${j}]='${pattern[j]}' 비교`,
    })

    if (text[i] === pattern[j]) {
      matched.push(j)
      frames.push({
        text, pattern, lps, s, i, j, status: 'match', matched: [...matched], lpsUsed: -1,
        found: [...found],
        note: `일치: i, j 모두 한 칸 전진`,
      })
      i++
      j++
      if (j === m) {
        const start = i - m
        found.push(start)
        const prevJ = j
        j = lps[j - 1]
        frames.push({
          text, pattern, lps, s: start, i: i - 1, j: prevJ - 1, status: 'match',
          matched: Array.from({ length: m }, (_, k) => k), lpsUsed: prevJ - 1,
          found: [...found],
          note: `패턴 발견! 시작 위치 ${start} → j = lps[${prevJ - 1}] = ${j} 로 이동해 계속 탐색`,
        })
      }
    } else {
      frames.push({
        text, pattern, lps, s, i, j, status: 'mismatch', matched: [...matched], lpsUsed: -1,
        found: [...found],
        note: `불일치`,
      })
      if (j > 0) {
        const prevJ = j
        j = lps[j - 1]
        frames.push({
          text, pattern, lps, s: i - j, i, j, status: 'none', matched: [],
          lpsUsed: prevJ - 1,
          found: [...found],
          note: `건너뛰기: skip table[${prevJ - 1}] 사용, 패턴 j → lps 값 ${j} (i 는 그대로)`,
        })
      } else {
        i++
        frames.push({
          text, pattern, lps, s: i, i, j: 0, status: 'none', matched: [], lpsUsed: -1,
          found: [...found],
          note: `j=0 이므로 i 만 한 칸 전진`,
        })
      }
    }
  }

  frames.push({
    text, pattern, lps, s: Math.max(0, n - m), i: -1, j: -1, status: 'none',
    matched: [], lpsUsed: -1,
    found: [...found],
    note: found.length
      ? `검색 완료: 발견 위치 [${found.join(', ')}]`
      : `검색 완료: 패턴을 찾지 못했습니다.`,
  })
  return frames
}

const ALGOS = {
  brute: { label: '브루트 포스', fn: bruteFrames },
  kmp: { label: 'KMP', fn: kmpFrames },
}

const DEFAULT_TEXT = 'ABABDABACDABABCABAB'
const DEFAULT_PATTERN = 'ABABCABAB'

export default function StringSearchVisualizer({ algo: presetAlgo, lock = false }) {
  const initialAlgo = presetAlgo && ALGOS[presetAlgo] ? presetAlgo : 'brute'
  const [text, setText] = useState(DEFAULT_TEXT)
  const [pattern, setPattern] = useState(DEFAULT_PATTERN)
  const [algo, setAlgo] = useState(initialAlgo)
  const [applied, setApplied] = useState({ algo: initialAlgo, text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN })
  const [error, setError] = useState('')

  const frames = useMemo(
    () => ALGOS[applied.algo].fn(applied.text, applied.pattern),
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
    setApplied({ algo, text: t, pattern: p })
  }
  const reset = () => {
    setText(DEFAULT_TEXT)
    setPattern(DEFAULT_PATTERN)
    setAlgo(initialAlgo)
    setError('')
    setApplied({ algo: initialAlgo, text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN })
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
      <div className="viz-title">
        <span className="viz-tag">시각화</span> {lock ? `${ALGOS[applied.algo].label} 단계 실행기` : '문자열 검색 단계 실행기'}
      </div>

      <div className="viz-controls">
        <label>텍스트</label>
        <input className="viz-input mono" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="예: ABABDABACDABABCABAB" />
        <label>패턴</label>
        <input className="viz-input mono" value={pattern} onChange={(e) => setPattern(e.target.value)}
          placeholder="예: ABABCABAB" />
        {!lock && (
          <>
            <label>알고리즘</label>
            <select className="viz-select" value={algo} onChange={(e) => setAlgo(e.target.value)}>
              {Object.entries(ALGOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </>
        )}
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
                  fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" fill={onColor(fill)}>{ch}</text>
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
                  fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" fill={onColor(fill)}>{ch}</text>
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

      {/* KMP skip table (lps) */}
      {frame.lps && (
        <div className="viz-stage" style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '4px' }}>
            skip table (lps[]) — 접두사이면서 접미사인 최대 길이
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {frame.lps.map((v, k) => (
              <div key={k} style={{
                minWidth: '34px', textAlign: 'center', padding: '4px 6px', borderRadius: '6px',
                border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px',
                background: frame.lpsUsed === k ? 'var(--viz-compare)' : 'var(--bg)',
                color: frame.lpsUsed === k ? '#000' : 'var(--text)',
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{frame.pattern[k]}<sub>{k}</sub></div>
                <div style={{ fontWeight: 700 }}>{v}</div>
              </div>
            ))}
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
