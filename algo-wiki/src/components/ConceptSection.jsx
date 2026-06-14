import { useMemo, useState } from 'react'
import { VIZ } from './viz/index.js'
import CodeBlock from './CodeBlock.jsx'
import CodeStepper from './viz/CodeStepper.jsx'
import { pyTrace } from '../pytrace/pyTrace.js'

// 개념(이론) 블록 렌더러. block.type 에 따라 적절한 요소로 변환한다.
export default function ConceptSection({ concept }) {
  return (
    <section className="concept">
      <h2 id="concept">개념 정리</h2>
      {concept.summary && (
        <p className="page-subtitle" style={{ fontSize: '15px', marginBottom: '6px' }}>
          {concept.summary}
        </p>
      )}
      <Blocks blocks={concept.blocks} />
    </section>
  )
}

// 블록 배열을 렌더링하는 재사용 컴포넌트 (개념 섹션 / 세부 주제 페이지 공용)
export function Blocks({ blocks }) {
  return (blocks || []).map((b, i) => <Block key={i} block={b} />)
}

// 코드 블록 + (실행 가능하면) 한 줄씩 실행 토글
function RunnableCode({ code, caption, lang }) {
  const [open, setOpen] = useState(false)
  const runnable = useMemo(() => {
    if (/\bclass\b/.test(code)) return false
    try { const r = pyTrace(code); return !r.error && r.steps.length > 2 } catch { return false }
  }, [code])
  return (
    <>
      {caption && <p className="code-caption" dangerouslySetInnerHTML={{ __html: caption }} />}
      <CodeBlock code={code} lang={lang} />
      {runnable && (
        <div className="run-toggle">
          <button className="reveal-btn run-btn" onClick={() => setOpen((v) => !v)}>
            {open ? '코드 실행 닫기 ▲' : '▶ 코드 한 줄씩 실행해 보기'}
          </button>
          {open && <CodeStepper code={code} />}
        </div>
      )}
    </>
  )
}

function Block({ block }) {
  switch (block.type) {
    case 'h3':
      return <h3>{block.text}</h3>
    case 'h4':
      return <h4>{block.text}</h4>
    case 'p':
      return <p dangerouslySetInnerHTML={{ __html: block.html }} />
    case 'list':
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
          ))}
        </ul>
      )
    case 'table':
      return (
        <table className="wiki-table">
          <thead>
            <tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />)}</tr>
            ))}
          </tbody>
        </table>
      )
    case 'callout':
      return (
        <div className={`callout ${block.tone || 'tip'}`}>
          <span className="callout-label">{block.tone === 'warn' ? '주의' : 'TIP'}</span>
          <span dangerouslySetInnerHTML={{ __html: block.html }} />
        </div>
      )
    case 'code':
      return <RunnableCode code={block.code} caption={block.caption} lang={block.lang || 'python'} />

    case 'viz': {
      const Comp = VIZ[block.component]
      return Comp ? <Comp {...(block.props || {})} /> : null
    }
    default:
      return null
  }
}
