import { useEffect, useRef, useState } from 'react'
import ProblemCard from './ProblemCard.jsx'

// 카드형 풀이: 한 문제씩 한 화면에 보여주고 ◀ ▶ 로 넘긴다.
// 보기 클릭 시 즉시 채점, '정답·해설 보기'로 풀이 확인 — 동작은 ProblemCard 재사용.
export default function CardSolver({ list, resetKey, isRevealed, toggle, getAnswer, selectAnswer, resetAnswer }) {
  const [idx, setIdx] = useState(0)
  const topRef = useRef(null)

  // 필터가 바뀌면 처음으로
  useEffect(() => { setIdx(0) }, [resetKey])

  const len = list.length
  const safeIdx = Math.min(idx, Math.max(0, len - 1))

  const go = (delta) => setIdx((i) => Math.min(Math.max(i + delta, 0), len - 1))

  // ← → 방향키로 이동 (입력 요소에 포커스가 있으면 무시)
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [len])

  // 문제 넘길 때 카드 상단으로 스크롤
  useEffect(() => { topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [safeIdx])

  if (len === 0) return null

  const p = list[safeIdx]
  const answeredCount = list.filter((q) => getAnswer(q.chapterId, q.no) != null).length
  const cur = safeIdx + 1
  const isLast = safeIdx === len - 1

  return (
    <div className="card-solver" ref={topRef}>
      <div className="cs-progress">
        <div className="cs-progress-bar"><span style={{ width: `${(cur / len) * 100}%` }} /></div>
        <div className="cs-progress-text">{cur} / {len}문항 · 푼 문제 {answeredCount}</div>
      </div>

      <ProblemCard
        key={`${p.chapterId}-${p.no}`}
        chapterId={p.chapterId}
        problem={p}
        chapterLabel={(p.chapterTitle || '').replace(/^(Ch\d+).*/, '$1')}
        revealed={isRevealed(p.chapterId, p.no)}
        onToggle={(no) => toggle(p.chapterId, no)}
        selected={getAnswer(p.chapterId, p.no)}
        onSelect={(no, v) => selectAnswer(p.chapterId, no, v)}
        onReset={(no) => resetAnswer(p.chapterId, no)}
      />

      <div className="cs-nav">
        <button className="btn" onClick={() => go(-1)} disabled={safeIdx === 0}>◀ 이전</button>
        <span className="cs-nav-mid">{cur} / {len}</span>
        <button className="btn primary" onClick={() => go(1)} disabled={isLast}>
          {isLast ? '마지막 문제' : '다음 ▶'}
        </button>
      </div>
      <p className="cs-hint">방향키 ← → 로도 넘길 수 있어요. 보기를 클릭하면 바로 채점됩니다.</p>
    </div>
  )
}
