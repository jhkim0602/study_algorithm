import { VIZ } from './viz/index.js'
import CodeBlock from './CodeBlock.jsx'

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
      return (
        <>
          {block.caption && <p className="code-caption" dangerouslySetInnerHTML={{ __html: block.caption }} />}
          <CodeBlock code={block.code} lang={block.lang || 'python'} />
        </>
      )
    case 'viz': {
      const Comp = VIZ[block.component]
      return Comp ? <Comp {...(block.props || {})} /> : null
    }
    default:
      return null
  }
}
