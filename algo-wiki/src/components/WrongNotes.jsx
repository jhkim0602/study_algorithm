import { useMemo } from 'react'
import { wrongProblems } from '../utils/progress.js'
import ProblemCard from './ProblemCard.jsx'

// 오답노트: 틀린 문제만 모아 다시 풀기·해설 확인
export default function WrongNotes({ answers, navigate, isRevealed, toggle, getAnswer, selectAnswer, resetAnswer }) {
  const wrong = useMemo(() => wrongProblems(answers), [answers])

  return (
    <div className="content">
      <h1 className="page-title">오답노트</h1>
      <p className="page-subtitle">지금까지 풀면서 틀린 문제만 모았습니다. 다시 풀어보고 해설로 확인하세요. (맞히면 목록에서 사라집니다.)</p>

      <div className="problem-section-head">
        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>틀린 문제 {wrong.length}개</h2>
      </div>

      {wrong.length === 0 ? (
        <p style={{ color: 'var(--text-soft)', marginTop: '20px' }}>
          틀린 문제가 없습니다. 문제를 풀면 틀린 것만 여기에 모입니다.{' '}
          <button className="link-btn" onClick={() => navigate('practice')}>통합 문제 풀러 가기</button>
        </p>
      ) : (
        wrong.map((p) => (
          <ProblemCard
            key={`${p.chapterId}-${p.no}`}
            chapterId={p.chapterId}
            problem={p}
            chapterLabel={p.chapterTitle.replace(/^(Ch\d+).*/, '$1')}
            revealed={isRevealed(p.chapterId, p.no)}
            onToggle={(no) => toggle(p.chapterId, no)}
            selected={getAnswer(p.chapterId, p.no)}
            onSelect={(no, v) => selectAnswer(p.chapterId, no, v)}
            onReset={(no) => resetAnswer(p.chapterId, no)}
          />
        ))
      )}
    </div>
  )
}
