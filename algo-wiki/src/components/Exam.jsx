import { useMemo, useState } from 'react'
import { chapters, allProblems, TYPE_LABEL } from '../data/index.js'
import ProblemCard from './ProblemCard.jsx'

const TYPES = ['choice', 'code', 'ox']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useToggleSet(initial) {
  const [set, setSet] = useState(() => new Set(initial))
  const toggle = (v) => setSet((p) => { const n = new Set(p); n.has(v) ? n.delete(v) : n.add(v); return n })
  return [set, toggle]
}

// 통합 모의고사: 범위·문항수 선택 → 즉시 채점 없이 풀기 → 제출 시 점수·정답률·해설
export default function Exam({ getAnswer, selectAnswer, resetAnswer, examHistory, addExamResult }) {
  const [phase, setPhase] = useState('setup') // setup | taking | done
  const [chapSel, toggleChap] = useToggleSet(chapters.map((c) => c.id))
  const [typeSel, toggleType] = useToggleSet(TYPES)
  const [count, setCount] = useState(20)
  const [examSet, setExamSet] = useState([])
  const [result, setResult] = useState(null)

  const pool = useMemo(
    () => allProblems.filter((p) => chapSel.has(p.chapterId) && typeSel.has(p.type)),
    [chapSel, typeSel],
  )

  const start = () => {
    if (pool.length === 0) return
    const n = Math.min(count, pool.length)
    const picked = shuffle(pool).slice(0, n)
    picked.forEach((p) => resetAnswer(p.chapterId, p.no)) // 새 시도 — 이전 답 초기화
    setExamSet(picked)
    setResult(null)
    setPhase('taking')
    window.scrollTo({ top: 0 })
  }

  const answeredCount = examSet.filter((p) => getAnswer(p.chapterId, p.no) != null).length

  const submit = () => {
    const correct = examSet.filter((p) => getAnswer(p.chapterId, p.no) === p.answer).length
    const total = examSet.length
    const accuracy = total ? Math.round((correct / total) * 100) : 0
    const wrong = examSet.filter((p) => { const s = getAnswer(p.chapterId, p.no); return s == null || s !== p.answer })
    const scopeLabel = `${chapSel.size === chapters.length ? '전체' : [...chapSel].map((id) => id.toUpperCase()).join('·')} / ${total}문항`
    const res = { total, correct, accuracy, wrong }
    setResult(res)
    addExamResult({ at: new Date().toISOString(), scopeLabel, total, correct, accuracy })
    setPhase('done')
    window.scrollTo({ top: 0 })
  }

  const restart = () => { setPhase('setup'); setExamSet([]); setResult(null) }

  // ── 설정 ──
  if (phase === 'setup') {
    return (
      <div className="content">
        <h1 className="page-title">통합 모의고사</h1>
        <p className="page-subtitle">범위와 문항 수를 고르고 시작하세요. 푸는 동안에는 정답이 보이지 않고, 제출하면 점수·정답률·해설이 한 번에 나옵니다.</p>

        <div className="filter-panel">
          <div className="filter-row">
            <span className="filter-label">대단원</span>
            <div className="chip-group">
              {chapters.map((c) => (
                <button key={c.id} className={`fchip${chapSel.has(c.id) ? ' on' : ''}`} onClick={() => toggleChap(c.id)}>
                  {c.id.toUpperCase()} {c.title.replace(/^Ch\d+\s*/, '')}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">유형</span>
            <div className="chip-group">
              {TYPES.map((t) => (
                <button key={t} className={`fchip${typeSel.has(t) ? ' on' : ''}`} onClick={() => toggleType(t)}>{TYPE_LABEL[t]}</button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">문항 수</span>
            <div className="chip-group">
              {[10, 20, 40, pool.length].filter((v, i, a) => v > 0 && a.indexOf(v) === i).map((n) => (
                <button key={n} className={`fchip${count === n ? ' on' : ''}`} onClick={() => setCount(n)}>
                  {n >= pool.length ? `전체(${pool.length})` : `${n}문항`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="problem-section-head">
          <span style={{ color: 'var(--text-soft)', fontSize: '14px' }}>출제 가능: {pool.length}문항</span>
          <span className="spacer" />
          <button className="btn" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }} onClick={start} disabled={pool.length === 0}>
            모의고사 시작 ({Math.min(count, pool.length)}문항)
          </button>
        </div>

        {examHistory.length > 0 && (
          <>
            <h2>최근 기록</h2>
            <div className="exam-history">
              {examHistory.slice(-8).reverse().map((h, i) => (
                <div className="exam-hist-row" key={i}>
                  <span className="eh-date">{new Date(h.at).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="eh-scope">{h.scopeLabel}</span>
                  <span className="eh-score"><b>{h.correct}/{h.total}</b> ({h.accuracy}%)</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // ── 풀이/결과 ──
  const submitted = phase === 'done'
  return (
    <div className="content">
      {!submitted ? (
        <>
          <h1 className="page-title">모의고사 진행 중</h1>
          <p className="page-subtitle">모든 문항을 풀고 제출하세요. 제출 전에는 정답·해설이 보이지 않습니다.</p>
        </>
      ) : (
        <>
          <h1 className="page-title">채점 결과</h1>
          <div className="exam-result">
            <div className="er-score">{result.correct} <span>/ {result.total}</span></div>
            <div className="er-acc">정답률 {result.accuracy}%</div>
            {result.wrong.length > 0 && (
              <div className="er-wrong">틀린/미응답 {result.wrong.length}문항 — 아래 빨강 표시 + 해설 확인</div>
            )}
          </div>
        </>
      )}

      <div className="problem-section-head">
        <span style={{ color: 'var(--text-soft)', fontSize: '14px' }}>
          {submitted ? `${examSet.length}문항` : `응답 ${answeredCount} / ${examSet.length}`}
        </span>
        <span className="spacer" />
        {!submitted ? (
          <button className="btn" style={{ background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }} onClick={submit}>
            제출하고 채점
          </button>
        ) : (
          <button className="btn" onClick={restart}>새 모의고사</button>
        )}
      </div>

      {examSet.map((p, i) => (
        <ProblemCard
          key={`${p.chapterId}-${p.no}`}
          chapterId={p.chapterId}
          problem={p}
          chapterLabel={`${i + 1}번 · ${p.chapterTitle.replace(/^(Ch\d+).*/, '$1')}`}
          examMode
          examSubmitted={submitted}
          selected={getAnswer(p.chapterId, p.no)}
          onSelect={(no, v) => selectAnswer(p.chapterId, no, v)}
          onReset={(no) => resetAnswer(p.chapterId, no)}
        />
      ))}

      <div className="sub-nav">
        <span />
        {!submitted ? (
          <button className="sub-nav-btn next" onClick={submit}>제출하고 채점 →</button>
        ) : (
          <button className="sub-nav-btn next" onClick={restart}>새 모의고사 →</button>
        )}
      </div>
    </div>
  )
}
