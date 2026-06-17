// 워크플로우 산출물(enrich_raw.json)을 정제해 notebooklm/_enrichment.json 생성
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..', '..')
const raw = JSON.parse(readFileSync('/tmp/enrich_raw.json', 'utf8'))

const decode = (s) => String(s || '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, '&')

// 도구호출/XML 아티팩트: 첫 마커에서 잘라내고 잔여 태그 제거
function stripArtifacts(s) {
  s = String(s || '')
  s = s.split(/<\/?(?:narration|invoke|parameter|antml)[^>]*>/i)[0]
  s = s.replace(/<\/?(?:narration|invoke|parameter)[^>]*>/gi, '')
  s = s.replace(/<\/?antml:[a-z]+[^>]*>/gi, '')
  return s.trim()
}

function fixFences(s) {
  s = s.replace(/CODEFENCE_TEXT_START\s*/g, '```text\n').replace(/\s*CODEFENCE_END/g, '\n```')
  s = s.replace(/~~~+/g, '```') // 물결 펜스 → 백틱 펜스
  return s
}

function cleanNarration(s) {
  return stripArtifacts(decode(s)).replace(/```[\s\S]*$/, '').trim()
}

function cleanViz(s, key) {
  let v = fixFences(stripArtifacts(decode(s)))
  // viz는 코드펜스로 시작해야 함 — 앞쪽 설명/메타문장 제거
  const i = v.indexOf('```')
  if (i > 0) v = v.slice(i)
  // 펜스 개수 보정
  const n = (v.match(/```/g) || []).length
  if (n === 1) v = v.replace(/\s*$/, '') + '\n```'
  return v.trim()
}

// 깨진 viz(코드펜스 없음/너무 짧음) 수동 대체
const MANUAL = {
  'ch09::순회 (DFS/BFS)': '```text\n순회: 같은 트리라도 노드를 "언제" 방문 기록하느냐로 순서가 갈린다\n\n            (4)\n           /   \\\n         (2)   (6)\n        /  \\   /  \\\n      (1) (3)(5) (7)\n\n전위 Preorder   부모→왼→오 :  4 2 1 3 6 5 7\n중위 Inorder    왼→부모→오 :  1 2 3 4 5 6 7   ← BST면 오름차순!\n후위 Postorder  왼→오→부모 :  1 3 2 5 7 6 4\n레벨 BFS        위에서 줄별 :  4 2 6 1 3 5 7\n```',
}

const out = { chapterIntros: {}, groupViz: {} }
for (const [k, v] of Object.entries(raw.chapterIntros || {})) out.chapterIntros[k] = cleanNarration(v)

const warn = []
for (const [k, o] of Object.entries(raw.groupViz || {})) {
  const narration = cleanNarration(o.narration)
  let viz = cleanViz(o.viz, k)
  const fenceN = (viz.match(/```/g) || []).length
  if (MANUAL[k] || fenceN < 2 || viz.replace(/```/g, '').trim().length < 30) {
    if (MANUAL[k]) { viz = MANUAL[k]; warn.push(`${k}: 수동 대체`) }
    else warn.push(`${k}: viz 부실(fence=${fenceN}) — 점검 필요`)
  }
  out.groupViz[k] = { narration, viz }
}

writeFileSync(join(ROOT, 'notebooklm', '_enrichment.json'), JSON.stringify(out, null, 2), 'utf8')

// 최종 검증 리포트
console.log('정제 완료 → notebooklm/_enrichment.json')
console.log('  chapterIntros:', Object.keys(out.chapterIntros).length, '/ groupViz:', Object.keys(out.groupViz).length)
let bad = 0
for (const [k, o] of Object.entries(out.groupViz)) {
  const n = (o.viz.match(/```/g) || []).length
  const art = /<\/?(invoke|parameter|narration|antml)|CODEFENCE|~~~/i.test(o.viz + o.narration)
  if (n % 2 !== 0 || n < 2 || art) { console.log('  ⚠️', k, 'fence=', n, 'artifact=', art); bad++ }
}
for (const [k, v] of Object.entries(out.chapterIntros)) {
  if (/<\/?(invoke|parameter|narration|antml)/i.test(v)) { console.log('  ⚠️ intro', k, '아티팩트 잔여'); bad++ }
}
console.log('  경고:', warn.length ? warn.join(' | ') : '없음')
console.log('  최종 결함:', bad)
