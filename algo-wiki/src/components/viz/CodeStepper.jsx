import { useMemo } from 'react'
import { pyTrace, pyRepr } from '../../pytrace/pyTrace.js'
import { useStepPlayer, VizControls } from './StepPlayer.jsx'

// 코드 한 줄씩 실행 + 좌측 자료구조(메모리) 단계별 시각화
export default function CodeStepper({ code, title, defaultOpen = true }) {
  const result = useMemo(() => pyTrace(code), [code])
  const steps = result.steps && result.steps.length
    ? result.steps
    : [{ line: -1, vars: {}, touched: {}, stdout: result.error || '', depth: 0 }]
  const player = useStepPlayer(steps)
  const frame = player.frame || steps[0]
  const lines = code.split('\n')

  const entries = Object.entries(frame.vars || {})
  const arrays = entries.filter(([, v]) => Array.isArray(v))
  const scalars = entries.filter(([, v]) => !Array.isArray(v) && !(v && v.__t === 'tuple'))
  const tuples = entries.filter(([, v]) => v && v.__t === 'tuple')

  return (
    <div className="viz codestepper">
      <div className="viz-title">
        <span className="viz-tag">실행</span> 코드 실행 추적기{title ? ` — ${title}` : ''}
      </div>

      <VizControls player={player} />

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
            <ArrayView key={name} name={name} arr={arr} touched={frame.touched?.[name] || []} />
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
    </div>
  )
}

function ArrayView({ name, arr, touched }) {
  const numeric = arr.length > 0 && arr.every((x) => typeof x === 'number')
  const maxV = numeric ? Math.max(...arr.map((x) => Math.abs(x)), 1) : 1
  const tset = new Set(touched)
  return (
    <div className="cs-array">
      <div className="cs-array-name"><code>{name}</code></div>
      <div className="cs-cells">
        {arr.length === 0 && <div className="cs-cell empty">비어 있음 []</div>}
        {arr.map((v, i) => (
          <div key={i} className={`cs-cell${tset.has(i) ? ' touched' : ''}`}>
            {numeric && (
              <div className="cs-bar" style={{ height: `${20 + (Math.abs(v) / maxV) * 46}px` }} />
            )}
            <div className="cs-cell-val">{pyRepr(v)}</div>
            <div className="cs-cell-idx">{i}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
