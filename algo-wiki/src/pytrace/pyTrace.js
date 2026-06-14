// pyTrace: 교육용 파이썬 서브셋 인터프리터 + 단계 트레이서
// 정렬/리스트/트리 코드 문제를 실제 실행하며 (줄번호, 변수상태, 접근 인덱스, 출력)을 단계별로 기록한다.
// 지원: 변수/리스트/튜플/문자열/수, 인덱싱·슬라이스, for(range/리스트)·while·if/elif/else,
//       break/continue, 다중·튜플 대입, 증분대입(+=,-= 등), 비교/산술/불리언, def/재귀,
//       리스트 컴프리헨션, len/range/print, .append(), [0]*n 등.

const KEYWORDS = new Set(['for', 'while', 'if', 'elif', 'else', 'def', 'return', 'break', 'continue', 'pass', 'in', 'and', 'or', 'not', 'True', 'False', 'None'])

// ── 토크나이저 (한 줄) ──
function tokenizeLine(src) {
  const toks = []
  let i = 0
  const ops3 = ['//=', '**=']
  const ops2 = ['**', '//', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=']
  while (i < src.length) {
    const c = src[i]
    if (c === ' ' || c === '\t') { i++; continue }
    if (c === '#') break // 주석
    if (c === "'" || c === '"') {
      if (src[i + 1] === c && src[i + 2] === c) { // 삼중 따옴표(독스트링)
        let j = i + 3, s = ''
        while (j < src.length && !(src[j] === c && src[j + 1] === c && src[j + 2] === c)) { s += src[j]; j++ }
        toks.push({ t: 'str', v: s }); i = j + 3; continue
      }
      let j = i + 1, s = ''
      while (j < src.length && src[j] !== c) { s += src[j]; j++ }
      toks.push({ t: 'str', v: s }); i = j + 1; continue
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1]))) {
      let j = i, num = ''
      while (j < src.length && /[0-9.]/.test(src[j])) { num += src[j]; j++ }
      toks.push({ t: 'num', v: parseFloat(num) }); i = j; continue
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i, name = ''
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) { name += src[j]; j++ }
      toks.push({ t: KEYWORDS.has(name) ? 'kw' : 'name', v: name }); i = j; continue
    }
    const three = src.substr(i, 3)
    if (ops3.includes(three)) { toks.push({ t: 'op', v: three }); i += 3; continue }
    const two = src.substr(i, 2)
    if (ops2.includes(two)) { toks.push({ t: 'op', v: two }); i += 2; continue }
    if ('+-*/%<>=(){}[],:.'.includes(c)) { toks.push({ t: 'op', v: c }); i++; continue }
    throw new Error(`알 수 없는 문자: ${c}`)
  }
  return toks
}

// ── 논리 라인 구성 (들여쓰기/줄번호) ──
function buildLines(code) {
  const raw = code.replace(/\t/g, '    ').split('\n')
  const lines = []
  raw.forEach((text, idx) => {
    const noComment = stripComment(text)
    if (noComment.trim() === '') return
    const indent = text.match(/^ */)[0].length
    lines.push({ lineNo: idx + 1, indent, tokens: tokenizeLine(text) })
  })
  return lines
}
function stripComment(text) {
  let inStr = false, q = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inStr) { if (c === q) inStr = false }
    else if (c === "'" || c === '"') { inStr = true; q = c }
    else if (c === '#') return text.slice(0, i)
  }
  return text
}

// ── 블록 파서 (들여쓰기 기반) ──
function parseBlock(lines, pos, indent) {
  const stmts = []
  while (pos.i < lines.length && lines[pos.i].indent >= indent) {
    if (lines[pos.i].indent > indent) throw new Error('들여쓰기 오류')
    const line = lines[pos.i]
    const first = line.tokens[0]
    if (first && first.t === 'kw' && ['for', 'while', 'if', 'elif', 'else', 'def'].includes(first.v)) {
      const stmt = parseCompound(lines, pos)
      stmts.push(stmt)
    } else {
      pos.i++
      stmts.push(parseSimple(line))
    }
  }
  return stmts
}

function parseCompound(lines, pos) {
  const line = lines[pos.i]
  const toks = line.tokens
  const kw = toks[0].v
  pos.i++
  const bodyIndent = pos.i < lines.length ? lines[pos.i].indent : line.indent + 1
  const readBody = () => parseBlock(lines, pos, bodyIndent)

  if (kw === 'for') {
    // for <target> in <iter> :
    const inIdx = toks.findIndex((t) => t.t === 'kw' && t.v === 'in')
    const target = parseExpr(toks.slice(1, inIdx))
    const colon = toks.length - 1
    const iter = parseExpr(toks.slice(inIdx + 1, colon))
    return { type: 'For', line: line.lineNo, target, iter, body: readBody() }
  }
  if (kw === 'while') {
    const cond = parseExpr(toks.slice(1, toks.length - 1))
    return { type: 'While', line: line.lineNo, cond, body: readBody() }
  }
  if (kw === 'def') {
    const name = toks[1].v
    const lp = 2, rp = toks.findIndex((t) => t.v === ')')
    const params = []
    for (let k = lp + 1; k < rp; k++) if (toks[k].t === 'name') params.push(toks[k].v)
    return { type: 'Def', line: line.lineNo, name, params, body: readBody() }
  }
  if (kw === 'if' || kw === 'elif') {
    const cond = parseExpr(toks.slice(1, toks.length - 1))
    const body = readBody()
    let orelse = []
    if (pos.i < lines.length && lines[pos.i].indent === line.indent) {
      const nxt = lines[pos.i].tokens[0]
      if (nxt && nxt.t === 'kw' && (nxt.v === 'elif' || nxt.v === 'else')) {
        orelse = [parseCompound(lines, pos)]
      }
    }
    return { type: 'If', line: line.lineNo, cond, body, orelse }
  }
  if (kw === 'else') {
    return { type: 'Else', line: line.lineNo, body: readBody() }
  }
  throw new Error('지원하지 않는 구문: ' + kw)
}

function parseSimple(line) {
  const toks = line.tokens
  const first = toks[0]
  if (first.t === 'kw') {
    if (first.v === 'return') return { type: 'Return', line: line.lineNo, value: toks.length > 1 ? parseExpr(toks.slice(1)) : null }
    if (first.v === 'break') return { type: 'Break', line: line.lineNo }
    if (first.v === 'continue') return { type: 'Continue', line: line.lineNo }
    if (first.v === 'pass') return { type: 'Pass', line: line.lineNo }
  }
  // 증분 대입?
  const augIdx = toks.findIndex((t) => t.t === 'op' && ['+=', '-=', '*=', '/=', '//=', '**='].includes(t.v))
  if (augIdx >= 0) {
    const target = parseExpr(toks.slice(0, augIdx))
    const value = parseExpr(toks.slice(augIdx + 1))
    return { type: 'AugAssign', line: line.lineNo, op: toks[augIdx].v[0] === '/' ? toks[augIdx].v.slice(0, -1) : toks[augIdx].v.replace('=', ''), target, value }
  }
  // 일반/다중/튜플 대입? 최상위 '=' 로 분할
  const segs = splitTopLevel(toks, '=')
  if (segs.length >= 2) {
    const value = parseExpr(segs[segs.length - 1])
    const targets = segs.slice(0, -1).map((seg) => parseTargetList(seg))
    return { type: 'Assign', line: line.lineNo, targets, value }
  }
  // 표현식 문장 (print(...), x.append(...))
  return { type: 'Expr', line: line.lineNo, expr: parseExpr(toks) }
}

// 최상위(괄호/대괄호 밖) 단일문자 op 로 분할
function splitTopLevel(toks, opChar) {
  const segs = []; let cur = []; let depth = 0
  for (const t of toks) {
    if (t.t === 'op' && '([{'.includes(t.v)) depth++
    else if (t.t === 'op' && ')]}'.includes(t.v)) depth--
    if (depth === 0 && t.t === 'op' && t.v === opChar) { segs.push(cur); cur = [] }
    else cur.push(t)
  }
  segs.push(cur)
  return segs
}

// 대입 대상: 콤마로 나뉘면 튜플 타깃
function parseTargetList(toks) {
  const parts = splitTopLevel(toks, ',').filter((p) => p.length)
  if (parts.length === 1) return parseExpr(parts[0])
  return { type: 'TupleTarget', items: parts.map((p) => parseExpr(p)) }
}

// ── 표현식 파서 (재귀하강 + 콤마/컴프리헨션) ──
function parseExpr(toks) {
  const p = new P(toks)
  const e = p.parseTopComma()
  return e
}

class P {
  constructor(toks) { this.toks = toks; this.i = 0 }
  peek() { return this.toks[this.i] }
  next() { return this.toks[this.i++] }
  eat(v) { const t = this.toks[this.i]; if (!t || t.v !== v) throw new Error('기대: ' + v + ' 실제: ' + (t && t.v)); this.i++; return t }
  atEnd() { return this.i >= this.toks.length }

  // 최상위 콤마 → 튜플 (1개면 그대로)
  parseTopComma() {
    const first = this.parseOr()
    if (this.peek() && this.peek().v === ',') {
      const items = [first]
      while (this.peek() && this.peek().v === ',') { this.next(); if (this.atEnd()) break; items.push(this.parseOr()) }
      return { type: 'Tuple', items }
    }
    return first
  }
  parseOr() {
    let l = this.parseAnd()
    while (this.peek() && this.peek().t === 'kw' && this.peek().v === 'or') { this.next(); l = { type: 'Bool', op: 'or', l, r: this.parseAnd() } }
    return l
  }
  parseAnd() {
    let l = this.parseNot()
    while (this.peek() && this.peek().t === 'kw' && this.peek().v === 'and') { this.next(); l = { type: 'Bool', op: 'and', l, r: this.parseNot() } }
    return l
  }
  parseNot() {
    if (this.peek() && this.peek().t === 'kw' && this.peek().v === 'not') { this.next(); return { type: 'Not', e: this.parseNot() } }
    return this.parseCompare()
  }
  parseCompare() {
    let l = this.parseAdd()
    const cmps = ['<', '>', '<=', '>=', '==', '!=']
    while (this.peek() && this.peek().t === 'op' && cmps.includes(this.peek().v)) {
      const op = this.next().v; const r = this.parseAdd(); l = { type: 'Cmp', op, l, r }
    }
    return l
  }
  parseAdd() {
    let l = this.parseMul()
    while (this.peek() && this.peek().t === 'op' && ['+', '-'].includes(this.peek().v)) { const op = this.next().v; l = { type: 'Bin', op, l, r: this.parseMul() } }
    return l
  }
  parseMul() {
    let l = this.parseUnary()
    while (this.peek() && this.peek().t === 'op' && ['*', '/', '//', '%'].includes(this.peek().v)) { const op = this.next().v; l = { type: 'Bin', op, l, r: this.parseUnary() } }
    return l
  }
  parseUnary() {
    if (this.peek() && this.peek().t === 'op' && this.peek().v === '-') { this.next(); return { type: 'Neg', e: this.parseUnary() } }
    return this.parsePostfix()
  }
  parsePostfix() {
    let e = this.parseAtom()
    while (this.peek()) {
      const t = this.peek()
      if (t.v === '[') { this.next(); e = this.parseSubscript(e) }
      else if (t.v === '.') { this.next(); const name = this.next().v; e = { type: 'Attr', obj: e, name } }
      else if (t.v === '(') { this.next(); e = this.parseCall(e) }
      else break
    }
    return e
  }
  parseSubscript(obj) {
    // [ expr ]  또는  [ lower? : upper? ]
    const inner = []
    let depth = 1
    while (this.peek() && depth > 0) {
      const t = this.peek()
      if (t.v === '[') depth++
      if (t.v === ']') { depth--; if (depth === 0) { this.next(); break } }
      inner.push(this.next())
    }
    // 슬라이스 판단
    const segs = splitTopLevel(inner, ':')
    if (segs.length > 1) {
      const lower = segs[0].length ? parseExpr(segs[0]) : null
      const upper = segs[1].length ? parseExpr(segs[1]) : null
      const step = segs[2] && segs[2].length ? parseExpr(segs[2]) : null
      return { type: 'Slice', obj, lower, upper, step }
    }
    return { type: 'Index', obj, index: parseExpr(inner) }
  }
  parseCall(callee) {
    const args = []
    if (this.peek() && this.peek().v !== ')') {
      const parts = []
      let cur = []; let depth = 0
      while (this.peek()) {
        const t = this.peek()
        if (t.v === '(' || t.v === '[') depth++
        if (t.v === ')' || t.v === ']') { if (t.v === ')' && depth === 0) break; depth-- }
        if (depth === 0 && t.v === ',') { this.next(); parts.push(cur); cur = []; continue }
        cur.push(this.next())
      }
      if (cur.length) parts.push(cur)
      for (const pr of parts) args.push(parseExpr(pr))
    }
    this.eat(')')
    return { type: 'Call', callee, args }
  }
  parseAtom() {
    const t = this.peek()
    if (!t) throw new Error('표현식 끝 도달')
    if (t.t === 'num') { this.next(); return { type: 'Num', v: t.v } }
    if (t.t === 'str') { this.next(); return { type: 'Str', v: t.v } }
    if (t.t === 'kw' && ['True', 'False', 'None'].includes(t.v)) { this.next(); return { type: 'Const', v: t.v === 'True' ? true : t.v === 'False' ? false : null } }
    if (t.t === 'name') { this.next(); return { type: 'Name', v: t.v } }
    if (t.v === '(') {
      this.next()
      if (this.peek() && this.peek().v === ')') { this.next(); return { type: 'Tuple', items: [] } }
      const e = this.parseTopComma(); this.eat(')'); return e
    }
    if (t.v === '[') {
      this.next()
      // 빈 리스트
      if (this.peek() && this.peek().v === ']') { this.next(); return { type: 'List', items: [] } }
      // 컴프리헨션 여부 확인: 'for' kw 존재
      const saved = this.i
      const inner = []
      let depth = 1
      while (this.peek() && depth > 0) {
        const tk = this.peek()
        if (tk.v === '[') depth++
        if (tk.v === ']') { depth--; if (depth === 0) break }
        inner.push(tk); this.next()
      }
      this.eat(']')
      const forIdx = inner.findIndex((x) => x.t === 'kw' && x.v === 'for')
      if (forIdx >= 0) {
        const elt = parseExpr(inner.slice(0, forIdx))
        const inIdx = inner.findIndex((x) => x.t === 'kw' && x.v === 'in')
        const target = parseExpr(inner.slice(forIdx + 1, inIdx))
        const ifIdx = inner.findIndex((x, k) => k > inIdx && x.t === 'kw' && x.v === 'if')
        const iter = parseExpr(inner.slice(inIdx + 1, ifIdx >= 0 ? ifIdx : inner.length))
        const cond = ifIdx >= 0 ? parseExpr(inner.slice(ifIdx + 1)) : null
        return { type: 'Comp', elt, target, iter, cond }
      }
      // 일반 리스트
      const items = splitTopLevel(inner, ',').filter((s) => s.length).map((s) => parseExpr(s))
      return { type: 'List', items }
    }
    if (t.v === '{') {
      this.next()
      const inner = []
      let depth = 1
      while (this.peek() && depth > 0) {
        const tk = this.peek()
        if (tk.v === '{') depth++
        if (tk.v === '}') { depth--; if (depth === 0) break }
        inner.push(tk); this.next()
      }
      this.eat('}')
      const pairs = splitTopLevel(inner, ',').filter((s) => s.length).map((s) => {
        const kv = splitTopLevel(s, ':')
        return { key: parseExpr(kv[0]), value: parseExpr(kv[1]) }
      })
      return { type: 'Dict', pairs }
    }
    throw new Error('알 수 없는 토큰: ' + JSON.stringify(t))
  }
}

// ── 값 유틸 ──
const TUPLE = (v) => ({ __t: 'tuple', v })
const isTuple = (x) => x && x.__t === 'tuple'
const isList = (x) => Array.isArray(x)
const DICT = () => ({ __d: 'dict', m: new Map() })
const isDict = (x) => x && x.__d === 'dict'
function deepCopy(x) {
  if (isList(x)) return x.map(deepCopy)
  if (isTuple(x)) return TUPLE(x.v.map(deepCopy))
  if (isDict(x)) { const d = DICT(); for (const [k, v] of x.m) d.m.set(k, deepCopy(v)); return d }
  return x
}
export function pyRepr(x) {
  if (x === null) return 'None'
  if (x === true) return 'True'
  if (x === false) return 'False'
  if (typeof x === 'string') return "'" + x + "'"
  if (typeof x === 'number') return Number.isInteger(x) ? String(x) : String(x)
  if (isList(x)) return '[' + x.map(pyRepr).join(', ') + ']'
  if (isTuple(x)) return '(' + x.v.map(pyRepr).join(', ') + ')'
  if (isDict(x)) return '{' + [...x.m].map(([k, v]) => pyRepr(k) + ': ' + pyRepr(v)).join(', ') + '}'
  return String(x)
}
function pyStr(x) { return typeof x === 'string' ? x : pyRepr(x) }

// ── 인터프리터 ──
class Break { }
class Continue { }
class Return { constructor(v) { this.v = v } }

export function pyTrace(code, opts = {}) {
  const maxSteps = opts.maxSteps || 4000
  let lines
  try { lines = buildLines(code) } catch (e) { return { error: '파싱 오류: ' + e.message, steps: [] } }
  let program
  try { program = parseBlock(lines, { i: 0 }, 0) } catch (e) { return { error: '파싱 오류: ' + e.message, steps: [] } }

  const steps = []
  let stdout = ''
  const funcs = {}
  const globalScope = {}
  let touched = {} // {varName: Set(indices)} 이번 문장에서 접근/변경된 인덱스

  function snapshot(scope) {
    const vars = {}
    for (const k of Object.keys(scope)) { if (k.startsWith('__')) continue; vars[k] = deepCopy(scope[k]) }
    return vars
  }
  function record(line, scope, depth, fnName) {
    if (steps.length >= maxSteps) throw new Error('단계 수 초과(무한 루프?)')
    const tk = {}
    for (const k of Object.keys(touched)) tk[k] = [...touched[k]]
    steps.push({ line, vars: snapshot(scope), touched: tk, stdout, depth, fn: fnName })
  }
  function markTouch(name, idx) {
    if (!touched[name]) touched[name] = new Set()
    if (idx != null && idx >= 0) touched[name].add(idx)
  }

  function exec(stmts, scope, depth, fnName) {
    for (const st of stmts) execStmt(st, scope, depth, fnName)
  }

  function execStmt(st, scope, depth, fnName) {
    switch (st.type) {
      case 'Def': funcs[st.name] = st; return
      case 'Assign': {
        touched = {}
        const val = evalExpr(st.value, scope)
        for (const tg of st.targets) assignTo(tg, val, scope)
        record(st.line, scope, depth, fnName); return
      }
      case 'AugAssign': {
        touched = {}
        const cur = evalExpr(st.target, scope)
        const rhs = evalExpr(st.value, scope)
        let nv
        if (st.op === '+' && isList(cur)) { for (const e of rhs) cur.push(e); nv = cur }
        else nv = binop(st.op, cur, rhs)
        if (!(st.op === '+' && isList(cur))) assignTo(st.target, nv, scope)
        record(st.line, scope, depth, fnName); return
      }
      case 'Expr': {
        if (st.expr.type === 'Str') return // 독스트링은 무시
        touched = {}
        evalExpr(st.expr, scope)
        record(st.line, scope, depth, fnName); return
      }
      case 'For': {
        const iter = (touched = {}, evalExpr(st.iter, scope))
        const items = toIterable(iter)
        for (const it of items) {
          touched = {}
          assignTo(st.target, it, scope)
          record(st.line, scope, depth, fnName)
          try { exec(st.body, scope, depth, fnName) }
          catch (e) { if (e instanceof Break) break; if (e instanceof Continue) continue; throw e }
        }
        return
      }
      case 'While': {
        let guard = 0
        while (true) {
          touched = {}
          const c = evalExpr(st.cond, scope)
          record(st.line, scope, depth, fnName)
          if (!truthy(c)) break
          if (guard++ > maxSteps) throw new Error('while 무한 루프')
          try { exec(st.body, scope, depth, fnName) }
          catch (e) { if (e instanceof Break) break; if (e instanceof Continue) continue; throw e }
        }
        return
      }
      case 'If': {
        touched = {}
        const c = evalExpr(st.cond, scope)
        record(st.line, scope, depth, fnName)
        if (truthy(c)) exec(st.body, scope, depth, fnName)
        else if (st.orelse && st.orelse.length) execStmt(st.orelse[0], scope, depth, fnName)
        return
      }
      case 'Else': exec(st.body, scope, depth, fnName); return
      case 'Break': record(st.line, scope, depth, fnName); throw new Break()
      case 'Continue': record(st.line, scope, depth, fnName); throw new Continue()
      case 'Return': {
        touched = {}
        const v = st.value ? evalExpr(st.value, scope) : null
        record(st.line, scope, depth, fnName)
        throw new Return(v)
      }
      case 'Pass': record(st.line, scope, depth, fnName); return
      default: throw new Error('지원하지 않는 문장: ' + st.type)
    }
  }

  function assignTo(target, val, scope) {
    if (target.type === 'Name') { scope[target.v] = val; return }
    if (target.type === 'Index') {
      const obj = evalExpr(target.obj, scope)
      const idx = evalExpr(target.index, scope)
      if (isDict(obj)) { obj.m.set(idx, val); return }
      obj[idx] = val
      if (target.obj.type === 'Name' && typeof idx === 'number') markTouch(target.obj.v, idx)
      return
    }
    if (target.type === 'TupleTarget' || target.type === 'Tuple' || target.type === 'List') {
      const items = target.items
      const vals = isTuple(val) ? val.v : val
      items.forEach((it, k) => assignTo(it, vals[k], scope))
      return
    }
    throw new Error('대입 불가 대상: ' + target.type)
  }

  function evalExpr(e, scope) {
    switch (e.type) {
      case 'Num': return e.v
      case 'Str': return e.v
      case 'Const': return e.v
      case 'Name': {
        if (e.v in scope) return scope[e.v]
        if (e.v in globalScope) return globalScope[e.v]
        throw new Error("정의되지 않은 이름: " + e.v)
      }
      case 'List': return e.items.map((it) => evalExpr(it, scope))
      case 'Tuple': return TUPLE(e.items.map((it) => evalExpr(it, scope)))
      case 'Dict': { const d = DICT(); for (const p of e.pairs) d.m.set(evalExpr(p.key, scope), evalExpr(p.value, scope)); return d }
      case 'Index': {
        const obj = evalExpr(e.obj, scope)
        const idx = evalExpr(e.index, scope)
        if (isDict(obj)) return obj.m.get(idx)
        if (e.obj.type === 'Name' && typeof idx === 'number') markTouch(e.obj.v, idx)
        const base = isTuple(obj) ? obj.v : obj
        const k = idx < 0 ? base.length + idx : idx
        return base[k]
      }
      case 'Slice': {
        const obj = evalExpr(e.obj, scope)
        const base = isTuple(obj) ? obj.v : obj
        let lo = e.lower ? evalExpr(e.lower, scope) : 0
        let hi = e.upper ? evalExpr(e.upper, scope) : base.length
        if (lo < 0) lo += base.length
        if (hi < 0) hi += base.length
        return base.slice(lo, hi)
      }
      case 'Neg': return -evalExpr(e.e, scope)
      case 'Not': return !truthy(evalExpr(e.e, scope))
      case 'Bool': {
        const l = evalExpr(e.l, scope)
        if (e.op === 'and') return truthy(l) ? evalExpr(e.r, scope) : l
        return truthy(l) ? l : evalExpr(e.r, scope)
      }
      case 'Cmp': return compare(e.op, evalExpr(e.l, scope), evalExpr(e.r, scope))
      case 'Bin': return binop(e.op, evalExpr(e.l, scope), evalExpr(e.r, scope))
      case 'Attr': return { __bound: true, obj: evalExpr(e.obj, scope), name: e.name, objExpr: e.obj }
      case 'Call': return evalCall(e, scope)
      case 'Comp': return evalComp(e, scope)
      default: throw new Error('지원하지 않는 식: ' + e.type)
    }
  }

  function evalComp(e, scope) {
    const out = []
    const items = toIterable(evalExpr(e.iter, scope))
    for (const it of items) {
      assignTo(e.target, it, scope)
      if (!e.cond || truthy(evalExpr(e.cond, scope))) out.push(evalExpr(e.elt, scope))
    }
    return out
  }

  function evalCall(e, scope) {
    // 내장 함수
    if (e.callee.type === 'Name') {
      const fn = e.callee.v
      if (fn === 'len') return lengthOf(evalExpr(e.args[0], scope))
      if (fn === 'range') { const a = e.args.map((x) => evalExpr(x, scope)); return rangeArr(...a) }
      if (fn === 'print') { stdout += e.args.map((x) => pyStr(evalExpr(x, scope))).join(' ') + '\n'; return null }
      if (fn === 'int') return Math.trunc(evalExpr(e.args[0], scope))
      if (fn === 'abs') return Math.abs(evalExpr(e.args[0], scope))
      if (fn === 'sum') { const it = toIterable(evalExpr(e.args[0], scope)); return it.reduce((a, b) => a + b, 0) }
      if (fn === 'reversed') { const it = toIterable(evalExpr(e.args[0], scope)); return [...it].reverse() }
      if (fn === 'sorted') { const it = toIterable(evalExpr(e.args[0], scope)); return [...it].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)) }
      if (fn === 'enumerate') { const it = toIterable(evalExpr(e.args[0], scope)); return it.map((v, k) => TUPLE([k, v])) }
      if (fn === 'min' || fn === 'max') {
        let a = e.args.map((x) => evalExpr(x, scope))
        if (a.length === 1 && (isList(a[0]) || isTuple(a[0]))) a = toIterable(a[0])
        return fn === 'min' ? Math.min(...a) : Math.max(...a)
      }
      if (funcs[fn]) return callUser(funcs[fn], e.args.map((x) => evalExpr(x, scope)), scope)
      throw new Error('알 수 없는 함수: ' + fn)
    }
    // 메서드 호출 (.append 등)
    const callee = evalExpr(e.callee, scope)
    if (callee && callee.__bound) {
      const { obj, name, objExpr } = callee
      const args = e.args.map((x) => evalExpr(x, scope))
      if (name === 'append') { obj.push(args[0]); if (objExpr.type === 'Name') markTouch(objExpr.v, obj.length - 1); return null }
      if (name === 'pop') return args.length ? obj.splice(args[0], 1)[0] : obj.pop()
      if (name === 'get') return isDict(obj) && obj.m.has(args[0]) ? obj.m.get(args[0]) : (args.length > 1 ? args[1] : null)
      if (name === 'insert') { obj.splice(args[0], 0, args[1]); return null }
      throw new Error('알 수 없는 메서드: ' + name)
    }
    throw new Error('호출 불가')
  }

  function callUser(def, args, callerScope) {
    const local = {}
    def.params.forEach((p, k) => { local[p] = args[k] })
    const savedTouched = touched
    try { exec(def.body, local, (callerScope.__depth || 0) + 1, def.name) }
    catch (e) { if (e instanceof Return) { touched = savedTouched; return e.v } throw e }
    touched = savedTouched
    return null
  }

  globalScope.__name__ = '__main__'
  try {
    record(lines.length ? lines[0].lineNo : 1, globalScope, 0, null) // 시작
    exec(program, globalScope, 0, null)
  } catch (e) {
    if (!(e instanceof Return)) return { error: '실행 오류: ' + e.message, steps, stdout }
  }
  // 최종 상태 스텝
  touched = {}
  steps.push({ line: -1, vars: snapshot(globalScope), touched: {}, stdout, depth: 0, fn: null, final: true })
  return { steps, stdout, output: stdout.trimEnd() }
}

function truthy(x) {
  if (x === null || x === false) return false
  if (x === 0 || x === '') return false
  if (isList(x)) return x.length > 0
  if (isTuple(x)) return x.v.length > 0
  return true
}
function lengthOf(x) { if (typeof x === 'string') return x.length; if (isTuple(x)) return x.v.length; return x.length }
function rangeArr(a, b, c) {
  let start = 0, stop, step = 1
  if (b === undefined) { stop = a } else { start = a; stop = b; if (c !== undefined) step = c }
  const out = []
  if (step > 0) for (let i = start; i < stop; i += step) out.push(i)
  else for (let i = start; i > stop; i += step) out.push(i)
  return out
}
function toIterable(x) { if (isList(x)) return x; if (isTuple(x)) return x.v; if (typeof x === 'string') return x.split(''); return x }
function binop(op, l, r) {
  if (op === '+') { if (isList(l) && isList(r)) return l.concat(r); if (isList(l) && typeof r === 'number') return l; return l + r }
  if (op === '*') { if (isList(l) && typeof r === 'number') { const o = []; for (let k = 0; k < r; k++) for (const e of l) o.push(deepCopyVal(e)); return o } if (typeof l === 'number' && isList(r)) { const o = []; for (let k = 0; k < l; k++) for (const e of r) o.push(deepCopyVal(e)); return o } return l * r }
  if (op === '-') return l - r
  if (op === '/') return l / r
  if (op === '//') return Math.floor(l / r)
  if (op === '%') return ((l % r) + r) % r
  throw new Error('연산자: ' + op)
}
function deepCopyVal(x) { return isList(x) ? x.map(deepCopyVal) : isTuple(x) ? TUPLE(x.v.map(deepCopyVal)) : x }
function compare(op, l, r) {
  const L = isTuple(l) ? l.v : l, R = isTuple(r) ? r.v : r
  if (op === '==') return JSON.stringify(L) === JSON.stringify(R)
  if (op === '!=') return JSON.stringify(L) !== JSON.stringify(R)
  if (op === '<') return L < R
  if (op === '>') return L > R
  if (op === '<=') return L <= R
  if (op === '>=') return L >= R
}
