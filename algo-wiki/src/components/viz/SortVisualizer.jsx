import { useMemo, useState } from 'react'
import { SORTERS } from './sortFrames.js'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

function parseArray(text) {
  // 비음수 정수 0~99로 정제 (도수 정렬의 소수/음수/거대값 크래시 방지, 비교 정렬에도 안전)
  return text
    .split(/[,\s]+/)
    .map((s) => Number(s))
    .filter((x) => Number.isFinite(x))
    .map((x) => Math.min(99, Math.abs(Math.round(x))))
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

  const n = frame.arr.length
  const ids = frame.ids || frame.arr.map((_, i) => i) // 안전 가드
  const maxV = Math.max(...frame.arr.map((x) => Math.abs(x)), 1)
  const BAR_W = 34
  const GAP = 16
  const SLOT = BAR_W + GAP
  const BAR_AREA = 180

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
        <div className="sortviz-track" style={{ width: n * SLOT + 'px', height: BAR_AREA + 'px' }}>
          {ids
            .map((id, idx) => ({ id, idx, value: frame.arr[idx], lift: frame.swapping?.includes(idx), color: colorOf(idx) }))
            .sort((a, b) => a.id - b.id)
            .map((el) => {
              const h = 16 + (Math.abs(el.value) / maxV) * (BAR_AREA - 48)
              return (
                <div
                  key={el.id}
                  className={`sortviz-el${el.lift ? ' lift' : ''}`}
                  style={{ width: SLOT + 'px', transform: `translateX(${el.idx * SLOT}px) translateY(${el.lift ? -18 : 0}px)` }}
                >
                  <div className="sortviz-val">{el.value}</div>
                  <div className="sortviz-bar" style={{ height: h + 'px', background: el.color }} />
                </div>
              )
            })}
        </div>
        <div className="sortviz-axis" style={{ width: n * SLOT + 'px' }}>
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} className="sortviz-axis-cell" style={{ width: SLOT + 'px' }}>{i}</div>
          ))}
        </div>
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
