import { chapters } from '../data/index.js'

export default function Sidebar({ open, route, navigate, onClose }) {
  const go = (to) => {
    navigate(to)
    onClose?.()
  }

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <button className="sidebar-brand" onClick={() => go('')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        자료구조 · 알고리즘 학습 위키
        <small>정렬 · 문자열 검색 · 리스트 · 트리</small>
      </button>

      <nav className="sidebar-nav">
        <button className={`sidebar-home${route === '' ? ' active' : ''}`} onClick={() => go('')}>
          개요 (Home)
        </button>
        <button className={`sidebar-home${route === 'practice' ? ' active' : ''}`} onClick={() => go('practice')}>
          통합 문제 (Practice)
        </button>
        <button className={`sidebar-home${route === 'exam' ? ' active' : ''}`} onClick={() => go('exam')}>
          통합 모의고사
        </button>
        <button className={`sidebar-home${route === 'wrong' ? ' active' : ''}`} onClick={() => go('wrong')}>
          오답노트
        </button>

        {chapters.map((c) => {
          const [chSlug, subSlug] = route.split('/')
          const active = chSlug === c.slug
          return (
            <div className="nav-group" key={c.id}>
              <button className={`nav-chapter${active && !subSlug ? ' active' : ''}`} onClick={() => go(c.slug)}>
                <span className="nav-id">{c.id.toUpperCase()}</span>
                <span>{c.title.replace(/^Ch\d+\s*/, '')}</span>
              </button>
              {active && (
                <div className="nav-sub">
                  <a href="#concept" onClick={(e) => { e.preventDefault(); jumpTo('concept'); onClose?.() }}>개요·개념</a>
                  {c.subtopics?.map((st) => (
                    <a
                      key={st.slug}
                      className={subSlug === st.slug ? 'subtopic on' : 'subtopic'}
                      href={`#/${c.slug}/${st.slug}`}
                      onClick={(e) => { e.preventDefault(); go(`${c.slug}/${st.slug}`) }}
                    >
                      {st.title}
                    </a>
                  ))}
                  <a href="#problems" onClick={(e) => { e.preventDefault(); go(c.slug); setTimeout(() => jumpTo('problems'), 60); onClose?.() }}>전체 문제 ({c.problems.length})</a>
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function jumpTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
