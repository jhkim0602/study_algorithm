import { useEffect, useMemo, useState } from 'react'
import { pyTrace, pyRepr } from '../../pytrace/pyTrace.js'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

// 코드에 자주 나오는 용어 풀이 (공부용)
const GLOSSARY = [
  { t: 'i, j', d: '반복/인덱스 변수. 배열의 몇 번째 위치인지를 가리키는 번호로 자주 쓰며, 보통 i는 바깥 반복, j는 안쪽 반복에 씁니다. (0부터 시작)' },
  { t: 'range(n)', d: '0,1,…,n-1 의 정수 묶음. for가 n번 반복합니다. range(a, b)는 a부터 b-1까지.' },
  { t: 'len(x)', d: 'x의 길이(원소 개수). 배열 길이는 len(arr).' },
  { t: 'arr[i]', d: '배열 arr의 i번 위치 값. 인덱스는 0부터 시작하므로 첫 원소는 arr[0].' },
  { t: 'arr[i:]', d: '슬라이스 — i번부터 끝까지 잘라낸 부분 리스트. arr[i:j]는 i부터 j-1까지.' },
  { t: '+= / -=', d: '자기 자신에 더하기/빼기. cnt += 1 은 cnt = cnt + 1 과 같습니다.' },
  { t: '// , %', d: '// 는 몫(정수 나눗셈), % 는 나머지. 예: 7//2=3, 7%2=1.' },
  { t: 'a, b = b, a', d: '두 변수의 값을 한 번에 맞바꾸는 교환(swap) 문법.' },
  { t: '.append(x)', d: '리스트 맨 뒤에 값 x를 덧붙입니다.' },
  { t: 'def / return', d: 'def는 함수 정의, return은 함수가 결과를 돌려주며 끝내는 것.' },
  { t: 'pivot', d: '퀵 정렬에서 기준이 되는 값. 이보다 작은 값/큰 값으로 나눕니다.' },
]

// 코드 한 줄씩 실행 + 좌측 자료구조(메모리) 단계별 시각화 (배열은 원소 이동 애니메이션)
export default function CodeStepper({ code, title }) {
  const result = useMemo(() => pyTrace(code), [code])
  const steps = useMemo(
    () => (result.steps && result.steps.length
      ? result.steps
      : [{ line: -1, vars: {}, touched: {}, stdout: result.error || '', depth: 0 }]),
    [result],
  )
  // 단계 간 배열을 비교해 원소 식별자(id) 부여 → 슬라이드 이동 애니메이션
  const arrayIds = useMemo(() => assignArrayIds(steps), [steps])

  const player = useStepPlayer(steps)
  const frame = player.frame || steps[0]
  const stepIds = arrayIds[player.index] || {}
  const lines = code.split('\n')

  const entries = Object.entries(frame.vars || {})
  const arrays = entries.filter(([, v]) => Array.isArray(v))
  const scalars = entries.filter(([, v]) => !Array.isArray(v) && !(v && v.__t === 'tuple'))
  const tuples = entries.filter(([, v]) => v && v.__t === 'tuple')

  const [fs, setFs] = useState(false)
  const [gloss, setGloss] = useState(false)
  useEffect(() => {
    if (!fs) return
    const onKey = (e) => { if (e.key === 'Escape') setFs(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [fs])

  const activeSrc = frame.line > 0 ? (lines[frame.line - 1] || '').trim() : ''

  return (
    <>
      {fs && <div className="cs-backdrop" onClick={() => setFs(false)} />}
      <div className={`viz codestepper${fs ? ' fullscreen' : ''}`}>
        <div className="viz-title">
          <span className="viz-tag">실행</span> 코드 실행 추적기{title ? ` — ${title}` : ''}
          <button className="cs-fs-btn" onClick={() => setFs((v) => !v)} title={fs ? '닫기 (Esc)' : '전체화면으로 크게 보기'}>
            {fs ? '✕ 닫기' : '⛶ 전체화면'}
          </button>
        </div>

        <VizControls player={player} />

        {(activeSrc || frame.note) && (
          <div className="cs-note">
            <div className="cs-note-line">
              {frame.line > 0 && <span className="cs-note-tag">{frame.line}번 줄</span>}
              {activeSrc && <code>{activeSrc}</code>}
            </div>
            {frame.note && <div className="cs-note-desc">💡 {frame.note}</div>}
          </div>
        )}

      <div className="cs-body">
        {/* 좌: 자료구조 / 메모리 */}
        <div className="cs-left">
          <div className="cs-panel-label">자료구조 · 변수 상태</div>
          {frame.fn && (
            <div className="cs-frame">함수 <code>{frame.fn}()</code> 실행 중 · 재귀 깊이 {frame.depth}</div>
          )}

          {arrays.length === 0 && scalars.length === 0 && tuples.length === 0 && (
            <div className="cs-empty">아직 변수가 없습니다. ▶ 다음으로 진행하세요.</div>
          )}

          {arrays.map(([name, arr]) => (
            <ArrayView key={name} name={name} arr={arr} ids={stepIds[name] || arr.map((_, i) => i)} touched={frame.touched?.[name] || []} big={fs} />
          ))}

          {tuples.length > 0 && (
            <div className="cs-vars">
              {tuples.map(([name, v]) => (
                <div className="cs-var" key={name}><span className="cs-var-name">{name}</span><span className="cs-var-val">{pyRepr(v)}</span></div>
              ))}
            </div>
          )}

          {scalars.length > 0 && (
            <div className="cs-vars">
              {scalars.map(([name, v]) => (
                <div className="cs-var" key={name}>
                  <span className="cs-var-name">{name}</span>
                  <span className="cs-var-val">{pyRepr(v)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="cs-stdout">
            <div className="cs-panel-label">출력 (stdout)</div>
            <pre>{frame.stdout || ''}</pre>
          </div>
          {result.error && <div className="cs-error">{result.error}</div>}
        </div>

        {/* 우: 코드 (현재 줄 하이라이트) */}
        <div className="cs-right">
          <div className="cs-panel-label">코드</div>
          <div className="cs-code">
            {lines.map((ln, i) => {
              const n = i + 1
              const active = n === frame.line
              return (
                <div key={i} className={`cs-line${active ? ' active' : ''}`}>
                  <span className="cs-gutter">{n}</span>
                  <span className="cs-src">{ln === '' ? ' ' : ln}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

        <div className="cs-help">
          <b>노란 줄</b> = 지금 실행되는 코드 · <b>노란 칸</b> = 지금 접근·비교 중인 값 · 칸이 자리를 옮기면 원소가 이동한 것입니다. 화면이 작으면 <b>⛶ 전체화면</b>으로 크게 보세요.
          <button className="cs-gloss-btn" onClick={() => setGloss((v) => !v)}>{gloss ? '용어 도움말 닫기 ▲' : '📘 용어 도움말 (i, j, range, 슬라이스 …)'}</button>
        </div>
        {gloss && (
          <div className="cs-gloss">
            {GLOSSARY.map((g) => (
              <div className="cs-gloss-item" key={g.t}>
                <code>{g.t}</code>
                <span>{g.d}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function ArrayView({ name, arr, ids, touched, big }) {
  const CAP = 64 // 임의 파이썬 결과라 폭 무제한 → 렌더 셀 수 캡
  const truncated = arr.length > CAP
  const shownArr = truncated ? arr.slice(0, CAP) : arr
  const shownIds = truncated ? ids.slice(0, CAP) : ids
  const numeric = shownArr.length > 0 && shownArr.every((x) => typeof x === 'number')
  let maxV = 1 // 스프레드(Math.max(...)) 대신 루프 — 대형 배열 RangeError 방지
  if (numeric) for (let i = 0; i < shownArr.length; i++) { const a = Math.abs(shownArr[i]); if (a > maxV) maxV = a }
  const tset = new Set(touched)
  const CELL = numeric ? (big ? 58 : 42) : (big ? 76 : 56)
  const barMax = big ? 92 : 50
  const els = shownIds
    .map((id, idx) => ({ id, idx, value: shownArr[idx], lift: tset.has(idx) }))
    .sort((a, b) => a.id - b.id)
  return (
    <div className="cs-array">
      <div className="cs-array-name">
        <code>{name}</code>
        {truncated && <span className="cs-array-more">외 {arr.length - CAP}개 생략</span>}
      </div>
      {arr.length === 0 ? (
        <div className="cs-cell empty">비어 있음 []</div>
      ) : (
        <div className={`cs-track${numeric ? ' tall' : ''}${big ? ' big' : ''}`} style={{ width: shownArr.length * CELL + 'px' }}>
          {els.map((el) => (
            <div
              key={el.id}
              className={`cs-el${el.lift ? ' touched' : ''}`}
              style={{ width: CELL + 'px', transform: `translateX(${el.idx * CELL}px) translateY(${el.lift ? (big ? -12 : -8) : 0}px)` }}
            >
              {numeric && <div className="cs-bar" style={{ height: `${14 + (Math.abs(el.value) / maxV) * barMax}px` }} />}
              <div className="cs-cell-val">{pyRepr(el.value)}</div>
              <div className="cs-cell-idx">{el.idx}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 단계 간 배열 비교로 원소 id 부여 (이동 추적) ──
function assignArrayIds(steps) {
  let counter = 0
  const prev = {} // name -> { values, ids }
  const out = []
  for (const step of steps) {
    const m = {}
    const present = new Set()
    for (const [name, val] of Object.entries(step.vars || {})) {
      if (!Array.isArray(val)) continue
      present.add(name)
      const ids = diffIds(prev[name], val, () => counter++)
      m[name] = ids
      prev[name] = { values: val.slice(), ids }
    }
    for (const name of Object.keys(prev)) if (!present.has(name)) delete prev[name]
    out.push(m)
  }
  return out
}

function valKey(v) {
  if (v && typeof v === 'object') return 'o' + JSON.stringify(v) // 배열/튜플(1회 직렬화)
  return typeof v + ':' + v // 타입 구분 (number 5 ≠ string '5')
}

function diffIds(prev, curr, fresh) {
  if (!prev) return curr.map(() => fresh())
  const pv = prev.values
  const pid = prev.ids
  const ids = new Array(curr.length)
  // 값별로 prev 인덱스를 오름차순 그룹화 → 같은 값은 등장 순서대로 매칭(교차 없는 최소 이동 = 깔끔한 슬라이드)
  const prevByVal = new Map()
  pv.forEach((v, j) => {
    const k = valKey(v)
    let g = prevByVal.get(k)
    if (!g) { g = []; prevByVal.set(k, g) }
    g.push(j)
  })
  const usedPrev = new Set()
  const cursor = new Map()
  for (let i = 0; i < curr.length; i++) {
    const k = valKey(curr[i])
    const g = prevByVal.get(k)
    const c = cursor.get(k) || 0
    if (g && c < g.length) { ids[i] = pid[g[c]]; usedPrev.add(g[c]); cursor.set(k, c + 1) }
  }
  // 값이 안 맞는 셀: 가장 가까운 미사용 prev id 재사용(제자리 값 변경 = 높이 전환), 없으면 새 원소
  for (let i = 0; i < curr.length; i++) {
    if (ids[i] !== undefined) continue
    let best = -1
    let bestDist = Infinity
    for (let j = 0; j < pv.length; j++) {
      if (usedPrev.has(j)) continue
      const d = Math.abs(j - i)
      if (d < bestDist) { bestDist = d; best = j }
    }
    if (best >= 0) { ids[i] = pid[best]; usedPrev.add(best) } else ids[i] = fresh()
  }
  return ids
}
