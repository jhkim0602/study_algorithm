import { useMemo, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'

hljs.registerLanguage('python', python)

// Python 코드 가독성 하이라이팅 블록 (복사 버튼 포함)
// highlightElement 재호출 경고를 피하려고 highlight()로 HTML을 만들어 주입한다.
export default function CodeBlock({ code, lang = 'python' }) {
  const [copied, setCopied] = useState(false)

  const html = useMemo(() => {
    try {
      return hljs.highlight(code, { language: lang }).value
    } catch {
      return escapeHtml(code)
    }
  }, [code, lang])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* 무시 */
    }
  }

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <span className="lang">{lang}</span>
        <button className="copy" onClick={copy}>{copied ? '복사됨 ✓' : '복사'}</button>
      </div>
      <pre>
        <code className={`language-${lang} hljs`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
}
