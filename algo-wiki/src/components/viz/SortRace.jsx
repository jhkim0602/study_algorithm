import { useEffect, useMemo, useRef, useState } from 'react'
import { SORTERS } from './sortFrames.js'

const RACERS = ['bubble', 'selection', 'insertion', 'shell', 'quick', 'merge', 'heap', 'counting']

function parseArray(text) {
  return text.split(/[,\s]+/).map(Number).filter((x) => Number.isFinite(x)).slice(0, 14)
}
function randomArr(n = 10) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 20) + 1)
}

// 여러 정렬 알고리즘을 같은 배열로 동시에 실행해 "연산 단계 수"로 경주시키는 시뮬레이션
export default function SortRace() {
  const [text, setText] = useState('7, 3, 9, 1, 6, 2, 8, 4, 5, 10')
  const [picked, setPicked] = useState(['bubble', 'insertion', 'quick', 'merge'])
  const [arr, setArr] = useState([7, 3, 9, 1, 6, 2, 8, 4, 5, 10])
  const [tick, setTick] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(220)
  const timer = useRef(null)

  const races = useMemo(
    () => picked.map((key) => ({ key, label: SORTERS[key].label, frames: SORTERS[key].fn(arr) })),
    [arr, picked],
  )
  const maxLen = Math.max(1, ...races.map((r) => r.frames.length))

  // 완료 순위 (단계 수 적은 순) — 동점은 동순위
  const ranking = useMemo(() => {
    const sorted = [...races].sort((a, b) => a.frames.length - b.frames.length)
    const rank = {}
    sorted.forEach((r, i) => { rank[r.key] = i + 1 })
    return rank
  }, [races])

  useEffect(() => { setTick(0); setPlaying(false) }, [arr, picked])
  useEffect(() => {
    if (!playing) return
    if (tick >= maxLen - 1) { setPlaying(false); return }
    timer.current = setTimeout(() => setTick((t) => Math.min(t + 1, maxLen - 1)), speed)
    return () => clearTimeout(timer.current)
  }, [playing, tick, maxLen, speed])

  const apply = () => { const a = parseArray(text); if (a.length >= 3) { setArr(a); setTick(0) } }
  const shuffle = () => { const a = randomArr(10); setText(a.join(', ')); setArr(a) }
  const togglePick = (k) =>
    setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : p.length < 5 ? [...p, k] : p))

  const finished = tick >= maxLen - 1

  return (
    <div className="viz">
      <div className="viz-title"><span className="viz-tag">시뮬레이션</span> 정렬 알고리즘 레이스</div>

      <div className="viz-controls">
        <label>배열</label>
        <input className="viz-input mono" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="viz-btn primary" onClick={apply}>적용</button>
        <button className="viz-btn" onClick={shuffle}>무작위</button>
      </div>
      <div className="viz-controls">
        <label>참가</label>
        {RACERS.map((k) => (
          <button key={k} className={`fchip sm${picked.includes(k) ? ' on' : ''}`} onClick={() => togglePick(k)}>
            {SORTERS[k].label}
          </button>
        ))}
      </div>
      <div className="viz-controls">
        <button className="viz-btn primary" onClick={() => (finished ? (setTick(0), setPlaying(true)) : setPlaying((p) => !p))}>
          {playing ? '⏸ 일시정지' : finished ? '↻ 다시 시작' : '▶ 출발!'}
        </button>
        <button className="viz-btn" onClick={() => { setPlaying(false); setTick(0) }}>리셋</button>
        <label>속도</label>
        <select className="viz-select" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value={400}>느리게</option>
          <option value={220}>보통</option>
          <option value={90}>빠르게</option>
        </select>
        <span className="viz-step-info">진행 {Math.min(tick + 1, maxLen)} / {maxLen}</span>
      </div>

      <div className="race-track">
        {races.map((r) => {
          const idx = Math.min(tick, r.frames.length - 1)
          const f = r.frames[idx]
          const done = tick >= r.frames.length - 1
          const maxV = Math.max(...f.arr, 1)
          const medal = ranking[r.key] === 1 ? '🥇' : ranking[r.key] === 2 ? '🥈' : ranking[r.key] === 3 ? '🥉' : ''
          return (
            <div key={r.key} className={`race-row${done ? ' done' : ''}`}>
              <div className="race-label">
                <b>{r.label}</b>
                <span className="race-meta">{r.frames.length - 1}단계{done ? ` · 완료 ${medal}` : ''}</span>
              </div>
              <div className="race-bars">
                {f.arr.map((v, i) => {
                  const color = done || f.sorted?.includes(i) ? 'var(--viz-sorted)'
                    : f.swapping?.includes(i) ? 'var(--viz-swap)'
                    : f.pivot === i ? 'var(--viz-pivot)'
                    : f.comparing?.includes(i) ? 'var(--viz-compare)'
                    : 'var(--viz-bar)'
                  return <div key={i} className="race-bar" style={{ height: `${10 + (v / maxV) * 46}px`, background: color }} title={v} />
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="viz-note">
        같은 배열을 여러 정렬이 동시에 처리합니다. 막대가 모두 초록이 되면 정렬 완료 — <b>연산(비교·교환) 단계가 적은 알고리즘이 먼저 도착</b>합니다.
        {finished && ' 🏁 레이스 종료! 메달과 단계 수를 비교해 보세요.'}
      </div>
      <div className="viz-legend">
        <span><i style={{ background: 'var(--viz-bar)' }} /> 대기</span>
        <span><i style={{ background: 'var(--viz-compare)' }} /> 비교</span>
        <span><i style={{ background: 'var(--viz-swap)' }} /> 교환</span>
        <span><i style={{ background: 'var(--viz-pivot)' }} /> pivot/최솟값</span>
        <span><i style={{ background: 'var(--viz-sorted)' }} /> 완료</span>
      </div>
    </div>
  )
}
