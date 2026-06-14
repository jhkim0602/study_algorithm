// 작은 이진 트리 SVG (문제의 그림 표현용). tree = { v, l?, r? }
export default function MiniTree({ tree }) {
  if (!tree) return null

  const COL = 52
  const ROW = 56
  const R = 17
  const built = []
  const edges = []
  let col = 0

  // 중위 순회 순서로 x(열) 배정 → 노드가 겹치지 않게 배치
  function build(node, depth) {
    if (!node) return null
    const left = build(node.l, depth + 1)
    const me = { v: node.v, x: 30 + col * COL, y: 30 + depth * ROW }
    col += 1
    built.push(me)
    const right = build(node.r, depth + 1)
    if (left) edges.push([me, left])
    if (right) edges.push([me, right])
    return me
  }
  build(tree, 0)

  const width = 30 + col * COL
  const maxDepth = Math.max(...built.map((n) => (n.y - 30) / ROW))
  const height = 30 + (maxDepth + 1) * ROW

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="이진 트리 그림">
      {edges.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border-strong)" strokeWidth="2" />
      ))}
      {built.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={R} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="2" />
          <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central"
            fontSize="14" fontWeight="700" fill="var(--accent-text)">{n.v}</text>
        </g>
      ))}
    </svg>
  )
}
