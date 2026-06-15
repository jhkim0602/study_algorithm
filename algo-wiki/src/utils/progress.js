import { allProblems, chapters } from '../data/index.js'

// 한 문제의 풀이 상태
export function problemStatus(problem, selected) {
  if (selected == null) return 'unanswered'
  return selected === problem.answer ? 'correct' : 'wrong'
}

// 전체/챕터별 진도·정답률 집계
export function computeStats(answers) {
  let solved = 0
  let correct = 0
  const perChapter = Object.fromEntries(chapters.map((c) => [c.id, { title: c.title, total: 0, solved: 0, correct: 0 }]))
  for (const p of allProblems) {
    const sel = answers[`${p.chapterId}-${p.no}`]
    const c = perChapter[p.chapterId]
    c.total++
    if (sel != null) {
      solved++
      c.solved++
      if (sel === p.answer) { correct++; c.correct++ }
    }
  }
  return {
    total: allProblems.length,
    solved,
    correct,
    wrong: solved - correct,
    accuracy: solved ? Math.round((correct / solved) * 100) : 0,
    perChapter,
  }
}

// 틀린 문제 목록 (오답노트)
export function wrongProblems(answers) {
  return allProblems.filter((p) => {
    const sel = answers[`${p.chapterId}-${p.no}`]
    return sel != null && sel !== p.answer
  })
}
