import { chapters, totalProblems, TYPE_LABEL } from '../data/index.js'
import { computeStats } from '../utils/progress.js'

export default function Home({ navigate, answers = {} }) {
  const typeCounts = chapters
    .flatMap((c) => c.problems)
    .reduce((acc, p) => ((acc[p.type] = (acc[p.type] || 0) + 1), acc), {})
  const stats = computeStats(answers)

  return (
    <div className="content">
      <div className="home-hero">
        <h1 className="page-title">자료구조 · 알고리즘 학습 위키</h1>
        <p className="page-subtitle">
          정렬 · 문자열 검색 · 리스트 · 트리 — 개념을 정리하고, 전수 수록된 문제를 풀고,
          인터랙티브 시각화로 동작 원리를 직접 확인하세요.
        </p>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div className="num">{chapters.length}</div>
          <div className="lbl">챕터</div>
        </div>
        <div className="stat">
          <div className="num">{totalProblems}</div>
          <div className="lbl">전체 문제</div>
        </div>
        {Object.entries(typeCounts).map(([t, n]) => (
          <div className="stat" key={t}>
            <div className="num">{n}</div>
            <div className="lbl">{TYPE_LABEL[t]}</div>
          </div>
        ))}
      </div>

      {stats.solved > 0 && (
        <>
          <h2>내 진도</h2>
          <div className="progress-card">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.round((stats.solved / stats.total) * 100)}%` }} />
            </div>
            <div className="progress-meta">
              <span>푼 문제 <b>{stats.solved}</b> / {stats.total}</span>
              <span>정답 <b style={{ color: 'var(--ok)' }}>{stats.correct}</b> · 오답 <b style={{ color: 'var(--danger)' }}>{stats.wrong}</b></span>
              <span>정답률 <b>{stats.accuracy}%</b></span>
            </div>
            <div className="progress-actions">
              <button className="btn" onClick={() => navigate('practice')}>이어서 풀기</button>
              {stats.wrong > 0 && <button className="btn" onClick={() => navigate('wrong')}>오답노트 ({stats.wrong})</button>}
              <button className="btn" onClick={() => navigate('exam')}>모의고사</button>
            </div>
          </div>
        </>
      )}

      <h2>챕터</h2>
      <div className="home-grid">
        {chapters.map((c) => (
          <button className="home-card" key={c.id} onClick={() => navigate(c.slug)}>
            <div className="hc-id">{c.id.toUpperCase()}</div>
            <div className="hc-title">{c.title.replace(/^Ch\d+\s*/, '')}</div>
            <div className="hc-sub">{c.subtitle}</div>
            <div className="hc-meta">개념 + 문제 {c.problems.length}문항 + 시각화 →</div>
          </button>
        ))}
      </div>

      <h2>이용 안내</h2>
      <ul>
        <li>왼쪽 사이드바에서 챕터를 선택하면 <b>개념 정리 → 인터랙티브 시각화 → 문제</b> 순서로 볼 수 있습니다.</li>
        <li>각 문제의 <b>“정답·해설 보기”</b>를 누르면 정답과 해설, 풀이에 필요한 개념 태그가 펼쳐집니다.</li>
        <li>상단의 <b>전체 정답 펼치기/접기</b>로 챕터 전체를 한 번에 열고 닫을 수 있습니다.</li>
        <li>오른쪽 위 <b>테마</b> 버튼으로 라이트/다크를 전환하며, 설정과 펼침 상태는 브라우저에 저장됩니다.</li>
      </ul>
    </div>
  )
}
