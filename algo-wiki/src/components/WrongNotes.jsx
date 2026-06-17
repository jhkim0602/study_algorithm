import { useState } from 'react'
import { problemByKey } from '../data/index.js'
import ProblemCard from './ProblemCard.jsx'

const isStarred = (v) => !!(v && typeof v === 'object' && v.starred)
const wrongCount = (v) => (v && typeof v === 'object' ? v.count : v ? 1 : 0)

// 오답노트: 모의고사·연습에서 틀린 문제(영구 저장)를 모아 다시 풀기·해설.
// 다시 풀어 맞히면 빠지고, 또 틀리면 별표(★, 반복 오답) 표시.
export default function WrongNotes({ wrongSet, removeWrong, markWrong, navigate, isRevealed, toggle, getAnswer, selectAnswer, resetAnswer }) {
  // 마운트 시점 목록을 고정(맞혀도 즉시 사라지지 않게). 별표 먼저, 그다음 많이 틀린 순.
  const [list] = useState(() =>
    Object.keys(wrongSet)
      .map((k) => problemByKey[k])
      .filter(Boolean)
      .sort((a, b) => {
        const ka = `${a.chapterId}-${a.no}`, kb = `${b.chapterId}-${b.no}`
        const sa = isStarred(wrongSet[ka]) ? 1 : 0, sb = isStarred(wrongSet[kb]) ? 1 : 0
        return sb - sa || wrongCount(wrongSet[kb]) - wrongCount(wrongSet[ka])
      }),
  )

  const total = Object.keys(wrongSet).length
  const starredCount = Object.values(wrongSet).filter(isStarred).length

  return (
    <div className="content">
      <h1 className="page-title">오답노트</h1>
      <p className="page-subtitle">
        <b>모의고사·연습에서 틀린 문제</b>를 모았습니다(영구 저장). 다시 풀어 <b>맞히면</b> 다음에 들어올 때 목록에서 빠지고,
        <b> 또 틀리면 ★</b>(반복 오답)이 붙어 맨 위로 올라옵니다.
      </p>

      <div className="problem-section-head">
        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>
          틀린 문제 {total}개{starredCount > 0 && <span className="wn-star-count"> · ★ 반복 {starredCount}</span>}
        </h2>
      </div>

      {list.length === 0 ? (
        <p style={{ color: 'var(--text-soft)', marginTop: '20px' }}>
          오답노트가 비어 있습니다. <button className="link-btn" onClick={() => navigate('practice')}>통합 문제</button>나{' '}
          <button className="link-btn" onClick={() => navigate('exam')}>통합 모의고사</button>를 풀다 틀리면 여기에 모입니다.
        </p>
      ) : (
        list.map((p) => {
          const key = `${p.chapterId}-${p.no}`
          const starred = isStarred(wrongSet[key])
          return (
            <div key={key} className={`wn-item${starred ? ' starred' : ''}`}>
              {starred && <div className="wn-star">★ 반복 오답 — 또 틀렸어요. 다시 한번 확인!</div>}
              <ProblemCard
                chapterId={p.chapterId}
                problem={p}
                chapterLabel={p.chapterTitle.replace(/^(Ch\d+).*/, '$1')}
                revealed={isRevealed(p.chapterId, p.no)}
                onToggle={(no) => toggle(p.chapterId, no)}
                selected={getAnswer(p.chapterId, p.no)}
                onSelect={(no, v) => {
                  selectAnswer(p.chapterId, no, v)
                  if (v === p.answer) removeWrong(key)
                  else markWrong?.(key, { star: true }) // 다시 틀림 → 별표
                }}
                onReset={(no) => resetAnswer(p.chapterId, no)}
              />
            </div>
          )
        })
      )}
    </div>
  )
}
