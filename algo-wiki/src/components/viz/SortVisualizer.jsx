import { useMemo, useState } from 'react'
import { SORTERS } from './sortFrames.js'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

function parseArray(text) {
  return text
    .split(/[,\s]+/)
    .map((s) => Number(s))
    .filter((x) => Number.isFinite(x))
    .slice(0, 12)
}

export default function SortVisualizer({ algo: presetAlgo, lock = false }) {
  const initialAlgo = presetAlgo && SORTERS[presetAlgo] ? presetAlgo : 'bubble'
  const [text, setText] = useState('5, 3, 8, 4, 2, 7, 1, 6')
  const [algo, setAlgo] = useState(initialAlgo)
  const [applied, setApplied] = useState({ algo: initialAlgo, arr: [5, 3, 8, 4, 2, 7, 1, 6] })

  const frames = useMemo(() => SORTERS[applied.algo].fn(applied.arr), [applied])
  const player = useStepPlayer(frames)
  const { frame } = player

  const run = () => {
    const arr = parseArray(text)
    if (arr.length >= 2) setApplied({ algo, arr })
  }
  const randomize = () => {
    const len = 8
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1)
    setText(arr.join(', '))
    setApplied({ algo, arr })
  }

  const maxV = Math.max(...frame.arr, 1)
  const W = Math.max(frame.arr.length * 54, 360)
  const H = 230
  const barW = 38
  const gap = (W - frame.arr.length * barW) / (frame.arr.length + 1)

  const colorOf = (i) => {
    if (frame.sorted?.includes(i)) return 'var(--viz-sorted)'
    if (frame.swapping?.includes(i)) return 'var(--viz-swap)'
    if (frame.pivot === i) return 'var(--viz-pivot)'
    if (frame.comparing?.includes(i)) return 'var(--viz-compare)'
    return 'var(--viz-bar)'
  }

  return (
    <div className="viz">
      <div className="viz-title">
        <span className="viz-tag">시각화</span> {lock ? `${SORTERS[applied.algo].label} 단계 실행기` : '정렬 알고리즘 단계 실행기'}
      </div>

      <div className="viz-controls">
        <label>배열</label>
        <input className="viz-input mono" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="예: 5, 3, 8, 4, 2" />
        {!lock && (
          <>
            <label>알고리즘</label>
            <select className="viz-select" value={algo} onChange={(e) => setAlgo(e.target.value)}>
              {Object.entries(SORTERS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </>
        )}
        <button className="viz-btn primary" onClick={run}>적용</button>
        <button className="viz-btn" onClick={randomize}>무작위</button>
      </div>

      <VizControls player={player} />

      <div className="viz-stage">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="xMidYMid meet">
          {frame.arr.map((v, i) => {
            const barH = 24 + (v / maxV) * (H - 70)
            const x = gap + i * (barW + gap)
            const y = H - 30 - barH
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={barH} rx="4" fill={colorOf(i)} />
                <text x={x + barW / 2} y={y - 7} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">{v}</text>
                <text x={x + barW / 2} y={H - 11} textAnchor="middle" fontSize="11" fill="var(--text-faint)">{i}</text>
              </g>
            )
          })}
        </svg>
      </div>

      {frame.countArr && (
        <div className="viz-stage" style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '4px' }}>도수 배열 count[]</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {frame.countArr.map((c, v) => (
              <div key={v} style={{
                minWidth: '34px', textAlign: 'center', padding: '4px 6px', borderRadius: '6px',
                border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px',
                background: frame.highlightCount === v ? 'var(--viz-compare)' : 'var(--bg)',
                color: frame.highlightCount === v ? '#000' : 'var(--text)',
              }}>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{v}</div>
                <div style={{ fontWeight: 700 }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="viz-note">{frame.note}</div>

      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-bar)' }} /> 기본</span>
        <span><i style={{ background: 'var(--viz-compare)' }} /> 비교</span>
        <span><i style={{ background: 'var(--viz-swap)' }} /> 교환/이동</span>
        <span><i style={{ background: 'var(--viz-pivot)' }} /> pivot/최솟값</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 정렬 완료</span>
      </div>
    </div>
  )
}
