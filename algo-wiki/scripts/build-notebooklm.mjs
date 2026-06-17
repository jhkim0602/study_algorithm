// NotebookLM 영상 제작용 학습노트 생성기
// 사이트의 모든 데이터(개념·160문제·detail 해설·요약 풀이전략·치트시트)를
// 깨끗한 마크다운으로 변환한다. 시각화 자동 생성:
//   - 코드 문제(ch06) → pyTrace 인터프리터로 실제 배열 추적표
//   - 트리 문제(ch09) → mermaid 다이어그램
//   - 복잡도/비교 → 마크다운 표
// enrichment(_enrichment.json)가 있으면 챕터 영상 인트로 + 개념그룹 시각화를 병합한다.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chapters, TYPE_LABEL } from '../src/data/index.js'
import { pyTrace } from '../src/pytrace/pyTrace.js'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..', '..') // Desktop/알고리즘
const OUT_DIR = join(ROOT, 'notebooklm')
mkdirSync(OUT_DIR, { recursive: true })

const OPT_NUM = ['①', '②', '③', '④', '⑤', '⑥']

// ── enrichment(선택) — 빌드 캐시는 scripts/ 에 두어 산출물 폴더를 깨끗이 유지 ──
let ENRICH = { chapterIntros: {}, groupViz: {} }
const enrichPath = join(__dir, 'notebooklm-enrichment.json')
if (existsSync(enrichPath)) {
  try {
    ENRICH = JSON.parse(readFileSync(enrichPath, 'utf8'))
    ENRICH.chapterIntros ||= {}
    ENRICH.groupViz ||= {}
    console.log('enrichment 병합: chapterIntros', Object.keys(ENRICH.chapterIntros).length, '/ groupViz', Object.keys(ENRICH.groupViz).length)
  } catch (e) { console.warn('enrichment 파싱 실패, 무시:', e.message) }
}

// ── HTML 조각 → 마크다운 ──
function htmlToMd(s) {
  if (s == null) return ''
  return String(s)
    .replace(/<code>([\s\S]*?)<\/code>/g, (_, x) => '`' + x.replace(/`/g, '').trim() + '`')
    .replace(/<\/?(?:b|strong)>/g, '**')
    .replace(/<\/?(?:i|em)>/g, '*')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\*\*\s*\*\*/g, '')
    .trim()
}

// ── 개념 블록 배열 → 마크다운 ──
function renderBlocks(blocks, base = 3) {
  const out = []
  for (const b of blocks || []) {
    switch (b.type) {
      case 'h3': out.push(`\n${'#'.repeat(base)} ${htmlToMd(b.text)}\n`); break
      case 'h4': out.push(`\n${'#'.repeat(base + 1)} ${htmlToMd(b.text)}\n`); break
      case 'p': out.push(htmlToMd(b.html) + '\n'); break
      case 'list':
        out.push(b.items.map((it) => `- ${htmlToMd(it)}`).join('\n') + '\n'); break
      case 'table': {
        const head = `| ${b.headers.map(htmlToMd).join(' | ')} |`
        const sep = `| ${b.headers.map(() => '---').join(' | ')} |`
        const rows = b.rows.map((r) => `| ${r.map(htmlToMd).join(' | ')} |`)
        out.push([head, sep, ...rows].join('\n') + '\n'); break
      }
      case 'callout':
        out.push(`> **${b.tone === 'warn' ? '주의' : 'TIP'}** ${htmlToMd(b.html)}\n`); break
      case 'svg':
        if (b.caption) out.push(`*그림: ${htmlToMd(b.caption)}*\n`); break
      case 'code':
        out.push((b.caption ? htmlToMd(b.caption) + '\n\n' : '') + '```python\n' + b.code + '\n```\n'); break
      case 'viz':
        out.push(`> 🔗 인터랙티브 시각화(웹): **${b.component}** — 직접 값을 넣어 단계 실행할 수 있는 도구.\n`); break
      default: break
    }
  }
  return out.join('\n')
}

// ── 코드 실행 추적표 (pyTrace) ──
function cleanNote(note) {
  return String(note || '')
    .replace(/\s*\([^)]*[=는][^)]*\)/g, '') // 교육용 괄호 힌트 제거(짧게)
    .replace(/\s+/g, ' ')
    .trim()
}
// 빈칸(____) 코드: 정답을 빈칸에 넣어 실행 가능한 코드로 만든다
function fillBlanks(p) {
  if (!/____/.test(p.code)) return { code: p.code, note: '' }
  const blanks = (p.code.match(/____+/g) || []).length
  const ans = (p.options || [])[p.answer - 1] || ''
  const parts = ans.split(/\s*,\s*/)
  let i = 0
  const code = parts.length === blanks
    ? p.code.replace(/____+/g, () => parts[i++])
    : p.code.replace(/____+/g, ans)
  return { code, note: `빈칸에 정답 \`${ans}\`(${OPT_NUM[p.answer - 1]})을 넣고 실행하면:`, filled: true }
}
function isAscending(arr) {
  for (let k = 1; k < arr.length; k++) if (arr[k - 1] > arr[k]) return false
  return true
}
function renderCodeTrace(p) {
  const { code, note: fillNote, filled } = fillBlanks(p)
  let r
  try { r = pyTrace(code) } catch { return '' }
  if (!r || r.error || !r.steps?.length) return ''
  // 빈칸을 채운 경우: 정렬 결과(출력 배열)가 오름차순일 때만 신뢰(잘못 채웠으면 표시 안 함)
  if (filled) {
    const out = r.steps[r.steps.length - 1]?.stdout?.trim() || ''
    const m = out.match(/\[([-\d,\s]+)\]/)
    let sorted = false
    if (m) { const nums = m[1].split(',').map((x) => parseFloat(x)); sorted = nums.every((n) => !Number.isNaN(n)) && isAscending(nums) }
    else { const last = [...r.steps].reverse().find((s) => s.vars && Array.isArray(s.vars.arr)); sorted = !!last && isAscending(last.vars.arr) }
    if (!sorted) return ''
  }
  const rows = []
  for (const s of r.steps) {
    const arr = s.vars && Array.isArray(s.vars.arr) ? `\`[${s.vars.arr.join(', ')}]\`` : ''
    const extra = s.vars
      ? Object.entries(s.vars).filter(([k, v]) => k !== 'arr' && (typeof v === 'number' || typeof v === 'string'))
          .map(([k, v]) => `${k}=${v}`).join(', ')
      : ''
    const note = cleanNote(s.note)
    if (!arr && !note) continue
    rows.push(`| ${arr || '·'} | ${extra || '·'} | ${note || '·'} |`)
    if (rows.length > 60) break
  }
  const out = r.steps[r.steps.length - 1]?.stdout?.trim()
  const table = ['| 배열 상태 | 변수 | 동작 |', '| --- | --- | --- |', ...rows].join('\n')
  return `**실행 추적** (한 줄씩 따라가기)\n\n${fillNote ? fillNote + '\n\n' : ''}${table}\n\n${out ? `**출력**: \`${out}\`\n` : ''}`
}

// ── 트리 → mermaid ──
function treeToMermaid(tree) {
  if (!tree || tree.v == null) return ''
  const lines = ['```mermaid', 'graph TD']
  let idc = 0
  const walk = (node) => {
    const id = 'N' + idc++
    lines.push(`  ${id}(("${node.v}"))`)
    if (node.l) { const lid = walk(node.l); lines.push(`  ${id} -->|왼| ${lid}`) }
    if (node.r) { const rid = walk(node.r); lines.push(`  ${id} -->|오| ${rid}`) }
    return id
  }
  walk(tree)
  lines.push('```')
  return lines.join('\n')
}

// ── 보기(선지) ──
function renderOptions(p) {
  if (p.type === 'ox') {
    return ['O', 'X'].map((v) => `- ${v === p.answer ? '**' : ''}${v}${v === p.answer ? ' ✅**' : ''}`).join('\n')
  }
  return (p.options || []).map((o, i) => {
    const correct = i + 1 === p.answer
    return `- ${OPT_NUM[i]} ${correct ? '**' : ''}${htmlToMd(o)}${correct ? ' ✅**' : ''}`
  }).join('\n')
}

function answerText(p) {
  if (p.type === 'ox') return p.answer
  return `${OPT_NUM[p.answer - 1]} ${htmlToMd(p.options[p.answer - 1])}`
}

// ── 문제별 시각화 선택 ──
function renderProblemViz(p) {
  if (p.type === 'code' && p.code) return renderCodeTrace(p)
  if (p.tree) return `**트리 그림**\n\n${treeToMermaid(p.tree)}`
  if (p.figure) return `> 그림: ${htmlToMd(p.figure)}`
  return ''
}

// ── 풀이전략(tip) ──
function renderTip(tip) {
  if (!tip) return ''
  const parts = []
  if (tip.focus) parts.push(`**무엇을 묻나**: ${htmlToMd(tip.focus)}`)
  if (tip.steps?.length) {
    parts.push(tip.steps.map((s) => `- **${s.label}**: ${htmlToMd(s.text)}`).join('\n'))
  }
  if (tip.answer) parts.push(`**한 줄 결론**: ${htmlToMd(tip.answer)}`)
  if (tip.mnemonic) parts.push(`**암기**: ${htmlToMd(tip.mnemonic)}`)
  return parts.join('\n\n')
}

// ── 한 문제 ──
function renderProblem(p, tip) {
  const L = []
  const concepts = (p.concepts || []).join(' · ')
  L.push(`### Q${p.no} · ${TYPE_LABEL[p.type]}${concepts ? ` · ${concepts}` : ''}`)
  L.push('')
  L.push(`**문제.** ${htmlToMd(p.prompt)}`)
  L.push('')
  if (p.code) { L.push('```python'); L.push(p.code); L.push('```'); L.push('') }
  if (p.figure && !p.tree) { /* figure는 시각화에서 처리 */ }
  L.push(renderOptions(p))
  L.push('')

  const viz = renderProblemViz(p)
  if (viz) { L.push(viz); L.push('') }

  L.push(`**정답: ${answerText(p)}**`)
  L.push('')

  const d = p.detail
  if (d) {
    if (d.summary) { L.push(`> ${htmlToMd(d.summary)}`); L.push('') }
    if (d.reasoning?.length) {
      L.push('**왜 이게 답인가**')
      L.push('')
      L.push(d.reasoning.map((r) => `- ${htmlToMd(r)}`).join('\n'))
      L.push('')
    }
    if (d.optionAnalysis?.length) {
      L.push('**보기 분석**')
      L.push('')
      L.push('| 보기 | 판정 | 이유 |')
      L.push('| --- | --- | --- |')
      for (const o of d.optionAnalysis) {
        L.push(`| ${o.label} | ${o.verdict} | ${htmlToMd(o.why)} |`)
      }
      L.push('')
    }
    if (d.keyConcepts?.length) { L.push(`**핵심 개념**: ${d.keyConcepts.map(htmlToMd).join(' · ')}`); L.push('') }
    if (d.pitfall) { L.push(`**⚠️ 함정**: ${htmlToMd(d.pitfall)}`); L.push('') }
  }

  const tipMd = renderTip(tip)
  if (tipMd) { L.push('**🖍️ 빠른 풀이전략**'); L.push(''); L.push(tipMd); L.push('') }

  L.push('---')
  return L.join('\n')
}

// ── 개념그룹 ──
function renderGroups(c) {
  const groups = c.summary?.groups || []
  if (!groups.length) return ''
  const L = ['## 개념별 핵심 + 시각화', '']
  for (const g of groups) {
    L.push(`### ▸ ${g.title}`)
    L.push('')
    if (g.gist) { L.push(htmlToMd(g.gist)); L.push('') }
    // enrichment 시각화 우선
    const ek = `${c.id}::${g.title}`
    const ev = ENRICH.groupViz[ek]
    if (ev) {
      if (ev.narration) { L.push(ev.narration.trim()); L.push('') }
      if (ev.viz) { L.push(ev.viz.trim()); L.push('') }
    } else if (g.svgCaption) {
      L.push(`*그림: ${htmlToMd(g.svgCaption)}*`); L.push('')
    }
    if (g.mnemonic) { L.push(`**암기**: ${htmlToMd(g.mnemonic)}`); L.push('') }
  }
  return L.join('\n')
}

// ── 챕터별 치트시트 ──
function renderCheatsheet(c) {
  const cs = c.summary?.cheatsheet || []
  if (!cs.length) return ''
  return `## 핵심 한눈에 (치트시트)\n${renderBlocks(cs, 3)}`
}

// ── 한 챕터 ──
function renderChapter(c) {
  const L = []
  L.push(`# ${c.title}`)
  if (c.subtitle) L.push(`\n*${c.subtitle}*`)
  L.push('')

  // 영상 인트로(enrichment)
  if (ENRICH.chapterIntros[c.id]) {
    L.push('## 🎬 영상 도입 설명')
    L.push('')
    L.push(ENRICH.chapterIntros[c.id].trim())
    L.push('')
  }

  // 개념 빠르게
  L.push('## 개념 빠르게')
  if (c.concept?.summary) { L.push(''); L.push(htmlToMd(c.concept.summary)) }
  if (c.concept?.blocks) L.push(renderBlocks(c.concept.blocks, 3))
  L.push('')

  // 치트시트
  const cheat = renderCheatsheet(c)
  if (cheat) { L.push(cheat); L.push('') }

  // 개념그룹 + 시각화
  const groups = renderGroups(c)
  if (groups) { L.push(groups); L.push('') }

  // 문제 은행
  L.push(`## 문제 은행 (${c.problems.length}문제)`)
  L.push('')
  for (const p of c.problems) {
    L.push(renderProblem(p, c.summary?.tips?.[p.no]))
    L.push('')
  }
  return L.join('\n')
}

// ── 머리말 ──
function header() {
  const total = chapters.reduce((s, c) => s + c.problems.length, 0)
  return `# 자료구조·알고리즘 완전 학습노트 (NotebookLM 영상 제작용)

> 이 문서 하나로 **개념 → 문제 → 왜 이게 답인지**를 한 흐름으로 학습합니다.
> 정렬·문자열 검색·리스트·트리 4개 단원, 총 **${total}문제**의 풀이와 시각화를 담았습니다.

## NotebookLM에서 영상 만드는 법
1. NotebookLM에 새 노트북을 만들고 **이 .md 파일을 소스로 업로드**하세요. (단원이 많으면 \`notebooklm/\` 폴더의 챕터별 파일을 각각 소스로 올려도 됩니다.)
2. **Video Overview / 동영상 개요**를 생성하면, 아래 구조(개념→문제→정답 근거)를 따라 내레이션 영상이 만들어집니다.
3. 특정 단원만 영상으로 만들려면 해당 챕터 파일만 소스로 선택하세요.

## 이 노트 읽는 법 (시각화 범례)
- **실행 추적표**: 코드가 한 줄씩 돌 때 \`배열 상태\`가 어떻게 바뀌는지 단계별로 보여줍니다. (정렬 코드 문제)
- **mermaid 트리 그림**: 이진트리 구조를 도식화합니다. (\`왼\`=왼쪽 자식, \`오\`=오른쪽 자식)
- **보기 분석 표**: 각 선지가 정답/오답인 이유를 한 줄로 정리합니다.
- **🖍️ 빠른 풀이전략**: 형광펜으로 볼 곳 → 떠올릴 개념 → 적용 → 암기. 시험장에서 바로 쓰는 순서입니다.

---
`
}

// ── 부록: 통합 치트시트 ──
function appendix() {
  const L = ['# 부록 · 단원별 핵심 치트시트 모음', '']
  for (const c of chapters) {
    L.push(`## ${c.title}`)
    const cs = renderBlocks(c.summary?.cheatsheet || [], 3)
    L.push(cs || '_(없음)_')
    L.push('')
  }
  return L.join('\n')
}

// ── 빌드 ──
const chapterMd = chapters.map(renderChapter)
const master = [header(), ...chapterMd.map((m, i) => m + (i < chapterMd.length - 1 ? '\n\n===\n' : '')), '\n', appendix()].join('\n')

const masterPath = join(OUT_DIR, '00_전체_NotebookLM학습노트.md')
writeFileSync(masterPath, master, 'utf8')
chapters.forEach((c, i) => {
  const fname = `${c.id.toUpperCase()}_${c.title.replace(/^Ch\d+\s*/, '').replace(/\s+/g, '')}.md`
  writeFileSync(join(OUT_DIR, fname), header().split('---')[0] + '\n---\n\n' + chapterMd[i], 'utf8')
})

// ── 통계 ──
const probCount = chapters.reduce((s, c) => s + c.problems.length, 0)
const codeCount = chapters.flatMap((c) => c.problems).filter((p) => p.type === 'code').length
const treeCount = chapters.flatMap((c) => c.problems).filter((p) => p.tree).length
console.log('생성 완료')
console.log('  마스터:', masterPath, `(${master.length.toLocaleString()}자)`)
console.log('  폴더:', OUT_DIR)
console.log(`  문제 ${probCount} · 코드추적 ${codeCount} · 트리그림 ${treeCount}`)
