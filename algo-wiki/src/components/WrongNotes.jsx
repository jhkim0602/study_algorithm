import { useState } from 'react'
import { problemByKey } from '../data/index.js'
import ProblemCard from './ProblemCard.jsx'

// 오답노트: 모의고사에서 틀린 문제(영구 저장)를 모아 다시 풀기·해설
export default function WrongNotes({ wrongSet, removeWrong, navigate, isRevealed, toggle, getAnswer, selectAnswer, resetAnswer }) {
  // 마운트 시점의 목록을 고정 — 다시 풀어 맞혀도 화면에서 바로 사라지지 않고 피드백을 본 뒤, 다음 방문 때 빠짐
  const [list] = useState(() => Object.keys(wrongSet).map((k) => problemByKey[k]).filter(Boolean))

  return (
    <div className="content">
      <h1 className="page-title">오답노트</h1>
      <p className="page-subtitle">
        <b>모의고사에서 틀린 문제</b>만 모았습니다(영구 저장). 다시 풀어 맞히면 다음에 들어올 때 목록에서 빠집니다.
        개념·통합문제 풀이는 저장되지 않습니다.
      </p>

      <div className="problem-section-head">
        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>틀린 문제 {Object.keys(wrongSet).length}개</h2>
      </div>

      {list.length === 0 ? (
        <p style={{ color: 'var(--text-soft)', marginTop: '20px' }}>
          오답노트가 비어 있습니다. <button className="link-btn" onClick={() => navigate('exam')}>통합 모의고사</button>를 풀면 틀린 문제가 여기에 모입니다.
        </p>
      ) : (
        list.map((p) => {
          const key = `${p.chapterId}-${p.no}`
          return (
            <ProblemCard
              key={key}
              chapterId={p.chapterId}
              problem={p}
              chapterLabel={p.chapterTitle.replace(/^(Ch\d+).*/, '$1')}
              revealed={isRevealed(p.chapterId, p.no)}
              onToggle={(no) => toggle(p.chapterId, no)}
              selected={getAnswer(p.chapterId, p.no)}
              onSelect={(no, v) => { selectAnswer(p.chapterId, no, v); if (v === p.answer) removeWrong(key) }}
              onReset={(no) => resetAnswer(p.chapterId, no)}
            />
          )
        })
      )}
    </div>
  )
}
