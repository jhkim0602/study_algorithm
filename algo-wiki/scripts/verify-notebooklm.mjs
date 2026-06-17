// 생성된 챕터별 .md가 원본 데이터의 정답/문제와 일치하는지 전수 검증
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chapters } from '../src/data/index.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OPT_NUM = ['①', '②', '③', '④', '⑤', '⑥']
const fname = (c) => `${c.id.toUpperCase()}_${c.title.replace(/^Ch\d+\s*/, '').replace(/\s+/g, '')}.md`

let problems = 0, errors = 0
const fail = (msg) => { console.log('  ✗', msg); errors++ }

for (const c of chapters) {
  const md = readFileSync(join(ROOT, 'notebooklm', fname(c)), 'utf8')
  // 문제 블록 분할
  const blocks = {}
  const re = /^### Q(\d+) ·[\s\S]*?(?=^### Q\d+ ·|\Z)/gm
  let m
  const parts = md.split(/^(?=### Q\d+ ·)/m)
  for (const part of parts) {
    const h = part.match(/^### Q(\d+) ·/)
    if (h) blocks[h[1]] = part
  }
  for (const p of c.problems) {
    problems++
    const b = blocks[p.no]
    if (!b) { fail(`${c.id} Q${p.no}: 블록 없음`); continue }
    // 정답 라인
    if (p.type === 'ox') {
      if (!new RegExp(`\\*\\*정답: ${p.answer}\\*\\*`).test(b)) fail(`${c.id} Q${p.no}: 정답 라인 불일치(기대 ${p.answer})`)
      // O/X 정답 표시
      const okMark = new RegExp(`\\*\\*${p.answer} ✅\\*\\*`).test(b)
      if (!okMark) fail(`${c.id} Q${p.no}: O/X 정답표시 누락`)
    } else {
      const num = OPT_NUM[p.answer - 1]
      if (!new RegExp(`\\*\\*정답: ${num} `).test(b)) fail(`${c.id} Q${p.no}: 정답 라인 불일치(기대 ${num})`)
      // 정답 보기에 ✅
      const lines = b.split('\n').filter((l) => /^- /.test(l))
      const correctLine = lines.find((l) => l.startsWith(`- ${num} `))
      if (!correctLine) fail(`${c.id} Q${p.no}: 정답 보기(${num}) 라인 없음`)
      else if (!correctLine.includes('✅')) fail(`${c.id} Q${p.no}: 정답 보기에 ✅ 없음`)
      // 오답 보기에 ✅ 없어야
      const wrongChecked = lines.filter((l) => !l.startsWith(`- ${num} `) && l.includes('✅'))
      if (wrongChecked.length) fail(`${c.id} Q${p.no}: 오답 보기에 ✅ 표시됨`)
    }
    // 보기 분석/근거 존재
    if (p.detail?.reasoning?.length && !b.includes('왜 이게 답인가')) fail(`${c.id} Q${p.no}: 근거 섹션 누락`)
  }
}

console.log(`\n검증: 문제 ${problems}개 / 오류 ${errors}개`)
process.exit(errors ? 1 : 0)
