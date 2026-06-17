import { useMemo, useState } from 'react'
import { chapters, allProblems, allConcepts, TYPE_LABEL } from '../data/index.js'
import { problemStatus } from '../utils/progress.js'
import ProblemCard from './ProblemCard.jsx'
import CardSolver from './CardSolver.jsx'

const TYPES = ['choice', 'code', 'ox']
const STATUSES = [
  { key: 'all', label: '전체' },
  { key: 'unanswered', label: '안 푼 것' },
  { key: 'correct', label: '맞은 것' },
  { key: 'wrong', label: '틀린 것' },
]

// 결정적이지 않아도 되는 UI용 셔플 (Fisher–Yates)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useToggleSet(initial = []) {
  const [set, setSet] = useState(() => new Set(initial))
  const toggle = (v) =>
    setSet((prev) => {
      const next = new Set(prev)
      next.has(v) ? next.delete(v) : next.add(v)
      return next
    })
  const clear = () => setSet(new Set())
  return [set, toggle, clear, setSet]
}

export default function Practice({ answers, clearAnswers, markWrong, isRevealed, toggle, setManyRevealed, getAnswer, selectAnswer, resetAnswer }) {
  const [chapSel, toggleChap] = useToggleSet(chapters.map((c) => c.id)) // 기본: 전체 챕터
  const [typeSel, toggleType] = useToggleSet(TYPES) // 기본: 전체 유형
  const [conceptSel, toggleConcept, clearConcepts] = useToggleSet([]) // 기본: 전체 개념
  const [statusSel, setStatusSel] = useState('all') // 풀이상태 필터(복습용)
  const [shuffled, setShuffled] = useState(false)
  const [reshuffleKey, setReshuffleKey] = useState(0)
  const [showConcepts, setShowConcepts] = useState(false)
  const [mode, setMode] = useState('list') // 'list' | 'card'
  const [filtersOpen, setFiltersOpen] = useState(true) // 필터 설정 펼침 여부

  // 모드 전환 시 카드 모드면 설정을 접어 문제에 집중
  const switchMode = (m) => { setMode(m); setFiltersOpen(m === 'list') }
  // 틀린 답이면 오답노트에 추가
  const onPick = (p) => (no, v) => { selectAnswer(p.chapterId, no, v); if (v !== p.answer) markWrong?.(`${p.chapterId}-${p.no}`) }

  // 1) 대단원·유형·개념 필터 + (선택)셔플 — answers와 무관하게 순서를 고정.
  //    answers를 의존성에 넣으면 답을 고를 때마다 다시 섞여 카드가 바뀌므로 분리한다.
  const ordered = useMemo(() => {
    const list = allProblems.filter(
      (p) =>
        chapSel.has(p.chapterId) &&
        typeSel.has(p.type) &&
        (conceptSel.size === 0 || (p.concepts || []).some((c) => conceptSel.has(c))),
    )
    return shuffled ? shuffle(list) : list
    // reshuffleKey를 의존성에 포함해 "다시 섞기"가 동작하게 한다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapSel, typeSel, conceptSel, shuffled, reshuffleKey])

  // 2) 복습 상태 필터(answers 의존) — 순서는 그대로 유지
  const filtered = useMemo(() => {
    if (statusSel === 'all') return ordered
    return ordered.filter((p) => problemStatus(p, answers[`${p.chapterId}-${p.no}`]) === statusSel)
  }, [ordered, statusSel, answers])

  const allRevealed = filtered.length > 0 && filtered.every((p) => isRevealed(p.chapterId, p.no))
  const pairs = filtered.map((p) => ({ chapterId: p.chapterId, no: p.no }))
  // 카드 모드에서 필터가 바뀌면 첫 문제로 되돌리기 위한 키
  const resetKey = [[...chapSel].sort().join(','), [...typeSel].sort().join(','), [...conceptSel].sort().join(','), statusSel, shuffled, reshuffleKey].join('|')

  return (
    <div className="content">
      <h1 className="page-title">통합 문제</h1>
      <p className="page-subtitle">
        대단원·개념·유형으로 자유롭게 묶고, 순서를 섞어 풀 수 있는 통합 연습 모드입니다. 모든 챕터의 160문제를 한곳에서 다룹니다.
      </p>

      <div className="filter-panel">
        <div className="filter-row">
          <span className="filter-label">보기</span>
          <div className="chip-group">
            <button className={`fchip${mode === 'list' ? ' on' : ''}`} onClick={() => switchMode('list')}>📋 리스트</button>
            <button className={`fchip${mode === 'card' ? ' on' : ''}`} onClick={() => switchMode('card')}>🃏 카드 풀기</button>
          </div>
          <button className="fchip ghost" style={{ marginLeft: 'auto' }} onClick={() => setFiltersOpen((o) => !o)}>
            {filtersOpen ? '설정 접기 ▲' : '설정 펼치기 ▼'}
          </button>
        </div>

        {filtersOpen && (<>
        <div className="filter-row">
          <span className="filter-label">대단원</span>
          <div className="chip-group">
            {chapters.map((c) => (
              <button
                key={c.id}
                className={`fchip${chapSel.has(c.id) ? ' on' : ''}`}
                onClick={() => toggleChap(c.id)}
              >
                {c.title.replace(/\s*·.*/, '').replace(/^(Ch\d+)\s*/, '$1 ')}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">유형</span>
          <div className="chip-group">
            {TYPES.map((t) => (
              <button key={t} className={`fchip${typeSel.has(t) ? ' on' : ''}`} onClick={() => toggleType(t)}>
                {TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">순서</span>
          <div className="chip-group">
            <button className={`fchip${!shuffled ? ' on' : ''}`} onClick={() => setShuffled(false)}>원래 순서</button>
            <button className={`fchip${shuffled ? ' on' : ''}`} onClick={() => setShuffled(true)}>무작위 섞기</button>
            {shuffled && (
              <button className="fchip ghost" onClick={() => setReshuffleKey((k) => k + 1)}>↻ 다시 섞기</button>
            )}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">복습</span>
          <div className="chip-group">
            {STATUSES.map((s) => (
              <button key={s.key} className={`fchip${statusSel === s.key ? ' on' : ''}`} onClick={() => setStatusSel(s.key)}>{s.label}</button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">개념</span>
          <div className="chip-group">
            <button className="fchip ghost" onClick={() => setShowConcepts((v) => !v)}>
              {conceptSel.size > 0 ? `${conceptSel.size}개 선택됨` : '개념별 선택'} {showConcepts ? '▲' : '▼'}
            </button>
            {conceptSel.size > 0 && (
              <button className="fchip ghost" onClick={clearConcepts}>개념 해제</button>
            )}
          </div>
        </div>
        {showConcepts && (
          <div className="concept-cloud">
            {allConcepts.map((c) => (
              <button key={c} className={`fchip sm${conceptSel.has(c) ? ' on' : ''}`} onClick={() => toggleConcept(c)}>
                {c}
              </button>
            ))}
          </div>
        )}
        </>)}
      </div>

      <div className="problem-section-head">
        <h2 style={{ margin: 0, border: 'none', padding: 0 }}>결과 {filtered.length}문항</h2>
        <span className="spacer" />
        <button className="btn" onClick={clearAnswers}>전체 풀이 상태 초기화</button>
        {mode === 'list' && (
          <button className="btn" onClick={() => setManyRevealed(pairs, !allRevealed)} disabled={filtered.length === 0}>
            {allRevealed ? '전체 정답 접기' : '전체 정답 펼치기'}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-soft)', marginTop: '20px' }}>조건에 맞는 문제가 없습니다. 필터를 조정해 보세요.</p>
      ) : mode === 'card' ? (
        <CardSolver
          list={filtered}
          resetKey={resetKey}
          isRevealed={isRevealed}
          toggle={toggle}
          getAnswer={getAnswer}
          selectAnswer={selectAnswer}
          resetAnswer={resetAnswer}
          markWrong={markWrong}
        />
      ) : (
        filtered.map((p) => (
          <ProblemCard
            key={`${p.chapterId}-${p.no}`}
            chapterId={p.chapterId}
            problem={p}
            chapterLabel={p.chapterTitle.replace(/^(Ch\d+).*/, '$1')}
            revealed={isRevealed(p.chapterId, p.no)}
            onToggle={(no) => toggle(p.chapterId, no)}
            selected={getAnswer(p.chapterId, p.no)}
            onSelect={onPick(p)}
            onReset={(no) => resetAnswer(p.chapterId, no)}
          />
        ))
      )}
    </div>
  )
}
