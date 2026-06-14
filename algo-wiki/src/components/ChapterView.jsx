import ConceptSection from './ConceptSection.jsx'
import ProblemCard from './ProblemCard.jsx'

const GROUPS = [
  { key: 'choice', label: '보기선택형 (객관식)' },
  { key: 'code', label: '코드형 문제' },
  { key: 'ox', label: 'O/X 문제' },
]

export default function ChapterView({ chapter, navigate, isRevealed, toggle, setChapterRevealed, getAnswer, selectAnswer, resetAnswer }) {
  const problems = chapter.problems
  const allRevealed = problems.every((p) => isRevealed(chapter.id, p.no))
  const subtopics = chapter.subtopics || []

  return (
    <div className="content">
      <h1 className="page-title">{chapter.title}</h1>
      <p className="page-subtitle">{chapter.subtitle}</p>

      {subtopics.length > 0 && (
        <section>
          <h2 style={{ marginTop: '18px' }}>세부 학습 페이지</h2>
          <p className="page-subtitle" style={{ margin: '0 0 6px' }}>
            주제별로 깊이 있게 — 개념·코드·시각화·관련 문제를 한 페이지에서 학습하세요.
          </p>
          <div className="subtopic-grid">
            {subtopics.map((st) => (
              <button key={st.slug} className="subtopic-card" onClick={() => navigate(`${chapter.slug}/${st.slug}`)}>
                <div className="sc-title">{st.title}</div>
                <div className="sc-meta">문제 {st.problems?.length || 0}개</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <ConceptSection concept={chapter.concept} />

      <div className="problem-section-head">
        <h2 id="problems" style={{ margin: 0, border: 'none', padding: 0 }}>
          문제 ({problems.length}문항)
        </h2>
        <span className="spacer" />
        <button className="btn" onClick={() => setChapterRevealed(chapter, !allRevealed)}>
          {allRevealed ? '전체 정답 접기' : '전체 정답 펼치기'}
        </button>
      </div>

      {GROUPS.map(({ key, label }) => {
        const list = problems.filter((p) => p.type === key)
        if (list.length === 0) return null
        return (
          <section key={key}>
            <h3 style={{ marginTop: '28px' }}>{label}</h3>
            {list.map((p) => (
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
            ))}
          </section>
        )
      })}
    </div>
  )
}
