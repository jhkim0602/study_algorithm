// Ch09 트리 — 개념 + 문제 40 (객관식 81~100 + O/X 101~120)
// 원본: Ch07_Ch08_Ch09_문제만_문서형.pdf / Ch07_Ch08_Ch09_정답표_해설.pdf

export const ch09 = {
  id: 'ch09',
  slug: 'tree',
  title: 'Ch09 트리',
  subtitle: '트리 용어 · 순회 · 이진 검색 트리(BST)',
  concept: {
    summary:
      '트리(tree)는 계층적 관계를 표현하는 비선형 자료구조다. 하나의 루트(root)에서 시작해 부모-자식 ' +
      '관계로 가지를 뻗는다. 이진 트리는 각 노드가 최대 두 자식을 가지며, 이진 검색 트리(BST)는 ' +
      '"왼쪽 < 부모 < 오른쪽" 규칙으로 탐색을 빠르게 만든다.',
    blocks: [
      { type: 'h3', text: '트리 용어' },
      {
        type: 'list',
        items: [
          '<b>루트(root)</b> — 부모가 없는 단 하나의 최상위 노드.',
          '<b>리프(leaf)</b> — 자식이 없는 노드.',
          '<b>형제(sibling)</b> — 부모가 같은 노드.',
          '<b>높이(height)</b> — 루트에서 가장 먼 리프까지의 거리(가장 긴 경로의 길이). 노드 개수가 아니다.',
          '<b>차수(degree)</b> — 한 노드가 가진 자식의 수.',
        ],
      },
      { type: 'h3', text: '순회(traversal)' },
      {
        type: 'table',
        headers: ['순회', '방문 순서', '분류'],
        rows: [
          ['전위(preorder)', '노드 → 왼쪽 → 오른쪽', 'DFS'],
          ['중위(inorder)', '왼쪽 → 노드 → 오른쪽', 'DFS'],
          ['후위(postorder)', '왼쪽 → 오른쪽 → 노드', 'DFS'],
          ['레벨(level order)', '위 레벨부터 좌→우', 'BFS'],
        ],
      },
      {
        type: 'p',
        html:
          '<b>DFS(깊이 우선)</b>는 한 경로를 끝(리프)까지 내려갔다가 되돌아온다(전위·중위·후위). ' +
          '<b>BFS(너비 우선)</b>는 같은 레벨을 모두 방문한 뒤 다음 레벨로 내려간다(레벨 순회). ' +
          'BST를 <b>중위 순회</b>하면 키가 항상 오름차순으로 출력된다.',
      },
      { type: 'h4', text: '완전 이진 트리와 배열 표현' },
      {
        type: 'p',
        html:
          '<b>완전 이진 트리</b>는 마지막 레벨을 제외하고 꽉 차 있으며, 마지막 레벨은 왼쪽부터 차례로 채운다 ' +
          '(꽉 차 있을 필요는 없다). 배열로 표현하면 0-기반 인덱스 i 노드의 왼쪽 자식은 <code>2i+1</code>, ' +
          '오른쪽 자식은 <code>2i+2</code>, 부모는 <code>(i-1)//2</code>이다. 힙이 이 표현을 사용한다.',
      },
      { type: 'h4', text: '이진 검색 트리(BST)' },
      {
        type: 'p',
        html:
          'BST는 모든 노드에서 <b>왼쪽 서브트리의 키 &lt; 부모 &lt; 오른쪽 서브트리의 키</b>가 성립한다. ' +
          '탐색·삽입은 루트에서 시작해 비교 결과에 따라 <b>한 방향</b>으로만 내려간다. 균형이 잡히면 높이가 ' +
          '<code>log n</code> 수준이라 탐색이 O(log n)이지만, 정렬된 순서로 삽입하면 한쪽으로 치우쳐 ' +
          '리스트처럼 되어 O(n)까지 나빠진다.',
      },
      {
        type: 'p',
        html:
          'BST 삭제에서 가장 복잡한 경우는 <b>자식이 2개인 노드</b>를 지울 때다. 이때는 ' +
          '<b>왼쪽 서브트리의 최댓값(전임자)</b> 또는 <b>오른쪽 서브트리의 최솟값(후임자)</b>으로 대체해 ' +
          'BST 조건을 유지한다.',
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '아래 시각화에서 값을 삽입해 BST를 직접 만들고, 전위/중위/후위/레벨 순회를 애니메이션으로 ' +
          '확인해 보세요. 값을 탐색하면 비교 경로가 강조됩니다.',
      },
      { type: 'viz', component: 'BSTVisualizer' },
    ],
  },
  problems: [
    // ── 객관식 ──
    { no: 81, type: 'choice', prompt: '다음 중 트리(tree)의 특징으로 옳지 않은 것은?',
      options: ['루트 노드는 하나만 존재한다', '노드는 여러 자식을 가질 수 있다', '모든 노드는 반드시 부모를 가진다', '트리는 계층적 구조를 표현한다'],
      answer: 3, explanation: '루트 노드는 부모가 없으므로 모든 노드가 부모를 가진다는 설명은 틀리다.', concepts: ['트리 용어'] },
    { no: 82, type: 'choice', prompt: '트리의 높이(height)에 대한 설명으로 가장 적절한 것은?',
      options: ['전체 노드 수', '루트의 차수', '루트에서 가장 먼 리프까지의 거리', '리프 노드 개수'],
      answer: 3, explanation: '높이는 루트에서 가장 먼 리프까지의 거리로 본다.', concepts: ['트리 용어'] },
    { no: 83, type: 'choice', prompt: '다음 중 깊이 우선 탐색(DFS)에 해당하지 않는 것은?',
      options: ['preorder', 'inorder', 'postorder', 'level order'],
      answer: 4, explanation: 'level order는 너비 우선 탐색(BFS)에 해당한다.', concepts: ['순회', 'DFS/BFS'] },
    { no: 84, type: 'choice', prompt: '중위 순회(inorder)를 수행했을 때 오름차순 결과를 얻을 수 있는 자료구조는?',
      options: ['일반 트리', '힙', '이진 검색 트리', '큐'],
      answer: 3, explanation: 'BST를 중위 순회하면 키가 오름차순으로 나온다.', concepts: ['BST', '순회'] },
    { no: 85, type: 'choice', prompt: '다음 중 이진 검색 트리(BST)의 조건으로 옳은 것은?',
      options: ['왼쪽 서브트리의 모든 키는 부모보다 크다', '오른쪽 서브트리의 모든 키는 부모보다 작다', '왼쪽은 작고 오른쪽은 크다', '부모와 자식의 값은 항상 같다'],
      answer: 3, explanation: 'BST는 왼쪽이 작고 오른쪽이 큰 구조를 가진다.', concepts: ['BST'] },
    { no: 86, type: 'choice', prompt: '다음 중 BST 탐색 과정으로 옳은 것은?',
      options: ['현재 노드와 비교 후 양쪽 모두 탐색', '항상 왼쪽만 탐색', '비교 결과에 따라 한 방향만 탐색', '리프부터 탐색 시작'],
      answer: 3, explanation: 'BST 탐색은 비교 결과에 따라 왼쪽 또는 오른쪽 한 방향으로 이동한다.', concepts: ['BST', 'BST 탐색'] },
    { no: 87, type: 'choice', prompt: '균형 잡힌 BST에서 탐색 시간복잡도로 가장 적절한 것은?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 2, explanation: '균형이 잡힌 BST의 높이는 log n 수준이므로 탐색도 O(log n)이다.', concepts: ['BST', '시간복잡도'] },
    { no: 88, type: 'choice', prompt: '다음 값을 순서대로 BST에 삽입할 때 루트 노드는?',
      figure: '삽입 순서: [8, 3, 10, 1]',
      options: ['1', '3', '8', '10'],
      answer: 3, explanation: '첫 번째 삽입값 8이 루트가 된다.', concepts: ['BST', 'BST 삽입'] },
    { no: 89, type: 'choice', prompt: '다음 값을 BST에 순서대로 삽입했을 때 6의 부모 노드는?',
      figure: '삽입 순서: [8, 3, 10, 1, 6, 14]',
      options: ['1', '3', '8', '10'],
      answer: 2, explanation: '8의 왼쪽 3 아래에 6이 들어가므로 부모는 3이다.', concepts: ['BST', 'BST 삽입'] },
    { no: 90, type: 'choice', prompt: '다음 BST에서 key=14 탐색 시 비교 횟수는?',
      figure: '루트 8, 왼쪽 자식 3, 오른쪽 자식 10, 10의 오른쪽 자식 14',
      tree: { v: 8, l: { v: 3 }, r: { v: 10, r: { v: 14 } } },
      options: ['1', '2', '3', '4'],
      answer: 3, explanation: '14를 찾을 때 8, 10, 14를 비교하므로 3회이다.', concepts: ['BST', 'BST 탐색'] },
    { no: 91, type: 'choice', prompt: '다음 중 BST에서 가장 비효율적인 경우는?',
      options: ['균형 잡힌 상태', '무작위 삽입', '한쪽으로 치우친 상태', '완전 이진 트리 형태'],
      answer: 3, explanation: '한쪽으로 치우치면 리스트처럼 되어 탐색이 비효율적이다.', concepts: ['BST', '시간복잡도'] },
    { no: 92, type: 'choice', prompt: '다음 데이터를 순서대로 BST에 삽입할 때 트리 높이가 가장 높아질 가능성이 높은 것은?',
      options: ['5, 3, 7, 1, 9', '1, 2, 3, 4, 5', '4, 2, 6, 1, 3', '8, 4, 10, 2, 6'],
      answer: 2, explanation: '정렬된 순서로 삽입하면 한쪽으로 치우칠 가능성이 높다.', concepts: ['BST', 'BST 삽입'] },
    { no: 93, type: 'choice', prompt: 'BST를 중위 순회했을 때 결과가 다음과 같다면 루트가 될 수 있는 값은?',
      figure: '중위 순회 결과: [1, 3, 5, 7, 9]',
      options: ['1', '5', '9', '모두 가능'],
      answer: 4, explanation: '중위 순회 결과만으로는 루트를 하나로 특정할 수 없어 모두 가능하다.', concepts: ['BST', '순회'] },
    { no: 94, type: 'choice', prompt: 'BST에서 key=7을 탐색할 때 올바른 이동 순서는?',
      figure: '루트 10, 왼쪽 자식 5, 5의 오른쪽 자식 8, 8의 왼쪽 자식 7',
      tree: { v: 10, l: { v: 5, r: { v: 8, l: { v: 7 } } } },
      options: ['10 → 5 → 8 → 7', '10 → 8 → 7', '5 → 8 → 7', '10 → 5 → 7'],
      answer: 1, explanation: '7은 10보다 작아 5로, 5보다 커서 8로, 8보다 작아 7로 이동한다.', concepts: ['BST', 'BST 탐색'] },
    { no: 95, type: 'choice', prompt: 'BST에서 삽입(insert)의 특징으로 가장 적절한 것은?',
      options: ['항상 루트에 삽입', '정렬 후 삽입', '조건을 만족하는 위치를 찾아 삽입', '리프에만 삽입 불가'],
      answer: 3, explanation: 'BST 조건을 만족하는 위치를 찾아 삽입한다.', concepts: ['BST', 'BST 삽입'] },
    { no: 96, type: 'choice', prompt: '다음 중 BST 삭제 과정에서 가장 복잡한 경우는?',
      options: ['자식이 없는 노드 삭제', '자식이 1개인 노드 삭제', '자식이 2개인 노드 삭제', '루트가 아닌 노드 삭제'],
      answer: 3, explanation: '자식이 2개인 노드는 대체 노드를 찾아야 하므로 가장 복잡하다.', concepts: ['BST', 'BST 삭제'] },
    { no: 97, type: 'choice', prompt: 'BST에서 자식이 2개인 노드를 삭제할 때 일반적으로 사용하는 방법은?',
      options: ['임의 노드와 교환', '왼쪽 서브트리 최대값 또는 오른쪽 서브트리 최소값 사용', '항상 루트 삭제', '모든 노드 재정렬'],
      answer: 2, explanation: '왼쪽 서브트리의 최대값 또는 오른쪽 서브트리의 최소값으로 대체한다.', concepts: ['BST', 'BST 삭제'] },
    { no: 98, type: 'choice', prompt: '다음 중 완전 이진 트리의 특징으로 가장 적절한 것은?',
      options: ['마지막 레벨은 아무 순서로 채워짐', '노드는 오른쪽부터 채워짐', '왼쪽부터 차례대로 채워짐', '모든 노드가 반드시 두 자식을 가짐'],
      answer: 3, explanation: '완전 이진 트리는 마지막 레벨을 왼쪽부터 차례로 채운다.', concepts: ['완전 이진 트리'] },
    { no: 99, type: 'choice', prompt: '완전 이진 트리를 배열로 표현할 때 부모 인덱스가 i이면 왼쪽 자식 인덱스는?',
      options: ['i+1', '2i', '2i + 1', '2i + 2'],
      answer: 3, explanation: '0번 인덱스 배열 표현에서는 왼쪽 자식 인덱스가 2i + 1이다.', concepts: ['완전 이진 트리', '배열 표현'] },
    { no: 100, type: 'choice', prompt: '다음 중 BST의 장점으로 가장 적절한 것은?',
      options: ['항상 O(1) 탐색 가능', '중위 순회 시 정렬 결과 획득 가능', '메모리를 사용하지 않음', '모든 경우 O(log n) 보장'],
      answer: 2, explanation: 'BST는 중위 순회로 정렬된 결과를 얻을 수 있다.', concepts: ['BST', '순회'] },
    // ── O/X ──
    { no: 101, type: 'ox', prompt: '트리에서 루트(root) 노드는 하나만 존재한다.',
      answer: 'O', explanation: '트리에는 루트가 하나 존재한다.', concepts: ['트리 용어'] },
    { no: 102, type: 'ox', prompt: '리프(leaf) 노드는 자식 노드가 존재하지 않는 노드이다.',
      answer: 'O', explanation: '리프는 자식이 없는 노드이다.', concepts: ['트리 용어'] },
    { no: 103, type: 'ox', prompt: '형제(sibling) 노드는 부모가 같은 노드를 의미한다.',
      answer: 'O', explanation: '형제 노드는 같은 부모를 가진 노드이다.', concepts: ['트리 용어'] },
    { no: 104, type: 'ox', prompt: '트리의 높이(height)는 전체 노드의 개수를 의미한다.',
      answer: 'X', explanation: '높이는 노드 개수가 아니라 가장 긴 경로의 길이이다.', concepts: ['트리 용어'] },
    { no: 105, type: 'ox', prompt: 'BFS는 낮은 레벨부터 차례대로 탐색하는 방법이다.',
      answer: 'O', explanation: 'BFS는 레벨 순서로 탐색한다.', concepts: ['DFS/BFS'] },
    { no: 106, type: 'ox', prompt: 'DFS는 리프까지 우선 내려가는 방식의 탐색이다.',
      answer: 'O', explanation: 'DFS는 한 경로를 깊게 내려간 뒤 되돌아온다.', concepts: ['DFS/BFS'] },
    { no: 107, type: 'ox', prompt: 'preorder 순회는 현재 노드를 먼저 방문한다.',
      answer: 'O', explanation: 'preorder는 노드 방문 후 왼쪽/오른쪽을 방문한다.', concepts: ['순회'] },
    { no: 108, type: 'ox', prompt: 'inorder 순회는 왼쪽 → 노드 → 오른쪽 순서로 방문한다.',
      answer: 'O', explanation: 'inorder는 왼쪽, 현재 노드, 오른쪽 순서이다.', concepts: ['순회'] },
    { no: 109, type: 'ox', prompt: 'postorder 순회는 현재 노드를 가장 마지막에 방문한다.',
      answer: 'O', explanation: 'postorder는 자식들을 먼저 방문하고 현재 노드를 마지막에 방문한다.', concepts: ['순회'] },
    { no: 110, type: 'ox', prompt: '이진 트리는 각 노드가 최대 두 개의 자식을 가질 수 있다.',
      answer: 'O', explanation: '이진 트리의 각 노드는 최대 두 자식을 가진다.', concepts: ['이진 트리'] },
    { no: 111, type: 'ox', prompt: '완전 이진 트리는 마지막 레벨까지 반드시 모두 채워져 있어야 한다.',
      answer: 'X', explanation: '완전 이진 트리는 마지막 레벨이 꽉 차지 않아도 된다.', concepts: ['완전 이진 트리'] },
    { no: 112, type: 'ox', prompt: '완전 이진 트리는 같은 레벨에서 왼쪽부터 차례대로 노드가 채워진다.',
      answer: 'O', explanation: '완전 이진 트리는 같은 레벨에서 왼쪽부터 채운다.', concepts: ['완전 이진 트리'] },
    { no: 113, type: 'ox', prompt: '이진 검색 트리(BST)에서는 왼쪽 서브트리의 모든 키값이 부모보다 작아야 한다.',
      answer: 'O', explanation: 'BST의 왼쪽 서브트리는 부모보다 작은 값을 가진다.', concepts: ['BST'] },
    { no: 114, type: 'ox', prompt: '이진 검색 트리(BST)에서는 오른쪽 서브트리의 모든 키값이 부모보다 커야 한다.',
      answer: 'O', explanation: 'BST의 오른쪽 서브트리는 부모보다 큰 값을 가진다.', concepts: ['BST'] },
    { no: 115, type: 'ox', prompt: '이진 검색 트리를 중위 순회하면 키값이 오름차순으로 출력된다.',
      answer: 'O', explanation: 'BST의 중위 순회 결과는 오름차순이다.', concepts: ['BST', '순회'] },
    { no: 116, type: 'ox', prompt: 'BST 탐색에서는 비교 결과에 따라 한 방향의 서브트리만 탐색한다.',
      answer: 'O', explanation: '비교 결과에 따라 한쪽 서브트리만 탐색한다.', concepts: ['BST', 'BST 탐색'] },
    { no: 117, type: 'ox', prompt: '균형 잡힌 BST의 탐색 시간복잡도는 일반적으로 O(log n)이다.',
      answer: 'O', explanation: '균형 잡힌 BST의 탐색은 일반적으로 O(log n)이다.', concepts: ['BST', '시간복잡도'] },
    { no: 118, type: 'ox', prompt: 'BST가 한쪽으로 치우치면 탐색 시간복잡도는 O(n)이 될 수 있다.',
      answer: 'O', explanation: '치우친 BST는 높이가 n에 가까워져 O(n)이 될 수 있다.', concepts: ['BST', '시간복잡도'] },
    { no: 119, type: 'ox', prompt: 'BST에서 자식 노드가 2개인 노드를 삭제하는 경우가 가장 복잡하다.',
      answer: 'O', explanation: '자식이 2개인 노드 삭제가 가장 복잡하다.', concepts: ['BST', 'BST 삭제'] },
    { no: 120, type: 'ox', prompt: 'BST에서 자식이 2개인 노드를 삭제할 때 일반적으로 왼쪽 서브트리의 최대값 또는 오른쪽 서브트리의 최소값을 사용한다.',
      answer: 'O', explanation: '일반적으로 전임자 또는 후임자를 대체값으로 사용한다.', concepts: ['BST', 'BST 삭제'] },
  ],
}
