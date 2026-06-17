// 워크플로우(영상 내레이션 + 개념 시각화) 입력 데이터 추출 → JSON(stdout)
import { chapters } from '../src/data/index.js'

const strip = (s) => String(s ?? '')
  .replace(/<code>([\s\S]*?)<\/code>/g, (_, x) => x.trim())
  .replace(/<\/?[a-z][^>]*>/gi, '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim()

const out = { chapters: [], groups: [] }

for (const c of chapters) {
  const groups = c.summary?.groups || []
  out.chapters.push({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle || '',
    summary: strip(c.concept?.summary),
    groupTitles: groups.map((g) => g.title),
  })
  for (const g of groups) {
    const tags = g.tags || []
    const examples = c.problems
      .filter((p) => (p.concepts || []).some((t) => tags.includes(t)))
      .slice(0, 3)
      .map((p) => ({
        no: p.no,
        prompt: strip(p.prompt),
        answer: p.type === 'ox' ? p.answer : strip((p.options || [])[p.answer - 1]),
      }))
    out.groups.push({
      chapterId: c.id,
      chapterTitle: c.title,
      title: g.title,
      gist: strip(g.gist),
      mnemonic: strip(g.mnemonic),
      svgCaption: strip(g.svgCaption),
      tags,
      examples,
    })
  }
}

process.stdout.write(JSON.stringify(out))
