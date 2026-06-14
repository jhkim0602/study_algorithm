import SortVisualizer from './SortVisualizer.jsx'
import StringSearchVisualizer from './StringSearchVisualizer.jsx'
import LinkedListVisualizer from './LinkedListVisualizer.jsx'
import BSTVisualizer from './BSTVisualizer.jsx'
// 세부 개념 시각화
import ComplexityChart from './ComplexityChart.jsx'
import StabilityViz from './StabilityViz.jsx'
import BoyerMooreViz from './BoyerMooreViz.jsx'
import BFvsKMPViz from './BFvsKMPViz.jsx'
import ListCostViz from './ListCostViz.jsx'
import CursorListViz from './CursorListViz.jsx'
import HeapArrayViz from './HeapArrayViz.jsx'
import TraversalCompareViz from './TraversalCompareViz.jsx'
import BSTShapeViz from './BSTShapeViz.jsx'

// 개념 데이터의 { type: 'viz', component: '...' } 를 실제 컴포넌트로 매핑
export const VIZ = {
  SortVisualizer,
  StringSearchVisualizer,
  LinkedListVisualizer,
  BSTVisualizer,
  ComplexityChart,
  StabilityViz,
  BoyerMooreViz,
  BFvsKMPViz,
  ListCostViz,
  CursorListViz,
  HeapArrayViz,
  TraversalCompareViz,
  BSTShapeViz,
}
