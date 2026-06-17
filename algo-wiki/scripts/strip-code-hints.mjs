// 코드 문제 프롬프트에서 알고리즘을 알려주는 괄호 힌트 제거
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chapters } from '../src/data/index.js'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'ch06-sorting.js')
let text = readFileSync(SRC, 'utf8')

const codeProblems = chapters.flatMap((c) => c.problems).filter((p) => p.type === 'code')
let changed = 0
for (const p of codeProblems) {
  const oldP = p.prompt
  const newP = oldP
    .replace(/\s*\([^)]*\)\s*$/, '') // 끝의 (알고리즘 …) 괄호 제거
    .replace(/오름차순 (?:버블|선택|삽입|쉘|퀵|병합|힙|도수) 정렬이 되기 위해/, '오름차순 정렬이 되기 위해')
    .trim()
  if (newP === oldP) continue
  const needle = `'${oldP}'`
  const count = text.split(needle).length - 1
  if (count !== 1) { console.error(`✗ Q${p.no}: 정확히 1회 매칭 실패(count=${count})`); process.exit(1) }
  text = text.replace(needle, `'${newP}'`)
  changed++
  console.log(`Q${p.no}: ${JSON.stringify(oldP)} → ${JSON.stringify(newP)}`)
}

writeFileSync(SRC, text, 'utf8')
console.log(`\n수정 완료: ${changed}개 프롬프트`)
