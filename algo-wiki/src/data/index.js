import { ch06 } from './ch06-sorting.js'
import { ch07 } from './ch07-string-search.js'
import { ch08 } from './ch08-list.js'
import { ch09 } from './ch09-tree.js'

// 세분화 개념(WF2) · 상세 해설(WF1)을 합성 — 챕터 원본 데이터는 건드리지 않는다.
import { concept as c06 } from './concepts/ch06.js'
import { concept as c07 } from './concepts/ch07.js'
import { concept as c08 } from './concepts/ch08.js'
import { concept as c09 } from './concepts/ch09.js'
import { details as d06 } from './details/ch06.js'
import { details as d07 } from './details/ch07.js'
import { details as d08 } from './details/ch08.js'
import { details as d09 } from './details/ch09.js'
import { SUBTOPICS } from './subtopics/index.js'

function compose(chapter, richConcept, detailMap) {
  if (richConcept) chapter.concept = richConcept // 세분화 개념이 있으면 교체
  for (const p of chapter.problems) {
    if (detailMap && detailMap[p.no]) p.detail = detailMap[p.no]
  }
  return chapter
}

compose(ch06, c06, d06)
compose(ch07, c07, d07)
compose(ch08, c08, d08)
compose(ch09, c09, d09)

// 세부 학습 주제(subtopic) 부착 + 관련 문제 연결
for (const c of [ch06, ch07, ch08, ch09]) {
  c.subtopics = (SUBTOPICS[c.id] || []).map((st) => ({
    ...st,
    problems: c.problems.filter((p) => (p.concepts || []).some((tag) => (st.conceptTags || []).includes(tag))),
  }))
}

export function findSubtopic(chapterSlug, subSlug) {
  const c = chapterBySlug[chapterSlug]
  return c?.subtopics?.find((s) => s.slug === subSlug)
}

// 위키에 표시되는 챕터 순서
export const chapters = [ch06, ch07, ch08, ch09]

export const chapterBySlug = Object.fromEntries(chapters.map((c) => [c.slug, c]))

// 전체 문제 평탄화 (통합 문제용)
export const allProblems = chapters.flatMap((c) =>
  c.problems.map((p) => ({ ...p, chapterId: c.id, chapterTitle: c.title, chapterSlug: c.slug })),
)

// 키(chapterId-no) → 문제 (오답노트 조회용)
export const problemByKey = Object.fromEntries(allProblems.map((p) => [`${p.chapterId}-${p.no}`, p]))

// 전체 개념 태그 모음 (통합 문제 필터용)
export const allConcepts = [...new Set(allProblems.flatMap((p) => p.concepts || []))].sort((a, b) =>
  a.localeCompare(b, 'ko'),
)

// 전체 문제 수 (검증용)
export const totalProblems = chapters.reduce((sum, c) => sum + c.problems.length, 0)

// 문제 유형 한글 라벨
export const TYPE_LABEL = {
  choice: '객관식',
  ox: 'O/X',
  code: '코드',
}
