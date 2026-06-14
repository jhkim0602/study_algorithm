// Ch06 정렬 — 세부 학습 페이지 (b): 퀵 / 병합 / 힙 / 도수 정렬
// 분할 정복 계열(퀵·병합)과 트리 기반(힙), 비비교 분포 정렬(도수)을 깊게 다룬다.

export const subtopics = [
  // ────────────────────────────────────────────────────────────
  // 1) 퀵 정렬
  // ────────────────────────────────────────────────────────────
  {
    slug: 'quick',
    title: '퀵 정렬',
    summary:
      '퀵 정렬(quick sort)은 pivot(기준 원소)을 하나 골라, 그보다 작은 값과 큰 값으로 배열을 ' +
      '둘로 나누는 분할(partition)을 수행하고, 나뉜 두 부분을 각각 재귀적으로 정렬하는 분할 정복 ' +
      '알고리즘이다. 분할이 균형 잡히면 평균 O(n log n)으로 매우 빠르지만, pivot이 한쪽으로 ' +
      '치우치면 최악 O(n²)까지 느려진다. 보통 보조 배열 없이 제자리에서 동작하고, 같은 키의 순서를 ' +
      '보장하지 못해 불안정 정렬이다.',
    conceptTags: ['퀵 정렬', '분할(partition)'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: pivot 기준 분할 정복' },
      {
        type: 'p',
        html:
          '퀵 정렬의 한 단계는 세 부분으로 나뉜다. (1) 배열에서 <b>pivot</b>을 하나 고른다. ' +
          '(2) pivot보다 작은 값은 모두 왼쪽, 큰 값은 모두 오른쪽으로 모으는 <b>partition(분할)</b>을 ' +
          '수행한다. 이때 pivot은 정렬이 끝났을 때의 <b>최종 위치</b>에 자리 잡는다. ' +
          '(3) pivot을 제외한 왼쪽 구간과 오른쪽 구간을 각각 같은 방법으로 재귀 정렬한다.',
      },
      {
        type: 'p',
        html:
          '병합 정렬이 \'먼저 반으로 나누고 나중에 합치는\' 구조라면, 퀵 정렬은 반대로 ' +
          '<b>먼저 분할(partition)하면서 자리를 정하고</b> 재귀로 들어가기 때문에 <b>합치는 과정이 따로 없다</b>. ' +
          'partition만 끝나면 pivot은 제자리에 고정되므로, 양쪽을 정렬하면 전체가 정렬된다.',
      },
      { type: 'h3', text: '동작 과정 (단계별)' },
      {
        type: 'list',
        items: [
          '<b>1. pivot 선택</b> — 보통 맨 앞·맨 뒤·중앙 또는 무작위 원소를 고른다. (아래 예시는 맨 앞)',
          '<b>2. 분할(partition)</b> — pivot보다 작은 값을 왼쪽, 크거나 같은 값을 오른쪽으로 재배치한다.',
          '<b>3. pivot 확정</b> — 분할이 끝나면 pivot은 정렬 후의 최종 위치(경계)에 놓인다.',
          '<b>4. 재귀</b> — pivot 왼쪽 구간과 오른쪽 구간에 대해 1~3을 반복한다.',
          '<b>5. 종료</b> — 구간의 길이가 0 또는 1이 되면 이미 정렬된 것으로 보고 멈춘다.',
        ],
      },
      {
        type: 'p',
        html:
          '예를 들어 <code>[6, 3, 8, 2, 5]</code>에서 pivot을 6으로 잡으면, 6보다 작은 ' +
          '<code>3, 2, 5</code>는 왼쪽, 큰 <code>8</code>은 오른쪽으로 모이고 pivot 6은 그 사이 ' +
          '<code>[3, 2, 5] · 6 · [8]</code> 경계에 자리 잡는다. 이후 왼쪽 <code>[3, 2, 5]</code>와 ' +
          '오른쪽 <code>[8]</code>을 각각 재귀 정렬한다.',
      },
      { type: 'h4', text: '두 가지 partition 구현 방식' },
      {
        type: 'p',
        html:
          'partition은 크게 두 방식으로 구현한다. <b>(A) 리스트 컴프리헨션 방식</b>은 작은 값/큰 값을 ' +
          '담을 새 리스트를 만들어 직관적이지만 보조 메모리를 O(n) 쓰므로 제자리 정렬이 아니다. ' +
          '<b>(B) 제자리 two-pointer 방식</b>은 배열 안에서 좌·우 포인터로 원소를 맞교환해 추가 배열 ' +
          '없이(O(log n) 스택만) 분할하므로 진짜 제자리 정렬이다. 실무 구현은 보통 (B)를 쓴다.',
      },
      {
        type: 'code',
        code:
          '# (A) 리스트 컴프리헨션 방식 — 직관적이지만 보조 메모리 O(n)\n' +
          'def quick_sort(arr):\n' +
          '    if len(arr) <= 1:\n' +
          '        return arr\n' +
          '    pivot = arr[0]\n' +
          '    left = [x for x in arr[1:] if x < pivot]\n' +
          '    right = [x for x in arr[1:] if x >= pivot]   # >= 로 같은 값은 오른쪽\n' +
          '    return quick_sort(left) + [pivot] + quick_sort(right)\n' +
          '\n' +
          '\n' +
          '# (B) 제자리 two-pointer 방식 — 추가 배열 없이 배열 안에서 분할\n' +
          'def quick_sort_inplace(arr, low, high):\n' +
          '    if low >= high:                  # 원소 0~1개면 종료\n' +
          '        return\n' +
          '    pivot = arr[low]                 # 맨 앞을 pivot으로\n' +
          '    left, right = low + 1, high\n' +
          '    while left <= right:\n' +
          '        # 왼쪽에서 pivot보다 큰 값을 찾는다\n' +
          '        while left <= right and arr[left] <= pivot:\n' +
          '            left += 1\n' +
          '        # 오른쪽에서 pivot보다 작은 값을 찾는다\n' +
          '        while left <= right and arr[right] >= pivot:\n' +
          '            right -= 1\n' +
          '        # 두 값을 맞교환해 작은 값은 왼쪽, 큰 값은 오른쪽으로\n' +
          '        if left < right:\n' +
          '            arr[left], arr[right] = arr[right], arr[left]\n' +
          '    # pivot을 경계(right)로 보내 최종 위치에 고정\n' +
          '    arr[low], arr[right] = arr[right], arr[low]\n' +
          '    quick_sort_inplace(arr, low, right - 1)   # 왼쪽 재귀\n' +
          '    quick_sort_inplace(arr, right + 1, high)  # 오른쪽 재귀\n' +
          '\n' +
          '\n' +
          'data = [6, 3, 8, 2, 5, 1, 7, 4]\n' +
          'quick_sort_inplace(data, 0, len(data) - 1)\n' +
          'print(data)   # [1, 2, 3, 4, 5, 6, 7, 8]\n' +
          'print(quick_sort([6, 3, 8, 2, 5, 1, 7, 4]))   # [1, 2, 3, 4, 5, 6, 7, 8]',
        caption: '퀵 정렬: (A) 리스트 컴프리헨션 분할과 (B) 제자리 two-pointer 분할 두 가지 구현',
      },
      { type: 'h3', text: '시간복잡도 · 안정성 · 제자리' },
      {
        type: 'table',
        headers: ['항목', '값', '설명'],
        rows: [
          ['최선/평균 시간', 'O(n log n)', '분할이 균형 잡히면 재귀 깊이 log n, 각 단계 비교 O(n)'],
          ['최악 시간', 'O(n²)', '이미 정렬 + 한쪽 끝 pivot → 분할이 1:(n-1)로 치우침'],
          ['공간(제자리 방식)', 'O(log n)', '재귀 호출 스택만 사용. 보조 배열 없음 → 제자리 정렬'],
          ['공간(컴프리헨션)', 'O(n)', '단계마다 새 리스트 생성 → 제자리 아님'],
          ['안정성', '불안정', '먼 거리 맞교환으로 같은 키의 상대 순서가 깨질 수 있음'],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '<b>최악의 함정</b>: <b>이미 정렬된(또는 역순) 데이터 + 맨 끝 pivot</b> 조합이면 매 단계 분할이 ' +
          '1개와 n-1개로 갈라져 재귀 깊이가 n이 되고, 비교 횟수가 n+(n-1)+...+1 ≈ <code>O(n²)</code>로 ' +
          '폭발한다. 깊은 재귀로 스택 오버플로가 날 수도 있다. 실무에서는 <b>무작위 pivot</b>이나 ' +
          '<b>median-of-three(앞·중간·뒤의 중앙값)</b>로 pivot을 골라 이 최악 패턴을 회피한다.',
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '퀵 정렬은 평균적으로 같은 O(n log n)인 병합 정렬보다 <b>상수 인자가 작고 캐시 친화적</b>이라 ' +
          '실측 속도가 빠른 경우가 많다. 또 보조 배열이 필요 없어 메모리도 적게 쓴다. 단, 안정성이 ' +
          '필요하거나 최악을 절대 피해야 하는 상황이라면 병합 정렬이나 힙 정렬이 더 안전하다.',
      },
      { type: 'viz', component: 'SortVisualizer', props: { algo: 'quick', lock: true } },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 2) 병합 정렬
  // ────────────────────────────────────────────────────────────
  {
    slug: 'merge',
    title: '병합 정렬',
    summary:
      '병합 정렬(merge sort)은 배열을 절반으로 계속 쪼개 길이 1이 될 때까지 분할한 뒤, 정렬된 두 ' +
      '부분 배열을 하나로 합치는 merge(병합) 과정을 반복해 전체를 정렬하는 분할 정복 알고리즘이다. ' +
      '입력 상태와 무관하게 항상 O(n log n)을 보장하고, 같은 키의 상대 순서를 유지하는 안정 정렬이다. ' +
      '다만 병합에 보조 배열이 필요해 제자리 정렬이 아니다.',
    conceptTags: ['병합 정렬', 'merge'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 나누고(divide) 합친다(merge)' },
      {
        type: 'p',
        html:
          '병합 정렬은 \'두 개의 이미 정렬된 배열을 합치는 것은 쉽다\'는 사실을 이용한다. ' +
          '배열을 절반씩 재귀적으로 쪼개면 결국 길이 1짜리(자명하게 정렬된) 배열들이 되고, ' +
          '이들을 두 개씩 <b>merge</b>하며 올라오면 정렬된 큰 배열이 만들어진다. ' +
          '분할은 단순히 가운데를 자르기만 하므로 일이 거의 없고, <b>실제 정렬은 merge 단계에서</b> 일어난다.',
      },
      {
        type: 'p',
        html:
          'merge는 두 정렬된 배열의 맨 앞을 가리키는 포인터 두 개를 두고, 더 작은 값을 결과에 차례로 ' +
          '담는 방식이다. 한쪽이 비면 나머지 한쪽을 통째로 이어 붙인다. 두 배열의 길이 합이 m이면 ' +
          'merge 한 번은 O(m)이다.',
      },
      { type: 'h3', text: '동작 과정 (단계별)' },
      {
        type: 'list',
        items: [
          '<b>1. 분할(divide)</b> — 배열을 가운데에서 왼쪽 절반과 오른쪽 절반으로 나눈다.',
          '<b>2. 재귀 정렬</b> — 각 절반을 같은 방식으로 재귀 호출해 정렬한다.',
          '<b>3. 종료 조건</b> — 길이가 1 이하면 이미 정렬된 것으로 보고 그대로 반환한다.',
          '<b>4. 병합(merge)</b> — 정렬된 두 절반을 작은 값부터 골라 보조 배열에 합친다.',
          '<b>5. 상향 결합</b> — 합쳐진 결과가 다시 상위 호출의 절반이 되어 끝까지 올라온다.',
        ],
      },
      {
        type: 'p',
        html:
          '예: <code>[3, 1, 4, 1, 5, 2]</code> → <code>[3,1,4]</code>, <code>[1,5,2]</code>로 분할 → ' +
          '각각 정렬되어 <code>[1,3,4]</code>, <code>[1,2,5]</code> → merge하면 ' +
          '<code>[1, 1, 2, 3, 4, 5]</code>가 된다.',
      },
      {
        type: 'code',
        code:
          '# 두 정렬된 리스트를 하나로 합치는 merge 함수\n' +
          'def merge(left, right):\n' +
          '    result = []\n' +
          '    i = j = 0\n' +
          '    # 양쪽 모두 남아 있는 동안 더 작은 값을 먼저 담는다\n' +
          '    while i < len(left) and j < len(right):\n' +
          '        if left[i] <= right[j]:   # <= 라서 같은 값은 left가 먼저 → 안정성 유지\n' +
          '            result.append(left[i])\n' +
          '            i += 1\n' +
          '        else:\n' +
          '            result.append(right[j])\n' +
          '            j += 1\n' +
          '    # 한쪽이 비면 남은 쪽을 통째로 붙인다\n' +
          '    result += left[i:]\n' +
          '    result += right[j:]\n' +
          '    return result\n' +
          '\n' +
          '\n' +
          '# 배열을 반으로 나눠 재귀 정렬 후 merge\n' +
          'def merge_sort(arr):\n' +
          '    if len(arr) <= 1:        # 길이 0~1이면 이미 정렬됨\n' +
          '        return arr\n' +
          '    mid = len(arr) // 2\n' +
          '    left = merge_sort(arr[:mid])\n' +
          '    right = merge_sort(arr[mid:])\n' +
          '    return merge(left, right)\n' +
          '\n' +
          '\n' +
          'print(merge_sort([3, 1, 4, 1, 5, 9, 2, 6]))   # [1, 1, 2, 3, 4, 5, 6, 9]',
        caption: '병합 정렬: merge(두 정렬 배열 합치기) + merge_sort(분할 후 재귀 병합)',
      },
      { type: 'h3', text: '시간복잡도 · 안정성 · 제자리' },
      {
        type: 'table',
        headers: ['항목', '값', '설명'],
        rows: [
          ['최선/평균/최악 시간', 'O(n log n)', '분할 깊이 log n × 각 레벨 merge 총비용 O(n). 입력과 무관'],
          ['공간', 'O(n)', '병합용 보조 배열이 필요 → 제자리 정렬 아님'],
          ['안정성', '안정', 'merge에서 같은 값일 때 left를 먼저 담아(<=) 원래 순서 보존'],
          ['특징', '항상 일정', '최악에도 O(n log n) 보장 → 성능 예측이 쉬움'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '<b>안정성의 비결</b>은 merge의 비교 조건이 <code>left[i] &lt;= right[j]</code>(등호 포함)라는 점이다. ' +
          '같은 키를 만나면 항상 왼쪽(원래 앞에 있던) 원소를 먼저 담으므로 상대 순서가 유지된다. ' +
          '만약 조건을 <code>&lt;</code>로 바꾸면 같은 키에서 right가 먼저 들어가 안정성이 깨질 수 있다.',
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '병합 정렬의 약점은 <b>O(n) 보조 배열</b>이다. 메모리가 빠듯한 환경에서는 부담이 된다. ' +
          '반면 <b>연결 리스트</b> 정렬에는 매우 적합한데, 포인터만 이어 붙이면 되어 추가 배열 없이 ' +
          '안정적으로 O(n log n) 정렬이 가능하다. 또한 데이터가 너무 커서 메모리에 다 못 올릴 때 쓰는 ' +
          '<b>외부 정렬(external sort)</b>의 기본 골격도 병합 정렬이다.',
      },
      { type: 'viz', component: 'SortVisualizer', props: { algo: 'merge', lock: true } },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 3) 힙 정렬
  // ────────────────────────────────────────────────────────────
  {
    slug: 'heap',
    title: '힙 정렬',
    summary:
      '힙 정렬(heap sort)은 배열을 완전이진트리로 해석해 최대 힙(부모 ≥ 자식)을 구성한 뒤, 항상 ' +
      '루트에 있는 최댓값을 배열 맨 뒤로 보내고 힙 크기를 하나 줄여 down-heap(sift down)으로 힙 ' +
      '성질을 복구하는 과정을 반복하는 정렬이다. build heap이 O(n), 이후 n번의 down-heap이 각각 ' +
      'O(log n)이라 전체 O(n log n)을 보장하며, 보조 배열 없이 제자리에서 동작하지만 불안정 정렬이다.',
    conceptTags: ['힙 정렬', 'down heap', 'heapify'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 배열 = 완전이진트리' },
      {
        type: 'p',
        html:
          '힙 정렬은 1차원 배열을 <b>완전이진트리</b>로 본다. 인덱스 i의 노드에 대해 ' +
          '<b>왼쪽 자식은 2i+1</b>, <b>오른쪽 자식은 2i+2</b>, <b>부모는 (i-1)//2</b>로 ' +
          '위치를 계산할 수 있어 포인터 없이도 트리 구조를 표현한다. ' +
          '<b>최대 힙(max heap)</b>은 모든 부모가 자식보다 크거나 같은 트리이므로, ' +
          '<b>루트(인덱스 0)에 항상 전체 최댓값</b>이 온다는 성질을 갖는다.',
      },
      {
        type: 'p',
        html:
          '이 성질을 이용해 \'최댓값을 뽑아 맨 뒤에 두기\'를 반복하면 정렬이 된다. 루트의 최댓값을 ' +
          '맨 뒤 원소와 교환해 정렬 완료 구간에 넣고, 힙 크기를 1 줄인 뒤 흐트러진 루트를 ' +
          '<b>down-heap</b>으로 제자리 내려보내 다시 최대 힙으로 복구한다.',
      },
      { type: 'h3', text: 'down-heap(sift down)과 build heap' },
      {
        type: 'list',
        items: [
          '<b>down-heap(sift down)</b> — 어떤 노드가 자식보다 작으면, 두 자식 중 더 큰 쪽과 교환하며 ' +
          '아래로 내려간다. 더 이상 내려갈 자식이 없거나 자식보다 커지면 멈춘다. 한 번에 O(log n).',
          '<b>build heap(heapify)</b> — 마지막 부모 노드(n//2 - 1)부터 루트(0)까지 거꾸로 가며 ' +
          '각 노드에 down-heap을 적용한다. 아래쪽 작은 서브트리부터 정리하므로 전체 비용이 O(n)이다.',
          '<b>최댓값 추출</b> — 루트(최댓값)와 현재 힙의 마지막 원소를 교환하고 힙 크기를 1 줄인 뒤, ' +
          '새 루트에 down-heap을 적용해 힙을 복구한다. 이를 n-1번 반복하면 오름차순 정렬이 완성된다.',
        ],
      },
      {
        type: 'p',
        html:
          'build heap을 \'위에서 아래로(insert 반복)\' 하면 O(n log n)이지만, 위처럼 ' +
          '<b>아래에서 위로(bottom-up) down-heap</b>을 적용하면 깊이가 얕은 노드가 대부분이라 ' +
          '전체 합이 O(n)으로 줄어든다. 그래서 힙 \'구성\'은 O(n), 이후 \'정렬\' 단계가 O(n log n)이다.',
      },
      {
        type: 'code',
        code:
          '# 인덱스 i를 루트로 하는 서브트리를 최대 힙으로 만드는 down-heap (힙 크기 n)\n' +
          'def heapify(arr, n, i):\n' +
          '    largest = i\n' +
          '    left = 2 * i + 1      # 왼쪽 자식\n' +
          '    right = 2 * i + 2     # 오른쪽 자식\n' +
          '    # 두 자식 중 더 큰 값을 largest로\n' +
          '    if left < n and arr[left] > arr[largest]:\n' +
          '        largest = left\n' +
          '    if right < n and arr[right] > arr[largest]:\n' +
          '        largest = right\n' +
          '    # 부모가 가장 크지 않으면 교환 후 내려간 자리에서 다시 down-heap\n' +
          '    if largest != i:\n' +
          '        arr[i], arr[largest] = arr[largest], arr[i]\n' +
          '        heapify(arr, n, largest)\n' +
          '\n' +
          '\n' +
          'def heap_sort(arr):\n' +
          '    n = len(arr)\n' +
          '    # 1) build heap: 마지막 부모부터 루트까지 거꾸로 down-heap → O(n)\n' +
          '    for i in range(n // 2 - 1, -1, -1):\n' +
          '        heapify(arr, n, i)\n' +
          '    # 2) 최댓값(루트)을 맨 뒤로 보내고 힙 크기를 줄이며 복구 → O(n log n)\n' +
          '    for end in range(n - 1, 0, -1):\n' +
          '        arr[0], arr[end] = arr[end], arr[0]   # 최댓값을 정렬 구간으로\n' +
          '        heapify(arr, end, 0)                  # 줄어든 힙(크기 end)을 복구\n' +
          '    return arr\n' +
          '\n' +
          '\n' +
          'print(heap_sort([4, 10, 3, 5, 1, 8, 2]))   # [1, 2, 3, 4, 5, 8, 10]',
        caption: '힙 정렬: heapify(down-heap) + heap_sort(build heap 후 최댓값을 뒤로 빼며 반복)',
      },
      { type: 'h3', text: '시간복잡도 · 안정성 · 제자리' },
      {
        type: 'table',
        headers: ['항목', '값', '설명'],
        rows: [
          ['build heap', 'O(n)', 'bottom-up down-heap의 비용 총합은 선형'],
          ['정렬 단계', 'O(n log n)', '최댓값 추출 n번 × down-heap 각 O(log n)'],
          ['전체 시간', 'O(n log n)', '최선/평균/최악 모두 동일하게 보장'],
          ['공간', 'O(1)', '배열 내부 교환만 사용 → 제자리 정렬'],
          ['안정성', '불안정', '루트와 맨 뒤를 교환하는 먼 거리 이동으로 같은 키 순서가 깨짐'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '힙 정렬은 <b>최악에도 O(n log n)을 보장하면서 추가 메모리가 O(1)</b>인 드문 정렬이다. ' +
          '퀵 정렬의 최악(O(n²))과 병합 정렬의 추가 메모리(O(n))를 동시에 피하고 싶을 때 좋은 ' +
          '선택지다. 또 힙 구조 자체는 <b>우선순위 큐</b>의 토대라 정렬 외에도 폭넓게 쓰인다.',
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '주의할 점: 자식 인덱스 <code>2i+1</code>, <code>2i+2</code>가 힙 크기 n을 넘지 않는지 ' +
          '(<code>left &lt; n</code>) 반드시 확인해야 한다. 또 down-heap에서 \'두 자식 중 큰 쪽\'을 ' +
          '고르지 않고 아무 자식과 교환하면 최대 힙 성질이 깨진다. 캐시 지역성이 나빠 실측 속도는 ' +
          '퀵·병합보다 느린 편이라는 점도 기억하자.',
      },
      { type: 'viz', component: 'SortVisualizer', props: { algo: 'heap', lock: true } },
      { type: 'viz', component: 'HeapArrayViz' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4) 도수 정렬
  // ────────────────────────────────────────────────────────────
  {
    slug: 'counting',
    title: '도수 정렬',
    summary:
      '도수 정렬(counting sort)은 원소를 서로 비교하지 않고, 각 값이 몇 번 나오는지 세어 위치를 ' +
      '결정하는 분포 기반 정렬이다. 값의 개수를 담는 도수(count) 배열을 만들고, 이를 누적합으로 ' +
      '바꿔 각 값의 최종 위치 구간을 정한 뒤, 원본을 뒤에서부터 훑어 안정적으로 배치한다. ' +
      '값의 범위를 k라 할 때 O(n+k)로 매우 빠르지만 k가 크면 비효율적이고, 정수처럼 인덱스로 쓸 수 ' +
      '있는 값에만 적용되며 안정 정렬이다.',
    conceptTags: ['도수 정렬', '도수 배열', '누적 합'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어: 비교 대신 개수 세기' },
      {
        type: 'p',
        html:
          '비교 기반 정렬의 이론적 하한은 <code>Ω(n log n)</code>이다. 도수 정렬은 이 한계를 ' +
          '<b>비교를 아예 하지 않음으로써</b> 우회한다. \'값 v가 전체에서 몇 개 있고, v보다 작은 값이 ' +
          '몇 개인지\'만 알면 v가 들어갈 자리를 곧바로 계산할 수 있다는 것이 핵심이다. ' +
          '값을 배열의 <b>인덱스</b>로 직접 쓰기 때문에 음이 아닌 정수(또는 정수로 사상 가능한 값)에만 적용된다.',
      },
      { type: 'h3', text: '동작 과정 (단계별)' },
      {
        type: 'list',
        items: [
          '<b>1. 도수 배열 생성</b> — 값의 범위 크기 k만큼 <code>count</code> 배열을 0으로 만든다.',
          '<b>2. 개수 세기</b> — 원본을 한 번 훑으며 각 값 v에 대해 <code>count[v] += 1</code>.',
          '<b>3. 누적합</b> — <code>count[i] += count[i-1]</code>로 바꾼다. 이제 count[v]는 ' +
          '\'v 이하 값의 총 개수\' = v가 들어갈 구간의 끝(배치 위치)을 가리킨다.',
          '<b>4. 안정 배치</b> — 원본을 <b>뒤에서 앞으로</b> 훑으며 <code>count[v] -= 1</code> 후 ' +
          '그 위치에 v를 놓는다. 뒤에서부터 처리해야 같은 값의 원래 순서가 보존되어 안정성이 유지된다.',
        ],
      },
      {
        type: 'p',
        html:
          '예: <code>[2, 0, 1, 2, 1, 0, 2]</code> (값 범위 0~2). 도수 배열은 ' +
          '<code>count = [2, 2, 3]</code>(0이 2개, 1이 2개, 2가 3개). 누적합을 적용하면 ' +
          '<code>[2, 4, 7]</code>이 되어, 0은 0~1번, 1은 2~3번, 2는 4~6번 자리에 들어감을 알 수 있다.',
      },
      {
        type: 'code',
        code:
          '# 음이 아닌 정수 배열에 대한 도수 정렬 (안정)\n' +
          'def counting_sort(arr):\n' +
          '    if not arr:\n' +
          '        return arr\n' +
          '    k = max(arr)                       # 값의 최댓값 → 범위 0..k\n' +
          '    count = [0] * (k + 1)\n' +
          '\n' +
          '    # 1) 도수 배열: 각 값의 등장 횟수\n' +
          '    for x in arr:\n' +
          '        count[x] += 1\n' +
          '\n' +
          '    # 2) 누적합: count[v] = v 이하 값의 개수(=배치 끝 위치)\n' +
          '    for i in range(1, k + 1):\n' +
          '        count[i] += count[i - 1]\n' +
          '\n' +
          '    # 3) 안정 배치: 뒤에서부터 훑어 같은 값의 순서를 보존\n' +
          '    result = [0] * len(arr)\n' +
          '    for x in reversed(arr):\n' +
          '        count[x] -= 1\n' +
          '        result[count[x]] = x\n' +
          '    return result\n' +
          '\n' +
          '\n' +
          'print(counting_sort([2, 0, 1, 2, 1, 0, 2]))   # [0, 0, 1, 1, 2, 2, 2]\n' +
          'print(counting_sort([4, 2, 2, 8, 3, 3, 1]))   # [1, 2, 2, 3, 3, 4, 8]',
        caption: '도수 정렬: 도수 배열 → 누적합 → 뒤에서부터 안정 배치',
      },
      { type: 'h3', text: '시간복잡도 · 안정성 · 적용 조건' },
      {
        type: 'table',
        headers: ['항목', '값', '설명'],
        rows: [
          ['시간', 'O(n + k)', 'n번 세기 + k 길이 누적합/순회. k는 값의 범위'],
          ['공간', 'O(n + k)', '결과 배열 O(n) + 도수 배열 O(k) → 제자리 아님'],
          ['안정성', '안정', '뒤에서부터 배치하면 같은 값의 원래 순서가 보존됨'],
          ['적용 대상', '정수 전용', '값을 인덱스로 쓰므로 정수(또는 정수 사상 가능 값)만'],
          ['비교 여부', '비비교', '원소 간 대소 비교를 하지 않는 분포 기반 정렬'],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '<b>k가 클수록 비효율적</b>: 값의 범위 k가 데이터 수 n보다 훨씬 크면(예: n=1000인데 값이 ' +
          '0~10억) 도수 배열이 거대해져 메모리와 시간이 모두 낭비된다. O(n+k)에서 k가 지배적이 되기 ' +
          '때문이다. 또 <b>실수나 임의 객체</b>에는 인덱스로 쓸 수 없어 그대로는 적용되지 않는다. ' +
          '따라서 \'값의 범위가 좁은 정수\'(시험 점수, 나이, 등급 등)에서만 진가를 발휘한다.',
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '도수 정렬의 <b>안정성</b>은 \'같은 키에 부가 데이터가 딸린\' 정렬에서 중요하다. ' +
          '또한 도수 정렬은 자릿수별로 반복 적용하는 <b>기수 정렬(radix sort)</b>의 핵심 부품이라, ' +
          '큰 범위의 정수도 자릿수 단위로 쪼개 효율적으로 정렬하는 토대가 된다.',
      },
      { type: 'viz', component: 'SortVisualizer', props: { algo: 'counting', lock: true } },
    ],
  },
]
