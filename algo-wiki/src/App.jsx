import { useCallback, useEffect, useState } from 'react'
import { chapterBySlug } from './data/index.js'
import { useHashRoute, useLocalStorage } from './hooks/useLocalStorage.js'
import Sidebar from './components/Sidebar.jsx'
import Home from './components/Home.jsx'
import ChapterView from './components/ChapterView.jsx'
import SubtopicView from './components/SubtopicView.jsx'
import SummaryView from './components/SummaryView.jsx'
import Practice from './components/Practice.jsx'
import Exam from './components/Exam.jsx'
import WrongNotes from './components/WrongNotes.jsx'

// 오답노트 항목 형태: { count, starred }. 구버전(true) 값도 안전하게 누적한다.
function bumpWrong(cur, star) {
  const count = (cur && typeof cur === 'object' ? cur.count : cur ? 1 : 0) + 1
  const starred = (cur && typeof cur === 'object' ? cur.starred : false) || !!star
  return { count, starred }
}

export default function App() {
  const [theme, setTheme] = useLocalStorage('algowiki.theme', 'light')
  // 개념·통합문제 풀이/펼침은 세션 한정(새로 들어오면 초기화) — 저장하지 않음
  const [revealed, setRevealed] = useState({})
  const [answers, setAnswers] = useState({})
  // 모의고사 기록 / 오답노트는 영구 저장(localStorage)
  const [examHistory, setExamHistory] = useLocalStorage('algowiki.examHistory', [])
  const [wrongSet, setWrongSet] = useLocalStorage('algowiki.wrongSet', {})
  const [route, navigate] = useHashRoute()
  const [navOpen, setNavOpen] = useState(false)

  // 테마를 <html data-theme>로 반영
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // 라우트 변경 시 상단으로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route])

  const isRevealed = useCallback((chapterId, no) => !!revealed[`${chapterId}-${no}`], [revealed])

  const toggle = useCallback((chapterId, no) => {
    setRevealed((prev) => {
      const key = `${chapterId}-${no}`
      const next = { ...prev }
      if (next[key]) delete next[key]
      else next[key] = true
      return next
    })
  }, [setRevealed])

  const setManyRevealed = useCallback((pairs, value) => {
    setRevealed((prev) => {
      const next = { ...prev }
      for (const { chapterId, no } of pairs) {
        const key = `${chapterId}-${no}`
        if (value) next[key] = true
        else delete next[key]
      }
      return next
    })
  }, [setRevealed])

  const setChapterRevealed = useCallback((chapter, value) => {
    setManyRevealed(chapter.problems.map((p) => ({ chapterId: chapter.id, no: p.no })), value)
  }, [setManyRevealed])

  // 풀이 모드: 보기 클릭 채점 (오답노트·점수 없이 선택만 저장)
  const getAnswer = useCallback((chapterId, no) => answers[`${chapterId}-${no}`], [answers])
  const selectAnswer = useCallback((chapterId, no, value) => {
    setAnswers((prev) => ({ ...prev, [`${chapterId}-${no}`]: value }))
  }, [setAnswers])
  const resetAnswer = useCallback((chapterId, no) => {
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[`${chapterId}-${no}`]
      return next
    })
  }, [setAnswers])

  const clearAnswers = useCallback(() => { setAnswers({}) }, [setAnswers])

  const addExamResult = useCallback((res) => {
    setExamHistory((prev) => [...prev, res].slice(-50))
  }, [setExamHistory])

  // 오답노트: 틀린 문제 누적 추가, 맞힌 문제 제거 (영구 저장)
  // star=true 면 별표(반복 오답) 표시. 연습·카드·모의고사·오답노트 모두 사용.
  const markWrong = useCallback((key, { star = false } = {}) => {
    setWrongSet((prev) => ({ ...prev, [key]: bumpWrong(prev[key], star) }))
  }, [setWrongSet])
  const updateWrong = useCallback((addKeys, removeKeys) => {
    setWrongSet((prev) => {
      const next = { ...prev }
      for (const k of addKeys) next[k] = bumpWrong(next[k], false)
      for (const k of removeKeys) delete next[k]
      return next
    })
  }, [setWrongSet])
  const removeWrong = useCallback((key) => {
    setWrongSet((prev) => { const next = { ...prev }; delete next[key]; return next })
  }, [setWrongSet])

  const isPractice = route === 'practice'
  const isExam = route === 'exam'
  const isWrong = route === 'wrong'
  const [chSlug, subSlug] = route.split('/')
  const isSummary = chSlug === 'summary'
  const summaryChapter = isSummary && subSlug ? chapterBySlug[subSlug] : null
  const chapter = isSummary ? null : chapterBySlug[chSlug]
  const subtopic = subSlug && chapter ? chapter.subtopics.find((s) => s.slug === subSlug) : null
  const crumb = isSummary ? (summaryChapter ? `요약노트 › ${summaryChapter.title}` : '통합 요약노트')
    : isPractice ? '통합 문제' : isExam ? '통합 모의고사' : isWrong ? '오답노트'
    : subtopic ? `${chapter.title} › ${subtopic.title}` : chapter ? chapter.title : '개요'

  return (
    <div className="app">
      <Sidebar open={navOpen} route={route} navigate={navigate} onClose={() => setNavOpen(false)} />
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="btn icon sidebar-toggle" onClick={() => setNavOpen((v) => !v)} aria-label="메뉴">☰</button>
          <span className="crumb">{crumb}</span>
          <span className="spacer" />
          <button
            className="btn icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="테마 전환"
            title="라이트/다크 전환"
          >
            {theme === 'dark' ? '☀️ 라이트' : '🌙 다크'}
          </button>
        </header>

        <main>
          {isSummary ? (
            <SummaryView key={subSlug || 'all'} chapter={summaryChapter} navigate={navigate} />
          ) : isExam ? (
            <Exam
              getAnswer={getAnswer} selectAnswer={selectAnswer} resetAnswer={resetAnswer}
              examHistory={examHistory} addExamResult={addExamResult} updateWrong={updateWrong}
            />
          ) : isWrong ? (
            <WrongNotes
              wrongSet={wrongSet} removeWrong={removeWrong} markWrong={markWrong} navigate={navigate}
              isRevealed={isRevealed} toggle={toggle}
              getAnswer={getAnswer} selectAnswer={selectAnswer} resetAnswer={resetAnswer}
            />
          ) : isPractice ? (
            <Practice
              answers={answers} clearAnswers={clearAnswers} markWrong={markWrong}
              isRevealed={isRevealed} toggle={toggle} setManyRevealed={setManyRevealed}
              getAnswer={getAnswer} selectAnswer={selectAnswer} resetAnswer={resetAnswer}
            />
          ) : subtopic ? (
            <SubtopicView
              key={`${chapter.id}-${subtopic.slug}`}
              chapter={chapter}
              subtopic={subtopic}
              navigate={navigate}
              isRevealed={isRevealed} toggle={toggle}
              getAnswer={getAnswer} selectAnswer={selectAnswer} resetAnswer={resetAnswer}
            />
          ) : chapter ? (
            <ChapterView
              key={chapter.id}
              chapter={chapter}
              navigate={navigate}
              isRevealed={isRevealed}
              toggle={toggle}
              setChapterRevealed={setChapterRevealed}
              getAnswer={getAnswer} selectAnswer={selectAnswer} resetAnswer={resetAnswer}
            />
          ) : (
            <Home navigate={navigate} wrongSet={wrongSet} examHistory={examHistory} />
          )}
        </main>
      </div>
    </div>
  )
}
