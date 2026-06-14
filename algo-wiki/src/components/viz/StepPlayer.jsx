import { useEffect, useRef, useState } from 'react'

// 프레임 배열을 단계별로 재생하는 공용 훅.
export function useStepPlayer(frames) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)
  const timer = useRef(null)

  // 프레임이 새로 생성되면 처음으로 되돌림
  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [frames])

  useEffect(() => {
    if (!playing) return
    if (index >= frames.length - 1) {
      setPlaying(false)
      return
    }
    timer.current = setTimeout(() => setIndex((i) => Math.min(i + 1, frames.length - 1)), speed)
    return () => clearTimeout(timer.current)
  }, [playing, index, frames, speed])

  const total = frames.length
  const controls = {
    first: () => { setPlaying(false); setIndex(0) },
    prev: () => { setPlaying(false); setIndex((i) => Math.max(0, i - 1)) },
    next: () => { setPlaying(false); setIndex((i) => Math.min(total - 1, i + 1)) },
    last: () => { setPlaying(false); setIndex(total - 1) },
    toggle: () => setPlaying((p) => !p),
    setSpeed,
  }

  return { index, frame: frames[index] || frames[0], playing, speed, total, controls }
}

// 재생 컨트롤 바 (처음/이전/재생/다음/끝 + 속도 + 단계 정보)
export function VizControls({ player }) {
  const { index, total, playing, speed, controls } = player
  const atStart = index === 0
  const atEnd = index >= total - 1
  return (
    <div className="viz-controls">
      <button className="viz-btn" onClick={controls.first} disabled={atStart} title="처음으로">⏮</button>
      <button className="viz-btn" onClick={controls.prev} disabled={atStart} title="이전 단계">◀ 이전</button>
      <button className="viz-btn primary" onClick={controls.toggle} disabled={atEnd && !playing} title="재생/일시정지">
        {playing ? '⏸ 일시정지' : '▶ 재생'}
      </button>
      <button className="viz-btn" onClick={controls.next} disabled={atEnd} title="다음 단계">다음 ▶</button>
      <button className="viz-btn" onClick={controls.last} disabled={atEnd} title="마지막으로">⏭</button>
      <label style={{ marginLeft: '4px' }}>속도</label>
      <select className="viz-select" value={speed} onChange={(e) => controls.setSpeed(Number(e.target.value))}>
        <option value={1000}>느리게</option>
        <option value={600}>보통</option>
        <option value={300}>빠르게</option>
        <option value={120}>매우 빠르게</option>
      </select>
      <span className="viz-step-info">단계 {Math.min(index + 1, total)} / {total}</span>
    </div>
  )
}
