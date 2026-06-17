// 문제의 상세 풀이(detail) 렌더러. detail이 없으면 아무것도 그리지 않는다.
// detail = { summary, reasoning[], optionAnalysis[{label,verdict,why}], keyConcepts[], pitfall }
export default function ProblemDetail({ detail }) {
  if (!detail) return null
  const { summary, reasoning, optionAnalysis, keyConcepts, pitfall } = detail

  return (
    <div className="detail">
      {summary && <p className="d-summary" dangerouslySetInnerHTML={{ __html: summary }} />}

      {reasoning?.length > 0 && (
        <ol className="d-steps">
          {reasoning.map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
      )}

      {optionAnalysis?.length > 0 && (
        <div className="d-options">
          <div className="d-options-label">보기 분석</div>
          {optionAnalysis.map((o, i) => (
            <div key={i} className={`d-opt ${o.verdict === '정답' ? 'ok' : 'no'}`}>
              <span className="d-opt-label">{o.label}</span>
              <span className={`d-verdict ${o.verdict === '정답' ? 'ok' : 'no'}`}>{o.verdict}</span>
              <span className="d-opt-why" dangerouslySetInnerHTML={{ __html: o.why }} />
            </div>
          ))}
        </div>
      )}

      {keyConcepts?.length > 0 && (
        <div className="d-keys">
          <div className="d-options-label">핵심 개념</div>
          <ul>
            {keyConcepts.map((k, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: k }} />
            ))}
          </ul>
        </div>
      )}

      {pitfall && (
        <div className="d-pitfall">
          <span className="d-pitfall-label">⚠ 함정</span>
          <span dangerouslySetInnerHTML={{ __html: pitfall }} />
        </div>
      )}
    </div>
  )
}
