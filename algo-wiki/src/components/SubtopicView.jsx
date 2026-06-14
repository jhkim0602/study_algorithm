import { Blocks } from './ConceptSection.jsx'
import ProblemCard from './ProblemCard.jsx'

// 세부 학습 주제 페이지: 심화 개념(blocks) + 시각화 + 관련 문제(풀이 모드)
export default function SubtopicView({ chapter, subtopic, navigate, isRevealed, toggle, getAnswer, selectAnswer, resetAnswer }) {
  const related = subtopic.problems || []
  const idx = chapter.subtopics.findIndex((s) => s.slug === subtopic.slug)
  const prev = idx > 0 ? chapter.subtopics[idx - 1] : null
  const next = idx < chapter.subtopics.length - 1 ? chapter.subtopics[idx + 1] : null

  return (
    <div className="content">
      <div className="sub-crumb">
        <button className="link-btn" onClick={() => navigate(chapter.slug)}>{chapter.title}</button>
        <span className="sep">›</span>
        <span>{subtopic.title}</span>
      </div>

      <h1 className="page-title">{subtopic.title}</h1>
      {subtopic.summary && <p className="page-subtitle">{subtopic.summary}</p>}

      <Blocks blocks={subtopic.blocks} />

      <h2 id="related">관련 문제 ({related.length})</h2>
      {related.length === 0 ? (
        <p style={{ color: 'var(--text-soft)' }}>이 주제에 직접 연결된 문제가 없습니다.</p>
      ) : (
        related.map((p) => (
          <ProblemCard
            key={p.no}
            chapterId={chapter.id}
            problem={p}
            revealed={isRevealed(chapter.id, p.no)}
            onToggle={(no) => toggle(chapter.id, no)}
            selected={getAnswer(chapter.id, p.no)}
            onSelect={(no, v) => selectAnswer(chapter.id, no, v)}
            onReset={(no) => resetAnswer(chapter.id, no)}
          />
        ))
      )}

      <nav className="sub-nav">
        {prev ? (
          <button className="sub-nav-btn" onClick={() => navigate(`${chapter.slug}/${prev.slug}`)}>← {prev.title}</button>
        ) : <span />}
        {next ? (
          <button className="sub-nav-btn next" onClick={() => navigate(`${chapter.slug}/${next.slug}`)}>{next.title} →</button>
        ) : <span />}
      </nav>
    </div>
  )
}
