// Ch08 리스트 — 세부 학습 페이지 (배열/단순/이중/원형/커서)
// 원본 챕터: src/data/ch08-list.js

export const subtopics = [
  // ─────────────────────────────────────────────────────────────
  // 1) 배열 리스트
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'array',
    title: '배열 리스트',
    summary:
      '배열 리스트(array list)는 원소를 연속된 메모리 공간에 차곡차곡 저장하는 리스트 구현이다. ' +
      '시작 주소와 인덱스만 있으면 곱셈·덧셈 한 번으로 원소의 주소를 계산할 수 있어 임의 접근이 O(1)이다. ' +
      '대신 중간에 끼워넣거나 빼낼 때는 뒤따르는 원소들을 통째로 밀거나 당겨야 해서 O(n)의 데이터 이동이 발생한다.',
    conceptTags: ['배열 리스트'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 연속 메모리와 주소 계산' },
      {
        type: 'p',
        html:
          '배열은 같은 크기의 원소를 <b>물리적으로 연속된 메모리</b>에 배치한다. 원소 하나의 크기가 ' +
          '<code>w</code>바이트이고 배열의 시작 주소가 <code>base</code>라면, <code>i</code>번째 원소의 주소는 ' +
          '<code>base + i × w</code>로 한 번에 계산된다. 인덱스를 알면 앞에서부터 따라갈 필요 없이 ' +
          '곧바로 주소가 나오므로 <b>임의 접근(random access)이 O(1)</b>이다. 이것이 배열 리스트의 ' +
          '가장 큰 장점이자, 연결 리스트와 구분되는 결정적 차이다.',
      },
      {
        type: 'list',
        items: [
          '<b>임의 접근 O(1)</b> — <code>a[i]</code>는 주소 산술로 즉시 접근한다.',
          '<b>맨 뒤 추가(append) 분할상환 O(1)</b> — 빈자리가 있으면 O(1), 동적 배열이 가득 차 재할당(보통 2배)하면 그 순간만 O(n)이지만 분할상환하면 O(1)이다.',
          '<b>앞/중간 삽입·삭제 O(n)</b> — 삽입 위치 뒤의 모든 원소를 한 칸씩 이동해야 한다.',
          '<b>캐시 친화적</b> — 원소가 메모리에 붙어 있어 순회 시 CPU 캐시 적중률이 높다.',
        ],
      },
      { type: 'h3', text: '동작 과정: 중간 삽입과 삭제' },
      {
        type: 'p',
        html:
          '인덱스 <code>k</code>에 새 값을 <b>삽입</b>하려면, 먼저 <code>k</code>부터 끝까지의 원소를 ' +
          '오른쪽으로 한 칸씩 밀어 빈자리를 만든 뒤 그 자리에 값을 넣는다. 뒤쪽 원소를 먼저 옮겨야 ' +
          '덮어쓰지 않으므로 <b>끝에서부터 역순으로</b> 이동한다. <code>k</code>가 맨 앞(0)이면 거의 ' +
          '모든 원소(약 n개)를 이동해야 하므로 최악 O(n)이다.',
      },
      {
        type: 'list',
        items: [
          '삽입 단계: ① 용량 확인(필요 시 재할당) → ② 인덱스 k~n-1을 한 칸 뒤로 이동 → ③ a[k]에 값 대입 → ④ 크기 +1.',
          '삭제 단계: ① 인덱스 k의 값 제거 → ② 인덱스 k+1~n-1을 한 칸 앞으로 이동 → ③ 크기 -1.',
          '이동량은 삭제/삽입 위치에 따라 결정된다. 맨 앞은 O(n), 맨 뒤는 O(1).',
        ],
      },
      {
        type: 'code',
        code:
          'class ArrayList:\n' +
          '    def __init__(self, capacity=4):\n' +
          '        self._data = [None] * capacity   # 내부 고정 배열\n' +
          '        self._size = 0                    # 실제 원소 개수\n' +
          '\n' +
          '    def __len__(self):\n' +
          '        return self._size\n' +
          '\n' +
          '    def get(self, i):                     # 임의 접근 O(1)\n' +
          '        if not 0 <= i < self._size:\n' +
          '            raise IndexError(i)\n' +
          '        return self._data[i]\n' +
          '\n' +
          '    def _grow(self):                      # 가득 차면 2배로 재할당\n' +
          '        new = [None] * (2 * len(self._data))\n' +
          '        for i in range(self._size):\n' +
          '            new[i] = self._data[i]\n' +
          '        self._data = new\n' +
          '\n' +
          '    def insert(self, k, value):           # 중간 삽입 O(n)\n' +
          '        if not 0 <= k <= self._size:\n' +
          '            raise IndexError(k)\n' +
          '        if self._size == len(self._data):\n' +
          '            self._grow()\n' +
          '        for i in range(self._size, k, -1): # 뒤에서부터 한 칸씩 이동\n' +
          '            self._data[i] = self._data[i - 1]\n' +
          '        self._data[k] = value\n' +
          '        self._size += 1\n' +
          '\n' +
          '    def append(self, value):              # 맨 뒤 추가 (분할상환 O(1))\n' +
          '        self.insert(self._size, value)\n' +
          '\n' +
          '    def delete(self, k):                  # 중간 삭제 O(n)\n' +
          '        if not 0 <= k < self._size:\n' +
          '            raise IndexError(k)\n' +
          '        removed = self._data[k]\n' +
          '        for i in range(k, self._size - 1):  # 앞으로 한 칸씩 당김\n' +
          '            self._data[i] = self._data[i + 1]\n' +
          '        self._data[self._size - 1] = None\n' +
          '        self._size -= 1\n' +
          '        return removed',
        caption: '동적 배열 기반 리스트의 임의 접근·중간 삽입·삭제 구현(재할당 포함)',
      },
      { type: 'h3', text: '시간복잡도 표' },
      {
        type: 'table',
        headers: ['연산', '배열 리스트', '연결 리스트', '비고'],
        rows: [
          ['인덱스 접근 a[i]', 'O(1)', 'O(n)', '배열은 주소 산술, 리스트는 순차 추적'],
          ['맨 뒤 추가(append)', 'O(1)*', 'O(1)†', '*동적 배열 분할상환, †tail 포인터 있을 때'],
          ['맨 앞 삽입/삭제', 'O(n)', 'O(1)', '배열은 전체 이동, 리스트는 head 변경'],
          ['중간 삽입/삭제', 'O(n)', 'O(1)‡', '‡위치(노드)를 이미 알고 있을 때의 링크 갱신 비용'],
          ['값 탐색(정렬 안 됨)', 'O(n)', 'O(n)', '둘 다 순차 비교'],
          ['메모리 오버헤드', '낮음', '높음', '리스트는 노드마다 포인터 저장'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '“삽입·삭제는 연결 리스트가 무조건 빠르다”는 흔한 오해다. 연결 리스트의 O(1)은 ' +
          '<b>이미 그 위치의 노드를 손에 쥐고 있을 때</b>의 링크 갱신 비용이다. 인덱스만 주어지고 ' +
          '노드를 찾아가야 한다면 탐색에 O(n)이 들어 결국 전체는 O(n)이 된다.',
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '동적 배열의 append가 항상 O(1)인 것은 아니다. 용량이 가득 차면 더 큰 배열을 새로 ' +
          '할당하고 모든 원소를 복사하므로 그 순간은 O(n)이다. 다만 2배씩 키우는 전략에서는 ' +
          '여러 번의 append에 걸쳐 평균을 내면 <b>분할상환 O(1)</b>이 된다.',
      },
      { type: 'h3', text: '배열 vs 연결 리스트 — 어느 쪽을 고를까' },
      {
        type: 'list',
        items: [
          '인덱스로 자주 읽고, 끝에서 주로 넣고 빼면 → <b>배열 리스트</b>가 유리(접근 O(1), 캐시 친화).',
          '앞/중간에서 삽입·삭제가 잦고, 인덱스 접근은 드물면 → <b>연결 리스트</b>가 유리(이동 없음).',
          '메모리가 빠듯하거나 데이터가 작으면 → 포인터 오버헤드가 없는 <b>배열</b>이 유리.',
          '크기 변동이 매우 크고 예측이 어려우면 → 노드 단위로 늘어나는 <b>연결 리스트</b>가 재할당 부담이 없다.',
        ],
      },
      {
        type: 'p',
        html:
          '아래 시각화로 같은 연산을 배열과 연결 리스트에서 수행할 때 발생하는 비용 차이(데이터 이동 vs 링크 변경)를 ' +
          '직접 비교해 보세요.',
      },
      { type: 'viz', component: 'ListCostViz' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2) 단순 연결 리스트
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'singly',
    title: '단순 연결 리스트',
    summary:
      '단순 연결 리스트(singly linked list)는 각 노드가 데이터와 “다음 노드”를 가리키는 next 링크 하나만 가지는 구조다. ' +
      'head 포인터에서 출발해 next를 따라 한 방향으로만 이동하며, 마지막 노드의 next는 None이다. ' +
      '임의 접근은 못 하지만(O(n) 순차 탐색), 위치를 아는 곳의 삽입·삭제는 링크만 바꿔 처리한다.',
    conceptTags: [
      '단순 연결 리스트',
      '노드 구조',
      '순차 탐색',
      '삽입/삭제 연산',
      '포인터 변수',
      'predecessor/successor',
      '연결 리스트',
    ],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 노드와 링크' },
      {
        type: 'p',
        html:
          '연결 리스트의 기본 단위는 <b>노드(node)</b>다. 각 노드는 값을 담는 <code>data</code>와 ' +
          '다음 노드를 가리키는 포인터 <code>next</code>로 이루어진다. 노드들은 메모리 여기저기에 ' +
          '흩어져 있어도 next 링크로 줄줄이 꿰어져 하나의 논리적 순서를 이룬다. 리스트의 첫 노드를 ' +
          '가리키는 포인터가 <code>head</code>이고, 탐색·삽입 도중 “지금 보고 있는 노드”를 가리키는 ' +
          '작업용 포인터가 <code>current</code>다. 빈 리스트는 <code>head = None</code>이며, 마지막(tail) ' +
          '노드의 <code>next</code>는 항상 <code>None</code>이다.',
      },
      { type: 'h4', text: 'predecessor와 successor' },
      {
        type: 'p',
        html:
          '어떤 노드를 기준으로 <b>바로 앞 노드를 predecessor(선행 노드)</b>, <b>바로 뒤 노드를 ' +
          'successor(후속 노드)</b>라 한다. 단순 연결 리스트는 next만 있어서 successor는 ' +
          '<code>cur.next</code>로 즉시 알 수 있지만, predecessor는 알 수 없다. 어떤 노드의 ' +
          'predecessor를 알려면 <b>head부터 다시 순차 탐색</b>해 “다음이 그 노드인 노드”를 ' +
          '찾아야 한다. 이 비대칭성이 remove_first와 remove_last의 비용 차이를 만든다.',
      },
      { type: 'h3', text: '동작 과정: 탐색·삽입·삭제' },
      {
        type: 'list',
        items: [
          '<b>순차 탐색(search)</b> — current를 head로 두고 next를 따라가며 값을 비교한다. 최악 O(n).',
          '<b>맨 앞 삽입(prepend)</b> — 새 노드의 next를 기존 head로, head를 새 노드로. O(1).',
          '<b>중간 삽입</b> — predecessor p를 찾은 뒤 new.next = p.next; p.next = new. 탐색 제외 시 링크 갱신은 O(1).',
          '<b>remove_first</b> — head = head.next 한 줄. predecessor가 필요 없으므로 O(1).',
          '<b>remove_last</b> — tail의 predecessor를 head부터 찾아야 해서 O(n). 찾은 뒤 prev.next = None.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '<code>remove_first()</code>는 <code>head = head.next</code>로 끝나 <b>O(1)</b>이지만, ' +
          '<code>remove_last()</code>는 마지막 노드의 <b>predecessor를 head부터 순차 탐색</b>해야 하므로 ' +
          '<b>O(n)</b>이다. 같은 “삭제”라도 위치에 따라 비용이 크게 다르다. tail 포인터를 따로 두어도 ' +
          'tail의 “이전” 노드는 단순 리스트에서 바로 알 수 없어 remove_last는 여전히 O(n)이다.',
      },
      {
        type: 'code',
        code:
          'class Node:\n' +
          '    def __init__(self, data, next=None):\n' +
          '        self.data = data\n' +
          '        self.next = next            # 다음 노드(successor)\n' +
          '\n' +
          'class SinglyLinkedList:\n' +
          '    def __init__(self):\n' +
          '        self.head = None            # 첫 노드 포인터\n' +
          '        self.size = 0\n' +
          '\n' +
          '    def is_empty(self):\n' +
          '        return self.head is None\n' +
          '\n' +
          '    def search(self, target):       # 순차 탐색 O(n)\n' +
          '        current = self.head\n' +
          '        while current is not None:\n' +
          '            if current.data == target:\n' +
          '                return current\n' +
          '            current = current.next  # next()=current를 다음으로 이동\n' +
          '        return None\n' +
          '\n' +
          '    def add_first(self, data):      # 맨 앞 삽입 O(1)\n' +
          '        self.head = Node(data, self.head)\n' +
          '        self.size += 1\n' +
          '\n' +
          '    def insert_after(self, pred, data):  # predecessor 뒤에 삽입\n' +
          '        pred.next = Node(data, pred.next)\n' +
          '        self.size += 1\n' +
          '\n' +
          '    def remove_first(self):         # 맨 앞 삭제 O(1)\n' +
          '        if self.head is None:\n' +
          '            raise IndexError("empty list")\n' +
          '        removed = self.head\n' +
          '        self.head = self.head.next  # head를 successor로 이동\n' +
          '        self.size -= 1\n' +
          '        return removed.data\n' +
          '\n' +
          '    def remove_last(self):          # 맨 뒤 삭제 O(n)\n' +
          '        if self.head is None:\n' +
          '            raise IndexError("empty list")\n' +
          '        if self.head.next is None:  # 노드가 하나뿐\n' +
          '            data = self.head.data\n' +
          '            self.head = None\n' +
          '            self.size -= 1\n' +
          '            return data\n' +
          '        prev = self.head            # tail의 predecessor를 순차 탐색\n' +
          '        while prev.next.next is not None:\n' +
          '            prev = prev.next\n' +
          '        data = prev.next.data\n' +
          '        prev.next = None            # tail 분리\n' +
          '        self.size -= 1\n' +
          '        return data',
        caption: 'Node 클래스와 단순 연결 리스트의 탐색·삽입·삭제 구현',
      },
      { type: 'h3', text: '시간복잡도 표' },
      {
        type: 'table',
        headers: ['연산', '시간복잡도', '비고'],
        rows: [
          ['search(값 탐색)', 'O(n)', 'head부터 순차 비교'],
          ['add_first / remove_first', 'O(1)', 'head만 갱신, predecessor 불필요'],
          ['add_last(tail 포인터 있음)', 'O(1)', 'tail.next에 연결 후 tail 이동'],
          ['remove_last', 'O(n)', 'tail의 predecessor를 순차 탐색'],
          ['중간 삽입/삭제(노드를 알 때)', 'O(1)', '링크만 갱신, 탐색 비용 별도'],
          ['인덱스 접근 a[i]', 'O(n)', '주소 산술 불가, 순차 추적'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '노드가 하나뿐이면 그 노드는 <b>head이자 tail</b>이다. 또 삭제·삽입 시 ' +
          '“리스트가 비었는가”, “대상이 첫 노드인가”, “마지막 노드인가” 같은 <b>경계 조건</b>을 ' +
          '꼭 따로 처리해야 한다. 이런 분기를 줄이려고 더미(dummy) 헤드 노드를 쓰기도 한다.',
      },
      {
        type: 'p',
        html:
          '아래 시각화에서 노드를 직접 삽입·삭제하며 head/next 포인터가 어떻게 바뀌는지, ' +
          'remove_last가 왜 순차 탐색을 필요로 하는지 단계별로 확인해 보세요.',
      },
      { type: 'viz', component: 'LinkedListVisualizer' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3) 이중 연결 리스트
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'doubly',
    title: '이중 연결 리스트',
    summary:
      '이중 연결 리스트(doubly linked list)는 각 노드가 다음 노드 next뿐 아니라 이전 노드 prev까지 가리키는 구조다. ' +
      '양방향 탐색이 가능하고, 어떤 노드의 predecessor를 즉시 알 수 있어 그 노드 자체를 O(1)에 삭제할 수 있다. ' +
      '대신 노드마다 포인터가 하나 더 늘고, 삽입·삭제 때 양쪽 링크를 모두 갱신해야 한다.',
    conceptTags: ['이중 연결 리스트'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 양방향 링크' },
      {
        type: 'p',
        html:
          '단순 연결 리스트의 약점은 “뒤로 못 간다”는 것이다. 이중 연결 리스트는 각 노드에 ' +
          '<code>prev</code> 포인터를 추가해 <b>predecessor를 O(1)에 알 수 있게</b> 한다. 그 덕분에 ' +
          '주어진 노드 <code>x</code>만 있으면 head부터 다시 찾지 않고도 <code>x.prev</code>와 ' +
          '<code>x.next</code>를 이어 붙여 <code>x</code>를 바로 떼어낼 수 있다. 양 끝 처리를 단순화하려고 ' +
          '<b>head/tail 더미(sentinel) 노드</b>를 두는 구현이 흔하다.',
      },
      {
        type: 'list',
        items: [
          '<b>양방향 탐색</b> — next로 앞으로, prev로 뒤로 자유롭게 이동.',
          '<b>노드 자체 삭제 O(1)</b> — 노드를 손에 쥐고 있으면 prev/next만 갱신해 제거.',
          '<b>맨 뒤 삽입·삭제 O(1)</b> — tail(또는 tail 더미)의 prev로 predecessor 즉시 확보.',
          '<b>비용</b> — 노드마다 포인터 1개 추가, 모든 삽입·삭제에서 링크 2쌍(총 4개 방향) 갱신.',
        ],
      },
      { type: 'h3', text: '동작 과정: 삽입과 삭제의 링크 갱신' },
      {
        type: 'p',
        html:
          '노드 <code>p</code>와 그 successor <code>q = p.next</code> 사이에 새 노드 <code>n</code>을 ' +
          '끼우려면 네 개의 링크를 갱신한다: <code>n.prev = p</code>, <code>n.next = q</code>, ' +
          '<code>p.next = n</code>, <code>q.prev = n</code>. 순서를 잘못 잡아 <code>p.next</code>를 ' +
          '먼저 덮으면 <code>q</code>를 잃을 수 있으니, <b>새 노드의 링크를 먼저 채우고</b> 양옆을 ' +
          '갱신하는 것이 안전하다.',
      },
      {
        type: 'list',
        items: [
          '삽입(between p,q): ① n.prev=p, n.next=q → ② p.next=n → ③ q.prev=n.',
          '삭제(노드 x): ① x.prev.next = x.next → ② x.next.prev = x.prev. (더미가 있으면 None 검사 불필요)',
          '더미 노드를 쓰면 “양 끝인가” 분기가 사라져 모든 삽입·삭제가 동일한 4줄/2줄로 처리된다.',
        ],
      },
      {
        type: 'code',
        code:
          'class DNode:\n' +
          '    def __init__(self, data, prev=None, next=None):\n' +
          '        self.data = data\n' +
          '        self.prev = prev            # 이전 노드(predecessor)\n' +
          '        self.next = next            # 다음 노드(successor)\n' +
          '\n' +
          'class DoublyLinkedList:\n' +
          '    def __init__(self):\n' +
          '        # head/tail 더미(sentinel)로 경계 조건 제거\n' +
          '        self.head = DNode(None)\n' +
          '        self.tail = DNode(None)\n' +
          '        self.head.next = self.tail\n' +
          '        self.tail.prev = self.head\n' +
          '        self.size = 0\n' +
          '\n' +
          '    def insert_between(self, data, p, q):   # p와 q 사이에 삽입 O(1)\n' +
          '        n = DNode(data, p, q)\n' +
          '        p.next = n\n' +
          '        q.prev = n\n' +
          '        self.size += 1\n' +
          '        return n\n' +
          '\n' +
          '    def add_first(self, data):\n' +
          '        return self.insert_between(data, self.head, self.head.next)\n' +
          '\n' +
          '    def add_last(self, data):               # tail 더미 직전에 삽입 O(1)\n' +
          '        return self.insert_between(data, self.tail.prev, self.tail)\n' +
          '\n' +
          '    def delete(self, node):                 # 주어진 노드 삭제 O(1)\n' +
          '        p, q = node.prev, node.next\n' +
          '        p.next = q                  # 양쪽 링크를 서로 잇는다\n' +
          '        q.prev = p\n' +
          '        self.size -= 1\n' +
          '        return node.data\n' +
          '\n' +
          '    def forward(self):              # 정방향 순회\n' +
          '        cur = self.head.next\n' +
          '        while cur is not self.tail:\n' +
          '            yield cur.data\n' +
          '            cur = cur.next\n' +
          '\n' +
          '    def backward(self):             # 역방향 순회\n' +
          '        cur = self.tail.prev\n' +
          '        while cur is not self.head:\n' +
          '            yield cur.data\n' +
          '            cur = cur.prev',
        caption: '더미(sentinel) 노드를 둔 이중 연결 리스트의 양방향 삽입·삭제·순회',
      },
      { type: 'h3', text: '시간복잡도 표' },
      {
        type: 'table',
        headers: ['연산', '단순 연결 리스트', '이중 연결 리스트', '비고'],
        rows: [
          ['add_first / remove_first', 'O(1)', 'O(1)', '둘 다 head 근처만 갱신'],
          ['remove_last', 'O(n)', 'O(1)', '이중은 tail.prev로 predecessor 확보'],
          ['주어진 노드 x 삭제', 'O(n)', 'O(1)', '이중은 x.prev/x.next로 즉시 제거'],
          ['역방향 순회', '불가(재구성 필요)', 'O(n)', 'prev 링크로 자연스럽게 가능'],
          ['노드당 포인터 수', '1 (next)', '2 (prev, next)', '이중은 메모리 오버헤드 증가'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '이중 연결 리스트의 진짜 강점은 “양방향”보다 <b>임의 노드를 O(1)에 떼어낼 수 있다</b>는 점이다. ' +
          'LRU 캐시처럼 “해시로 노드를 찾고 그 노드를 즉시 맨 앞으로 옮기는” 패턴에 이상적이다.',
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '삽입·삭제 시 갱신할 링크가 <b>양쪽으로 늘어난다</b>. 한쪽 방향만 갱신하면 리스트가 끊기거나 ' +
          'prev/next가 어긋난 일관성 깨짐이 생긴다. 더미 노드를 쓰면 None 검사를 없앨 수 있지만, ' +
          '순회 종료 조건을 <code>None</code>이 아니라 <b>더미 노드(self.tail/self.head)</b>로 잡아야 한다.',
      },
      {
        type: 'p',
        html:
          '아래 시각화에서 종류를 <b>이중(doubly)</b>으로 선택하면 prev/next 양쪽 링크가 삽입·삭제마다 ' +
          '어떻게 갱신되는지 확인할 수 있습니다.',
      },
      { type: 'viz', component: 'LinkedListVisualizer' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4) 원형·원형이중 연결 리스트
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'circular',
    title: '원형·원형이중 연결 리스트',
    summary:
      '원형 연결 리스트(circular linked list)는 마지막 노드의 next가 None 대신 head를 가리켜 끝과 처음이 이어진 구조다. ' +
      '어느 노드에서 출발해도 next만 따라가면 전체를 한 바퀴 순회할 수 있다. ' +
      '여기에 prev까지 더한 원형 이중 연결 리스트에 더미(dummy) 노드를 두면 빈 리스트·양 끝의 경계 조건이 사라져 코드가 크게 단순해진다.',
    conceptTags: ['원형 연결 리스트', '원형 이중 연결 리스트', '더미 노드'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 끝이 처음으로 돌아온다' },
      {
        type: 'p',
        html:
          '단순/이중 리스트는 끝(tail)의 링크가 <code>None</code>으로 “막혀” 있다. 원형 연결 리스트는 ' +
          '<b>tail.next = head</b>로 끝을 처음에 이어 고리를 만든다. 그래서 어느 노드에서 시작하든 ' +
          'next를 계속 따라가면 출발 노드로 되돌아오며 전체를 순회할 수 있다. tail 포인터 하나만 ' +
          '두면 <code>tail.next</code>가 곧 head라서 <b>맨 앞·맨 뒤 삽입을 모두 O(1)</b>로 처리할 수 ' +
          '있어, 라운드로빈 스케줄링·순환 버퍼 등에 잘 맞는다.',
      },
      {
        type: 'list',
        items: [
          '<b>원형 순회</b> — 시작 노드를 기억해 두고 next를 따라가다 다시 시작 노드를 만나면 한 바퀴 완료.',
          '<b>종료 조건 주의</b> — <code>while cur is not None</code>은 영원히 끝나지 않는다. <code>cur != start</code>(또는 do-while 형태)로 잡아야 한다.',
          '<b>tail 포인터 활용</b> — tail만 있으면 head(=tail.next) 접근이 O(1), 맨 뒤/맨 앞 삽입도 O(1).',
          '<b>원형 이중</b> — prev까지 더하면 양방향 원형 순회가 되고, 임의 노드 삭제가 O(1).',
        ],
      },
      { type: 'h3', text: '더미(dummy) 노드로 경계 조건 없애기' },
      {
        type: 'p',
        html:
          '원형 이중 연결 리스트에 값이 없는 <b>더미(dummy/sentinel) 노드</b> 하나를 항상 두고, ' +
          '실제 노드들이 그 더미를 사이에 두고 둥글게 연결되도록 한다. 그러면 <b>빈 리스트조차 ' +
          '“더미 혼자 자기 자신을 가리키는” 정상 상태</b>가 되어, “리스트가 비었는가/대상이 양 끝인가” 같은 ' +
          'None 분기가 통째로 사라진다. 모든 삽입·삭제가 위치와 무관하게 <b>똑같은 코드 한 벌</b>로 처리된다.',
      },
      {
        type: 'list',
        items: [
          '빈 리스트: <code>dummy.next == dummy.prev == dummy</code> (자기 자신을 가리킴).',
          'head는 <code>dummy.next</code>, tail은 <code>dummy.prev</code>로 항상 정의된다.',
          '삽입·삭제에 <code>None</code> 검사가 필요 없어 분기가 줄고 버그 표면이 작아진다.',
        ],
      },
      {
        type: 'code',
        code:
          'class CNode:\n' +
          '    def __init__(self, data, prev=None, next=None):\n' +
          '        self.data = data\n' +
          '        self.prev = prev\n' +
          '        self.next = next\n' +
          '\n' +
          'class CircularDoublyLinkedList:\n' +
          '    def __init__(self):\n' +
          '        self.dummy = CNode(None)        # 더미(sentinel) 노드\n' +
          '        self.dummy.next = self.dummy    # 빈 리스트는 자기 자신을 가리킴\n' +
          '        self.dummy.prev = self.dummy\n' +
          '        self.size = 0\n' +
          '\n' +
          '    def is_empty(self):\n' +
          '        return self.dummy.next is self.dummy\n' +
          '\n' +
          '    def insert_between(self, data, p, q):   # p와 q 사이에 삽입 O(1)\n' +
          '        n = CNode(data, p, q)\n' +
          '        p.next = n\n' +
          '        q.prev = n\n' +
          '        self.size += 1\n' +
          '        return n\n' +
          '\n' +
          '    def add_first(self, data):              # head 자리에 삽입\n' +
          '        return self.insert_between(data, self.dummy, self.dummy.next)\n' +
          '\n' +
          '    def add_last(self, data):               # tail 자리에 삽입\n' +
          '        return self.insert_between(data, self.dummy.prev, self.dummy)\n' +
          '\n' +
          '    def delete(self, node):                 # 임의 노드 삭제 O(1)\n' +
          '        if node is self.dummy:\n' +
          '            raise ValueError("cannot delete sentinel")\n' +
          '        node.prev.next = node.next\n' +
          '        node.next.prev = node.prev\n' +
          '        self.size -= 1\n' +
          '        return node.data\n' +
          '\n' +
          '    def traverse(self):             # 원형 순회: 더미를 만나면 한 바퀴\n' +
          '        cur = self.dummy.next\n' +
          '        while cur is not self.dummy:\n' +
          '            yield cur.data\n' +
          '            cur = cur.next',
        caption: '더미 노드를 둔 원형 이중 연결 리스트 — 빈 리스트도 정상 상태로 통일',
      },
      { type: 'h3', text: '종류별 특성 비교' },
      {
        type: 'table',
        headers: ['종류', 'tail.next', '역방향', '임의 노드 삭제', '경계 조건'],
        rows: [
          ['단순', 'None', '불가', 'O(n)', '많음(None 분기)'],
          ['원형 단순', 'head', '불가', 'O(n)', '순회 종료 조건 주의'],
          ['이중', 'None(또는 더미)', '가능', 'O(1)', '중간(더미로 완화)'],
          ['원형 이중 + 더미', 'head(고리)', '가능', 'O(1)', '거의 없음(가장 단순)'],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '원형 리스트 순회에서 <b>종료 조건을 <code>cur is not None</code>으로 두면 무한 루프</b>에 ' +
          '빠진다. 끝 노드의 next가 다시 head(또는 더미)를 가리키기 때문이다. 반드시 ' +
          '<b>시작 노드(또는 더미)로 되돌아왔는지</b>로 종료를 판단해야 한다.',
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '더미 노드는 “값이 없는 가짜 노드”다. 빈 리스트를 특수 케이스가 아니라 ' +
          '<b>더미만 있는 일반 케이스</b>로 만들어, 삽입·삭제 코드에서 <code>None</code> 검사와 ' +
          '양 끝 분기를 통째로 없애 준다. 단, 더미 자신은 삭제·반환 대상에서 제외해야 한다.',
      },
      {
        type: 'p',
        html:
          '아래 시각화에서 원형(circular) 형태를 선택해 tail.next가 head로 이어지는 고리와, ' +
          '한 바퀴 도는 순회 동작을 확인해 보세요.',
      },
      { type: 'viz', component: 'LinkedListVisualizer' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 5) 커서 연결 리스트
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'cursor',
    title: '커서 연결 리스트',
    summary:
      '커서 연결 리스트(cursor-based linked list)는 진짜 포인터 대신 배열의 인덱스로 노드 간 연결을 표현하는 구현이다. ' +
      '각 칸은 data와 “다음 칸의 인덱스(next)”를 담고, 포인터가 없는 환경(임베디드, 순수 배열만 쓰는 언어)에서도 연결 리스트를 흉내 낸다. ' +
      '삭제된 칸은 버리지 않고 free list로 모아 두었다가 새 노드를 넣을 때 재사용한다.',
    conceptTags: ['커서 연결 리스트', 'free list'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 포인터를 인덱스로 대체' },
      {
        type: 'p',
        html:
          '동적 메모리 할당(malloc/포인터)이 없거나 비싼 환경에서는, 미리 잡아 둔 <b>고정 배열</b> 위에서 ' +
          '연결 리스트를 구현한다. 노드 = 배열의 한 칸이고, 링크는 메모리 주소가 아니라 ' +
          '<b>“다음 노드가 들어 있는 배열 인덱스”</b>다. 관례적으로 <b>인덱스 0(또는 -1)을 None(끝) 표시</b>로 ' +
          '예약한다. 리스트의 head도 포인터가 아니라 “첫 노드의 인덱스”라는 정수다.',
      },
      {
        type: 'list',
        items: [
          '<b>node = 배열 칸</b> — <code>data[i]</code>에 값, <code>next[i]</code>에 다음 칸의 인덱스.',
          '<b>None 표시</b> — 약속한 특수 인덱스(여기서는 0)를 “끝/없음”으로 사용.',
          '<b>head</b> — 첫 노드의 인덱스(정수). 빈 리스트면 0.',
          '<b>장점</b> — 포인터 없이 배열만으로 동작, 직렬화·고정 메모리 환경에 유리.',
        ],
      },
      { type: 'h4', text: 'free list: 삭제된 칸 재사용' },
      {
        type: 'p',
        html:
          '배열은 크기가 고정이라, 노드를 삭제할 때마다 칸이 그냥 비면 곧 자리가 동난다. 그래서 ' +
          '<b>비어 있는(삭제되었거나 아직 안 쓴) 칸들을 또 하나의 연결 리스트로 묶어 둔다</b>. 이것이 ' +
          '<b>free list</b>다. 새 노드가 필요하면 free list의 앞에서 칸 하나를 꺼내 쓰고(allocate), ' +
          '노드를 삭제하면 그 칸을 free list 앞에 도로 끼워 넣는다(free). 즉 free list는 ' +
          '“재사용 가능한 빈 칸들의 스택” 역할을 한다.',
      },
      {
        type: 'list',
        items: [
          '<b>allocate()</b> — free list의 head 칸을 떼어 새 노드로 사용. free가 비면 “메모리 부족”.',
          '<b>free(i)</b> — 칸 i를 free list 앞에 도로 연결해 재사용 가능 상태로 되돌림.',
          '<b>초기화</b> — 시작 시 모든 칸을 free list로 연결해 둔다(0번은 None 표시로 예약).',
        ],
      },
      {
        type: 'code',
        code:
          'class CursorList:\n' +
          '    NIL = 0                         # 인덱스 0 = None(끝/없음)\n' +
          '\n' +
          '    def __init__(self, capacity=8):\n' +
          '        n = capacity + 1            # 0번은 NIL 예약\n' +
          '        self.data = [None] * n\n' +
          '        self.next = [0] * n\n' +
          '        # 1..capacity 칸을 free list로 연결 (1->2->...->cap->NIL)\n' +
          '        for i in range(1, n - 1):\n' +
          '            self.next[i] = i + 1\n' +
          '        self.next[n - 1] = self.NIL\n' +
          '        self.free = 1               # free list의 head 인덱스\n' +
          '        self.head = self.NIL        # 실제 리스트는 비어 있음\n' +
          '\n' +
          '    def _allocate(self):            # free list에서 칸 하나 꺼냄\n' +
          '        i = self.free\n' +
          '        if i == self.NIL:\n' +
          '            raise MemoryError("free list empty")\n' +
          '        self.free = self.next[i]    # free head를 다음으로\n' +
          '        return i\n' +
          '\n' +
          '    def _free(self, i):             # 칸 i를 free list 앞으로 반환\n' +
          '        self.data[i] = None\n' +
          '        self.next[i] = self.free\n' +
          '        self.free = i\n' +
          '\n' +
          '    def add_first(self, value):     # 맨 앞 삽입 O(1)\n' +
          '        i = self._allocate()\n' +
          '        self.data[i] = value\n' +
          '        self.next[i] = self.head\n' +
          '        self.head = i\n' +
          '        return i\n' +
          '\n' +
          '    def remove_first(self):         # 맨 앞 삭제 O(1) + 칸 재사용\n' +
          '        if self.head == self.NIL:\n' +
          '            raise IndexError("empty list")\n' +
          '        i = self.head\n' +
          '        self.head = self.next[i]\n' +
          '        value = self.data[i]\n' +
          '        self._free(i)               # 삭제된 칸을 free list로 반환\n' +
          '        return value\n' +
          '\n' +
          '    def search(self, target):       # 순차 탐색 O(n)\n' +
          '        i = self.head\n' +
          '        while i != self.NIL:\n' +
          '            if self.data[i] == target:\n' +
          '                return i\n' +
          '            i = self.next[i]        # 인덱스로 다음 칸 이동\n' +
          '        return self.NIL',
        caption: '배열 인덱스로 연결을 표현하고 free list로 칸을 재사용하는 커서 연결 리스트',
      },
      { type: 'h3', text: '시간복잡도 표' },
      {
        type: 'table',
        headers: ['연산', '시간복잡도', '비고'],
        rows: [
          ['add_first / remove_first', 'O(1)', 'head 인덱스와 free list만 갱신'],
          ['search(값 탐색)', 'O(n)', 'next[] 인덱스를 따라 순차 비교'],
          ['_allocate / _free', 'O(1)', 'free list의 head에서 꺼내고 넣음'],
          ['인덱스(논리적 i번째) 접근', 'O(n)', '배열이지만 링크를 따라가야 함'],
          ['공간', 'O(capacity)', '고정 배열, 동적 할당 없음'],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          'free list 없이 <b>삭제만 반복하고 빈 칸을 재사용하지 않으면</b> 사용 가능한 칸이 점점 줄어 ' +
          '결국 배열이 “구멍투성이”가 된다. 실제 데이터는 적은데도 새 노드를 못 넣는 ' +
          '<b>빈 레코드 증가(메모리 단편화)</b> 문제가 생긴다. free list는 바로 이 낭비를 막아 ' +
          '삭제된 칸을 즉시 재활용하게 해 준다.',
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '커서 리스트는 포인터가 없는 언어/환경에서 연결 리스트를 구현하거나, 노드들을 ' +
          '<b>하나의 배열에 담아 파일에 그대로 저장(직렬화)</b>해야 할 때 유용하다. free list는 ' +
          '내부적으로 “빈 칸들의 스택”이므로, allocate/free가 모두 <b>O(1)</b>이다.',
      },
      {
        type: 'p',
        html:
          '아래 시각화에서 data/next 배열과 free list가 삽입·삭제에 따라 어떻게 바뀌는지, ' +
          '삭제된 칸이 어떻게 재사용되는지 확인해 보세요.',
      },
      { type: 'viz', component: 'CursorListViz' },
    ],
  },
]
