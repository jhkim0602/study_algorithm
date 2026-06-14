import { useState } from 'react'
import CodeBlock from './CodeBlock.jsx'
import MiniTree from './MiniTree.jsx'
import ProblemDetail from './ProblemDetail.jsx'
import CodeStepper from './viz/CodeStepper.jsx'
import { TYPE_LABEL } from '../data/index.js'

const OPT_NUM = ['①', '②', '③', '④']

// 문제 카드 한 개.
// - 풀이 모드: 보기를 클릭하면 즉시 채점(selected/onSelect/onReset)
// - 읽기 모드: '정답·해설 보기' 토글(revealed/onToggle)
export default function ProblemCard({
  chapterId, problem, chapterLabel,
  revealed, onToggle,
  selected, onSelect, onReset,
}) {
  const { no, type, prompt, code, figure, tree, options, answer, explanation, concepts, detail } = problem
  const isChoice = type === 'choice' || type === 'code'

  const [runOpen, setRunOpen] = useState(false)
  const answered = selected != null && selected !== undefined
  const show = revealed || answered // 정답/해설 노출 여부
  const isCorrect = answered && selected === answer
  const answerLabel = isChoice ? `${OPT_NUM[answer - 1]} ${options[answer - 1]}` : answer

  const pick = (val) => { if (!answered) onSelect?.(no, val) }

  return (
    <article className="problem-card" id={`${chapterId}-${no}`}>
      <div className="problem-head">
        {chapterLabel && <span className="badge chapter">{chapterLabel}</span>}
        <span className="problem-no">{no}</span>
        <span className={`badge ${type}`}>{TYPE_LABEL[type]}</span>
        {problem.topic && <span className="badge">{problem.topic}</span>}
        {answered && (
          <span className={`solve-tag ${isCorrect ? 'ok' : 'no'}`}>{isCorrect ? '정답 ✓' : '오답 ✗'}</span>
        )}
      </div>

      <p className="problem-prompt">{prompt}</p>

      {figure && (
        <div className="problem-figure">
          <span className="fig-label">그림</span>{figure}
        </div>
      )}
      {tree && (
        <div className="problem-figure" style={{ borderStyle: 'solid' }}>
          <MiniTree tree={tree} />
        </div>
      )}
      {code && <CodeBlock code={code} lang="python" />}

      {type === 'code' && (
        <div className="run-toggle">
          <button className="reveal-btn run-btn" onClick={() => setRunOpen((v) => !v)}>
            {runOpen ? '코드 실행 닫기 ▲' : '▶ 코드 한 줄씩 실행해 보기'}
          </button>
          {runOpen && (
            <CodeStepper code={problem.runCode || code} title={problem.topic} />
          )}
        </div>
      )}

      {isChoice && (
        <ol className="options">
          {options.map((opt, i) => {
            const val = i + 1
            const correct = show && val === answer
            const wrongPick = answered && selected === val && selected !== answer
            return (
              <li
                key={i}
                className={`option${answered ? ' locked' : ' clickable'}${correct ? ' correct' : ''}${wrongPick ? ' wrong' : ''}`}
                onClick={() => pick(val)}
                role="button"
                tabIndex={answered ? -1 : 0}
                onKeyDown={(e) => { if (!answered && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(val) } }}
              >
                <span className="opt-num">{OPT_NUM[i]}</span>
                <span className="opt-text">{opt}</span>
                {correct && <span className="opt-check">정답</span>}
                {wrongPick && <span className="opt-mine">내 답</span>}
              </li>
            )
          })}
        </ol>
      )}

      {type === 'ox' && (
        <div className="ox-options">
          {['O', 'X'].map((v) => {
            const correct = show && answer === v
            const wrongPick = answered && selected === v && selected !== answer
            return (
              <button
                key={v}
                className={`ox-chip${answered ? '' : ' clickable'}${correct ? ' correct' : ''}${wrongPick ? ' wrong' : ''}`}
                onClick={() => pick(v)}
                disabled={answered}
              >
                {v}
              </button>
            )
          })}
        </div>
      )}

      {answered && (
        <div className={`solve-feedback ${isCorrect ? 'ok' : 'no'}`}>
          {isCorrect ? '정답입니다! ✓' : <>오답입니다. 정답은 <b>{answerLabel}</b> 입니다.</>}
          <button className="solve-reset" onClick={() => onReset?.(no)}>다시 풀기</button>
        </div>
      )}

      <div className="reveal">
        {!answered && (
          <button className="reveal-btn" onClick={() => onToggle(no)}>
            {revealed ? '정답·해설 접기 ▲' : '정답·해설 보기 ▼'}
          </button>
        )}
        {show && (
          <div className="answer-box">
            <div className="ans-line">정답: <span className="ans-val">{answerLabel}</span></div>
            <div className="expl">{explanation}</div>
            <ProblemDetail detail={detail} />
            {concepts?.length > 0 && (
              <div className="concept-tags">
                <span className="ct-label">필요 개념</span>
                {concepts.map((c) => (
                  <span key={c} className="concept-tag">{c}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
