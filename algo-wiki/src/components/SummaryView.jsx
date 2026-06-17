import { chapters, TYPE_LABEL } from '../data/index.js'
import { Blocks } from './ConceptSection.jsx'
import CodeBlock from './CodeBlock.jsx'
import MiniTree from './MiniTree.jsx'

const OPT_NUM = ['①', '②', '③', '④']

function Illust({ svg, caption }) {
  if (!svg) return null
  return (
    <figure className="illust">
      <div className="illust-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      {caption && <figcaption className="illust-cap" dangerouslySetInnerHTML={{ __html: caption }} />}
    </figure>
  )
}

// 한 챕터의 요약노트, 또는 통합 요약노트(chapter 미지정)
export default function SummaryView({ chapter, navigate }) {
  if (!chapter) return <Integrated navigate={navigate} />

  const { cheatsheet = [], groups = [], tips = {} } = chapter.summary || {}
  const shown = new Set()
  const grouped = groups.map((g) => {
    const ps = chapter.problems.filter((p) => !shown.has(p.no) && (p.concepts || []).some((c) => (g.tags || []).includes(c)))
    ps.forEach((p) => shown.add(p.no))
    return { g, ps }
  })
  const leftover = chapter.problems.filter((p) => !shown.has(p.no))

  return (
    <div className="content">
      <div className="sub-crumb">
        <button className="link-btn" onClick={() => navigate('summary')}>통합 요약노트</button>
        <span className="sep">›</span>
        <span>{chapter.title}</span>
      </div>
      <h1 className="page-title">{chapter.title} 요약노트</h1>
      <p className="page-subtitle">시험 직전 빠른 정리 — 핵심 요약 · 암기법 · 문제별 풀이전략(문제은행 대비).</p>

      {cheatsheet.length > 0 && (
        <section>
          <h2>핵심 한눈에</h2>
          <Blocks blocks={cheatsheet} />
        </section>
      )}

      <h2>개념별 정리 + 문제 풀이전략</h2>
      {grouped.map(({ g, ps }) => (
        <section className="sum-group" key={g.title}>
          <h3>{g.title}</h3>
          <Illust svg={g.svg} caption={g.svgCaption} />
          {g.gist && <p className="sum-gist" dangerouslySetInnerHTML={{ __html: g.gist }} />}
          {g.mnemonic && <div className="sum-mnemonic"><b>암기</b> {g.mnemonic}</div>}
          {ps.map((p) => <TipCard key={p.no} problem={p} tip={tips[p.no]} />)}
        </section>
      ))}
      {leftover.length > 0 && (
        <section className="sum-group">
          <h3>그 외 문제</h3>
          {leftover.map((p) => <TipCard key={p.no} problem={p} tip={tips[p.no]} />)}
        </section>
      )}

      <ChapterNav chapter={chapter} navigate={navigate} />
    </div>
  )
}

function TipCard({ problem, tip }) {
  const { no, type, prompt, code, figure, tree, options, answer } = problem
  const isChoice = type === 'choice' || type === 'code'
  const answerLabel = isChoice ? `${OPT_NUM[answer - 1]} ${options[answer - 1]}` : answer
  return (
    <article className="tip-card">
      <div className="tip-head">
        <span className="problem-no">{no}</span>
        <span className={`badge ${type}`}>{TYPE_LABEL[type]}</span>
      </div>
      <p className="tip-prompt">{prompt}</p>
      {figure && <div className="problem-figure"><span className="fig-label">그림</span>{figure}</div>}
      {tree && <div className="problem-figure" style={{ borderStyle: 'solid' }}><MiniTree tree={tree} /></div>}
      {code && <CodeBlock code={code} lang="python" />}

      {tip ? (
        <div className="tip-body">
          {tip.focus && <p className="tip-focus">{tip.focus}</p>}
          {tip.steps?.length > 0 && (
            <ul className="tip-steps">
              {tip.steps.map((s, i) => (
                <li key={i}><span className="tip-label">{s.label}</span><span dangerouslySetInnerHTML={{ __html: s.text }} /></li>
              ))}
            </ul>
          )}
          <div className="tip-answer"><b>정답 {isChoice ? OPT_NUM[answer - 1] : answer}</b>{tip.answer ? ` — ${tip.answer}` : ` (${answerLabel})`}</div>
          {tip.mnemonic && <div className="sum-mnemonic"><b>암기</b> {tip.mnemonic}</div>}
        </div>
      ) : (
        <div className="tip-body"><div className="tip-answer"><b>정답: {answerLabel}</b></div></div>
      )}
    </article>
  )
}

function ChapterNav({ chapter, navigate }) {
  const idx = chapters.findIndex((c) => c.id === chapter.id)
  const prev = idx > 0 ? chapters[idx - 1] : null
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null
  return (
    <nav className="sub-nav">
      {prev ? <button className="sub-nav-btn" onClick={() => navigate(`summary/${prev.slug}`)}>← {prev.title} 요약</button> : <span />}
      {next ? <button className="sub-nav-btn next" onClick={() => navigate(`summary/${next.slug}`)}>{next.title} 요약 →</button> : <span />}
    </nav>
  )
}

// 통합 요약노트: 모든 챕터의 핵심 요약 + 개념 그림(문제 제외, 빠른 복습용)
function Integrated({ navigate }) {
  return (
    <div className="content">
      <h1 className="page-title">통합 요약노트</h1>
      <p className="page-subtitle">전 챕터 핵심을 한 흐름으로 — 시험 직전 빠른 복습용. 각 챕터의 문제별 풀이전략은 챕터 요약노트에서 볼 수 있습니다.</p>

      <div className="home-grid" style={{ marginTop: '14px' }}>
        {chapters.map((c) => (
          <button className="home-card" key={c.id} onClick={() => navigate(`summary/${c.slug}`)}>
            <div className="hc-id">{c.id.toUpperCase()} 요약노트</div>
            <div className="hc-title">{c.title.replace(/^Ch\d+\s*/, '')}</div>
            <div className="hc-meta">핵심 · 개념 그림 · 문제 풀이전략 →</div>
          </button>
        ))}
      </div>

      {chapters.map((c) => {
        const { cheatsheet = [], groups = [] } = c.summary || {}
        return (
          <section key={c.id}>
            <h2><button className="link-btn" style={{ fontSize: 'inherit', fontWeight: 'inherit' }} onClick={() => navigate(`summary/${c.slug}`)}>{c.title}</button></h2>
            {cheatsheet.length > 0 && <Blocks blocks={cheatsheet} />}
            {groups.map((g) => (
              <div className="sum-group-mini" key={g.title}>
                <h4>{g.title}</h4>
                <Illust svg={g.svg} caption={g.svgCaption} />
                {g.gist && <p className="sum-gist" dangerouslySetInnerHTML={{ __html: g.gist }} />}
                {g.mnemonic && <div className="sum-mnemonic"><b>암기</b> {g.mnemonic}</div>}
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
