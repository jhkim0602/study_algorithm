// Ch06 정렬 알고리즘 — 개념 + 문제 40 (객관식 20 + 코드형 20)
// 원본: 정렬알고리즘_문제정리_전체수정본_Q4수정.pdf / 정답해설_전체수정본_Q4수정.pdf

export const ch06 = {
  id: 'ch06',
  slug: 'sorting',
  title: 'Ch06 정렬 알고리즘',
  subtitle: '정렬의 평가 기준과 8가지 대표 알고리즘',
  concept: {
    summary:
      '정렬(sorting)은 데이터를 정해진 기준에 따라 순서대로 재배치하는 연산이다. 모든 정렬은 ' +
      '시간복잡도, 안정성(stable), 제자리(in-place) 라는 세 축으로 비교·선택한다. 비교 기반 정렬은 ' +
      '원소끼리 대소를 비교하고, 비비교(분포 기반) 정렬은 값 자체의 분포를 이용한다.',
    blocks: [
      { type: 'h3', text: '정렬을 보는 3가지 축' },
      {
        type: 'list',
        items: [
          '<b>시간복잡도</b> — 입력 크기 n에 따른 비교·이동 횟수. 최선/평균/최악을 구분한다.',
          '<b>안정성(stable)</b> — 같은 키를 가진 원소들의 원래 상대 순서가 정렬 후에도 보존되면 안정 정렬이다.',
          '<b>제자리(in-place)</b> — 입력 배열 외에 거의 추가 메모리(O(1)~O(log n))만 쓰면 제자리 정렬이다.',
        ],
      },
      {
        type: 'p',
        html:
          '비교 기반 정렬의 이론적 하한은 <code>Ω(n log n)</code>이다. 따라서 어떤 비교 정렬도 평균적으로 ' +
          '이보다 빠를 수 없다. 이 한계를 넘으려면 비교를 하지 않는 <b>도수 정렬(counting sort)</b>처럼 ' +
          '값의 분포를 직접 이용해야 한다.',
      },
      { type: 'h3', text: '8가지 대표 정렬 한눈에 보기' },
      {
        type: 'table',
        headers: ['알고리즘', '평균', '최악', '안정성', '제자리', '핵심 아이디어'],
        rows: [
          ['버블 정렬', 'O(n²)', 'O(n²)', '안정', 'O', '인접한 두 원소를 비교·교환'],
          ['선택 정렬', 'O(n²)', 'O(n²)', '불안정', 'O', '남은 구간의 최솟값을 골라 앞에 배치'],
          ['삽입 정렬', 'O(n²)', 'O(n²)', '안정', 'O', '앞쪽 정렬 구간에 끼워 넣기 (거의 정렬 시 O(n))'],
          ['쉘 정렬', 'O(n^1.3~1.5)', 'O(n²)', '불안정', 'O', 'gap 간격 삽입 정렬을 점점 좁혀가며 반복'],
          ['퀵 정렬', 'O(n log n)', 'O(n²)', '불안정', 'O', 'pivot 기준 분할 정복'],
          ['병합 정렬', 'O(n log n)', 'O(n log n)', '안정', 'X', '반으로 나눠 정렬 후 병합 (보조 배열)'],
          ['힙 정렬', 'O(n log n)', 'O(n log n)', '불안정', 'O', '최대 힙(완전이진트리)에서 루트를 빼냄'],
          ['도수 정렬', 'O(n+k)', 'O(n+k)', '안정', 'X', '값 범위 k의 개수를 세는 비비교 정렬'],
        ],
      },
      { type: 'h4', text: '버블 · 선택 · 삽입 (단순 O(n²) 정렬)' },
      {
        type: 'p',
        html:
          '<b>버블 정렬</b>은 인접 원소를 비교해 큰 값을 뒤로 밀며, 한 회전 동안 교환이 없으면 조기 종료할 수 있다. ' +
          '<b>선택 정렬</b>은 매 회차 남은 구간 전체를 훑어 최솟값을 찾아 앞으로 보내므로, 입력 상태와 무관하게 비교 ' +
          '횟수가 항상 n(n-1)/2로 일정하지만 교환은 회차당 1번뿐이다. <b>삽입 정렬</b>은 앞쪽이 이미 정렬된 상태로 ' +
          '보고 새 원소를 적절한 위치에 끼워 넣는다. 거의 정렬된 데이터에서는 이동이 거의 없어 O(n)에 가깝다.',
      },
      { type: 'h4', text: '쉘 정렬' },
      {
        type: 'p',
        html:
          '삽입 정렬은 멀리 떨어진 원소를 한 칸씩만 옮기는 단점이 있다. <b>쉘 정렬</b>은 gap 간격으로 떨어진 원소들끼리 ' +
          '먼저 삽입 정렬한 뒤 gap을 점점 줄여(예: 3 → 1) 마지막에 일반 삽입 정렬로 마무리한다. 큰 단위로 미리 ' +
          '대강 정렬해 두기 때문에 마지막 단계의 이동량이 크게 줄어든다.',
      },
      { type: 'h4', text: '퀵 · 병합 (분할 정복)' },
      {
        type: 'p',
        html:
          '<b>퀵 정렬</b>은 pivot을 기준으로 작은 값/큰 값으로 분할(partition)한 뒤 양쪽을 재귀 정렬한다. 평균 ' +
          'O(n log n)이지만, <b>이미 정렬된 데이터에서 나쁜 pivot</b>을 고르면 분할이 한쪽으로 치우쳐 최악 O(n²)이 된다. ' +
          '<b>병합 정렬</b>은 배열을 반으로 나눠 각각 정렬한 후 두 정렬된 부분을 병합한다. 입력과 무관하게 항상 ' +
          'O(n log n)이고 안정적이지만, 병합용 보조 배열이 필요해 제자리 정렬이 아니다.',
      },
      { type: 'h4', text: '힙 · 도수' },
      {
        type: 'p',
        html:
          '<b>힙 정렬</b>은 배열을 완전이진트리로 보고 최대 힙을 구성(build heap, O(n))한 뒤, 루트(최댓값)를 맨 뒤로 ' +
          '보내고 힙 크기를 줄이며 down-heap을 반복한다. <b>도수 정렬</b>은 값마다 개수를 세어 누적합으로 위치를 정하는 ' +
          '비교 없는 정렬로, 값의 범위 k가 작을 때 O(n+k)로 매우 빠르지만 k가 크면 메모리·시간이 낭비된다.',
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '아래 시각화에서 배열을 직접 입력하고 알고리즘을 골라 <b>단계 실행</b>해 보세요. 막대 색으로 비교(노랑)·' +
          '교환(빨강)·정렬 완료(초록)를 구분합니다.',
      },
      { type: 'viz', component: 'SortVisualizer' },
    ],
  },
  problems: [
    // ── 객관식 (개념) ──
    {
      no: 1, type: 'choice',
      prompt: '다음 중 안정 정렬(stable sort)에 해당하는 것은?',
      options: ['선택 정렬', '힙 정렬', '삽입 정렬', '퀵 정렬'],
      answer: 3,
      explanation: '삽입 정렬은 같은 값의 상대적 순서를 유지하는 안정 정렬이다.',
      concepts: ['정렬 안정성', '삽입 정렬'],
    },
    {
      no: 2, type: 'choice',
      prompt: '다음 중 항상 O(n log n)의 시간복잡도를 가지는 정렬은?',
      options: ['퀵 정렬', '병합 정렬', '버블 정렬', '삽입 정렬'],
      answer: 2,
      explanation: '병합 정렬은 입력 상태와 관계없이 분할과 병합을 반복하므로 항상 O(n log n)을 보장한다.',
      concepts: ['병합 정렬', '시간복잡도'],
    },
    {
      no: 3, type: 'choice',
      prompt: '다음 중 제자리 정렬(in-place sort)이 아닌 것은?',
      options: ['선택 정렬', '삽입 정렬', '병합 정렬', '힙 정렬'],
      answer: 3,
      explanation: '병합 정렬은 병합 과정에서 보조 배열이 필요하므로 일반적으로 제자리 정렬이 아니다.',
      concepts: ['제자리 정렬', '병합 정렬'],
    },
    {
      no: 4, type: 'choice',
      prompt: '다음 중 비교 기반 정렬이 아닌 것은?',
      options: ['병합 정렬', '퀵 정렬', '도수 정렬', '힙 정렬'],
      answer: 3,
      explanation:
        '도수 정렬은 원소를 직접 비교하지 않고 값의 빈도/범위를 이용하는 비비교 정렬이다. 따라서 비교 기반 정렬이 아니다.',
      concepts: ['비교 기반 정렬', '도수 정렬'],
    },
    {
      no: 5, type: 'choice',
      prompt: '다음 중 최악의 경우 O(n²)의 시간복잡도를 가지는 정렬은?',
      options: ['병합 정렬', '힙 정렬', '퀵 정렬', '도수 정렬'],
      answer: 3,
      explanation: '퀵 정렬은 pivot이 계속 한쪽으로 치우치면 분할이 불균형해져 최악 O(n²)이 된다.',
      concepts: ['퀵 정렬', '시간복잡도'],
    },
    {
      no: 6, type: 'choice',
      prompt: '다음 중 버블 정렬의 특징으로 옳은 것은?',
      options: ['분할 정복 기반이다', '인접한 두 요소를 비교하여 교환한다', '항상 빠른 성능을 보장한다', '추가 메모리를 많이 사용한다'],
      answer: 2,
      explanation: '버블 정렬은 인접한 두 원소를 비교하고 필요하면 교환하면서 큰 값을 뒤로 보낸다.',
      concepts: ['버블 정렬'],
    },
    {
      no: 7, type: 'choice',
      prompt: '다음 중 선택 정렬의 특징으로 옳은 것은?',
      options: ['안정 정렬이다', '입력 상태에 따라 성능이 달라진다', '비교 횟수가 항상 동일하다', '재귀를 사용한다'],
      answer: 3,
      explanation: '선택 정렬은 매 회차 남은 구간 전체를 검사해 최솟값을 찾으므로 비교 횟수가 입력 상태와 거의 무관하게 일정하다.',
      concepts: ['선택 정렬'],
    },
    {
      no: 8, type: 'choice',
      prompt: '다음 중 삽입 정렬이 효율적인 경우는?',
      options: ['완전히 무작위 데이터', '역순 데이터', '거의 정렬된 데이터', '매우 큰 데이터'],
      answer: 3,
      explanation: '삽입 정렬은 앞부분이 이미 정렬되어 있을수록 이동이 적어 거의 정렬된 데이터에서 효율적이다.',
      concepts: ['삽입 정렬'],
    },
    {
      no: 9, type: 'choice',
      prompt: '다음 중 쉘 정렬의 특징으로 옳은 것은?',
      options: ['항상 안정 정렬이다', 'Gap을 이용하여 멀리 떨어진 요소를 정렬한다', '분할 정복 방식이다', '추가 메모리를 많이 사용한다'],
      answer: 2,
      explanation: '쉘 정렬은 gap 간격으로 떨어진 원소들을 먼저 정렬한 뒤 gap을 줄여간다.',
      concepts: ['쉘 정렬'],
    },
    {
      no: 10, type: 'choice',
      prompt: '다음 중 퀵 정렬의 특징으로 옳은 것은?',
      options: ['항상 O(n log n)이다', '안정 정렬이다', '피벗을 기준으로 분할한다', '비교 연산을 사용하지 않는다'],
      answer: 3,
      explanation: '퀵 정렬은 pivot을 기준으로 작은 값과 큰 값을 나누는 partition 과정이 핵심이다.',
      concepts: ['퀵 정렬', '분할 정복'],
    },
    {
      no: 11, type: 'choice',
      prompt: '다음 중 병합 정렬의 특징으로 옳은 것은?',
      options: ['제자리 정렬이다', '항상 일정한 시간복잡도를 가진다', '비교 연산을 사용하지 않는다', '힙 구조를 사용한다'],
      answer: 2,
      explanation: '병합 정렬은 최선/평균/최악 모두 O(n log n)으로 비교적 일정한 시간복잡도를 가진다.',
      concepts: ['병합 정렬', '시간복잡도'],
    },
    {
      no: 12, type: 'choice',
      prompt: '다음 중 힙 정렬의 특징으로 옳은 것은?',
      options: ['안정 정렬이다', '분할 정복 방식이다', '완전이진트리를 사용한다', '비교 연산을 사용하지 않는다'],
      answer: 3,
      explanation: '힙 정렬은 배열을 완전이진트리 형태의 힙 구조로 보고 정렬한다.',
      concepts: ['힙 정렬', '완전 이진 트리'],
    },
    {
      no: 13, type: 'choice',
      prompt: '다음 중 도수 정렬의 특징으로 옳은 것은?',
      options: ['비교 기반 정렬이다', '항상 빠르다', '값의 범위에 의존한다', '실수 데이터에 적합하다'],
      answer: 3,
      explanation: '도수 정렬은 값의 범위만큼 count 배열을 만들기 때문에 값의 범위 k에 영향을 크게 받는다.',
      concepts: ['도수 정렬'],
    },
    {
      no: 14, type: 'choice',
      prompt: '다음 중 힙 생성(build heap)의 시간복잡도는?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
      answer: 1,
      explanation: 'bottom-up 방식으로 힙을 만들면 전체 build heap 시간복잡도는 O(n)이다.',
      concepts: ['힙 정렬', '시간복잡도'],
    },
    {
      no: 15, type: 'choice',
      prompt: '다음 중 퀵 정렬의 최악의 경우로 가장 적절한 것은?',
      options: ['랜덤 데이터', '데이터 개수가 적은 경우', '이미 정렬된 데이터 + 나쁜 pivot 선택', '중복 데이터'],
      answer: 3,
      explanation: '이미 정렬된 데이터에서 나쁜 pivot을 고르면 한쪽 분할만 계속 커져 최악의 경우가 된다.',
      concepts: ['퀵 정렬', '시간복잡도'],
    },
    {
      no: 16, type: 'choice',
      prompt: '다음 중 병합 정렬과 퀵 정렬의 차이로 옳은 것은?',
      options: ['병합 정렬은 제자리 정렬이다', '퀵 정렬은 항상 안정 정렬이다', '병합 정렬은 추가 메모리를 사용한다', '퀵 정렬은 분할 정복이 아니다'],
      answer: 3,
      explanation: '병합 정렬은 병합 단계에서 보조 배열이 필요하지만 퀵 정렬은 보통 제자리 분할을 사용한다.',
      concepts: ['병합 정렬', '퀵 정렬', '제자리 정렬'],
    },
    {
      no: 17, type: 'choice',
      prompt: '다음 중 정렬 알고리즘 선택 기준으로 적절하지 않은 것은?',
      options: ['데이터 크기', '데이터 분포', '메모리 제약', '변수 이름'],
      answer: 4,
      explanation: '데이터 크기, 분포, 메모리 제약은 정렬 선택 기준이지만 변수 이름은 알고리즘 선택과 무관하다.',
      concepts: ['정렬 알고리즘 선택'],
    },
    {
      no: 18, type: 'choice',
      prompt: '다음 중 도수 정렬이 비효율적인 경우는?',
      options: ['데이터 개수가 많을 때', '데이터 범위(k)가 매우 클 때', '중복 데이터가 많을 때', '정수 데이터일 때'],
      answer: 2,
      explanation: '도수 정렬은 데이터 범위 k가 매우 크면 count 배열이 커져 메모리와 시간이 낭비된다.',
      concepts: ['도수 정렬'],
    },
    {
      no: 19, type: 'choice',
      prompt: '다음 중 정렬 알고리즘의 안정성에 영향을 주는 요소는?',
      options: ['비교 방식', 'CPU 속도', '운영체제', '컴파일러'],
      answer: 1,
      explanation: '안정성은 같은 값을 만났을 때 비교 및 교환을 어떻게 처리하는지에 따라 달라진다.',
      concepts: ['정렬 안정성'],
    },
    {
      no: 20, type: 'choice',
      prompt: '다음 중 삽입 정렬과 선택 정렬의 차이로 옳은 것은?',
      options: ['선택 정렬은 안정 정렬이다', '삽입 정렬은 데이터 이동이 많다', '선택 정렬은 O(n)이다', '삽입 정렬은 비교를 하지 않는다'],
      answer: 2,
      explanation: '삽입 정렬은 값을 밀어 넣는 과정에서 데이터 이동이 많을 수 있고, 선택 정렬은 보통 각 회차에 한 번 교환한다.',
      concepts: ['삽입 정렬', '선택 정렬'],
    },
    // ── 코드형 문제 ──
    {
      no: 21, type: 'code', topic: '버블 정렬',
      prompt: '다음 코드의 실행 결과는? (버블 정렬)',
      code:
        'arr = [5, 3, 4, 1, 2]\n' +
        'for i in range(2):\n' +
        '    for j in range(0, len(arr)-1-i):\n' +
        '        if arr[j] > arr[j+1]:\n' +
        '            arr[j], arr[j+1] = arr[j+1], arr[j]\n\n' +
        'print(arr)',
      options: ['[1, 2, 3, 4, 5]', '[3, 4, 1, 2, 5]', '[3, 1, 2, 4, 5]', '[5, 4, 3, 2, 1]'],
      answer: 3,
      explanation: '1회전 후 [3, 4, 1, 2, 5], 2회전 후 4가 제자리로 이동하여 [3, 1, 2, 4, 5]가 된다.',
      concepts: ['버블 정렬', '코드 추적'],
    },
    {
      no: 22, type: 'code', topic: '버블 정렬',
      prompt: '다음 코드의 실행 결과는? (버블 정렬 - 비교 횟수)',
      code:
        'arr = [1, 2, 3, 4]\n' +
        'cnt = 0\n' +
        'for i in range(len(arr)-1):\n' +
        '    for j in range(len(arr)-1-i):\n' +
        '        cnt += 1\n' +
        '        if arr[j] > arr[j+1]:\n' +
        '            arr[j], arr[j+1] = arr[j+1], arr[j]\n\n' +
        'print(cnt)',
      options: ['3', '4', '6', '10'],
      answer: 3,
      explanation: 'n=4 버블 정렬의 비교 횟수는 3+2+1=6이다.',
      concepts: ['버블 정렬', '비교 횟수'],
    },
    {
      no: 23, type: 'code', topic: '버블 정렬',
      prompt: '다음 코드의 실행 결과는? (버블 정렬 - 조기 종료)',
      code:
        'arr = [1, 2, 3, 4]\n' +
        'cnt = 0\n' +
        'for i in range(len(arr)-1):\n' +
        '    swapped = False\n' +
        '    for j in range(len(arr)-1-i):\n' +
        '        cnt += 1\n' +
        '        if arr[j] > arr[j+1]:\n' +
        '            arr[j], arr[j+1] = arr[j+1], arr[j]\n' +
        '            swapped = True\n\n' +
        '    if not swapped:\n' +
        '        break\n\n' +
        'print(cnt)',
      options: ['3', '4', '6', '10'],
      answer: 1,
      explanation: '이미 정렬되어 있어 첫 번째 바깥 반복에서 3번 비교 후 swapped가 False이므로 바로 break된다.',
      concepts: ['버블 정렬', '조기 종료'],
    },
    {
      no: 24, type: 'code', topic: '선택 정렬',
      prompt: '다음 코드의 실행 결과는? (선택 정렬)',
      code:
        'arr = [4, 2, 5, 1, 3]\n' +
        'for i in range(2):\n' +
        '    min_idx = i\n' +
        '    for j in range(i+1, len(arr)):\n' +
        '        if arr[j] < arr[min_idx]:\n' +
        '            min_idx = j\n' +
        '    arr[i], arr[min_idx] = arr[min_idx], arr[i]\n\n' +
        'print(arr)',
      options: ['[1, 2, 3, 4, 5]', '[1, 2, 5, 4, 3]', '[1, 4, 5, 2, 3]', '[2, 4, 1, 5, 3]'],
      answer: 2,
      explanation: '1회차에 1을 맨 앞으로 보내 [1, 2, 5, 4, 3]이 되고, 2회차에서는 2가 이미 제자리라 그대로이다.',
      concepts: ['선택 정렬', '코드 추적'],
    },
    {
      no: 25, type: 'code', topic: '선택 정렬',
      prompt: '다음 코드가 오름차순 선택 정렬이 되기 위해 빈칸에 들어갈 값은? (선택 정렬 - 빈칸 추론)',
      code:
        'arr = [3, 1, 4, 2]\n' +
        'for i in range(len(arr)-1):\n' +
        '    min_idx = i\n' +
        '    for j in range(i+1, len(arr)):\n' +
        '        if arr[j] < arr[min_idx]:\n' +
        '            min_idx = j\n' +
        '    arr[i], arr[____] = arr[____], arr[i]\n\n' +
        'print(arr)',
      options: ['i, j', 'min_idx, min_idx', 'j, i', 'i+1, min_idx'],
      answer: 2,
      explanation: '선택 정렬의 교환은 현재 위치 i와 최솟값 위치 min_idx 사이에서 일어나므로 두 빈칸 모두 min_idx이다.',
      concepts: ['선택 정렬', '빈칸 추론'],
    },
    {
      no: 26, type: 'code', topic: '선택 정렬',
      prompt: '다음 코드의 출력 결과는? (선택 정렬 - 비교 횟수)',
      code:
        'arr = [5, 4, 3, 2, 1]\n' +
        'cnt = 0\n' +
        'for i in range(len(arr)-1):\n' +
        '    for j in range(i+1, len(arr)):\n' +
        '        cnt += 1\n\n' +
        'print(cnt)',
      options: ['5', '10', '15', '20'],
      answer: 2,
      explanation: '선택 정렬의 비교 횟수는 4+3+2+1=10이다.',
      concepts: ['선택 정렬', '비교 횟수'],
    },
    {
      no: 27, type: 'code', topic: '삽입 정렬',
      prompt: '다음 코드의 출력 결과는? (삽입 정렬)',
      code:
        'arr = [4, 2, 3, 1]\n' +
        'for i in range(1, 3):\n' +
        '    key = arr[i]\n' +
        '    j = i - 1\n' +
        '    while j >= 0 and arr[j] > key:\n' +
        '        arr[j+1] = arr[j]\n' +
        '        j -= 1\n' +
        '    arr[j+1] = key\n\n' +
        'print(arr)',
      options: ['[2, 3, 4, 1]', '[1, 2, 3, 4]', '[2, 4, 3, 1]', '[4, 3, 2, 1]'],
      answer: 1,
      explanation: 'i=1에서 2를 4 앞에 넣고, i=2에서 3을 4 앞에 넣어 [2, 3, 4, 1]이 된다.',
      concepts: ['삽입 정렬', '코드 추적'],
    },
    {
      no: 28, type: 'code', topic: '삽입 정렬',
      prompt: '다음 코드의 출력 결과는? (삽입 정렬 - 이동 횟수)',
      code:
        'arr = [5, 3, 4, 1]\n' +
        'move = 0\n' +
        'for i in range(1, len(arr)):\n' +
        '    key = arr[i]\n' +
        '    j = i - 1\n' +
        '    while j >= 0 and arr[j] > key:\n' +
        '         arr[j+1] = arr[j]\n' +
        '         move += 1\n' +
        '         j -= 1\n' +
        '    arr[j+1] = key\n\n' +
        'print(move)',
      options: ['3', '4', '5', '6'],
      answer: 3,
      explanation: '3을 넣을 때 1회, 4를 넣을 때 1회, 1을 넣을 때 3회 이동하여 총 5회이다.',
      concepts: ['삽입 정렬', '이동 횟수'],
    },
    {
      no: 29, type: 'code', topic: '삽입 정렬',
      prompt: '오름차순 삽입 정렬이 되기 위해 빈칸에 들어갈 것은? (삽입 정렬 - 빈칸 추론)',
      code:
        'arr = [3, 1, 2]\n' +
        'for i in range(1, len(arr)):\n' +
        '    key = arr[i]\n' +
        '    j = i - 1\n\n' +
        '    while j >= 0 and arr[j] > key:\n' +
        '        arr[j+1] = arr[j]\n' +
        '        j -= 1\n\n' +
        '    arr[____] = key\n' +
        'print(arr)',
      options: ['j', 'j+1', 'i', 'i+1'],
      answer: 2,
      explanation: 'while이 끝난 뒤 j는 key보다 작거나 같은 값의 위치이므로 key는 arr[j+1]에 들어간다.',
      concepts: ['삽입 정렬', '빈칸 추론'],
    },
    {
      no: 30, type: 'code', topic: '쉘 정렬',
      prompt: '다음 코드의 출력 결과는? (쉘 정렬)',
      code:
        'arr = [8, 1, 6, 2, 5, 3]\n' +
        'gap = 3\n' +
        'for i in range(gap, len(arr)):\n' +
        '    temp = arr[i]\n' +
        '    j = i\n' +
        '    while j >= gap and arr[j-gap] > temp:\n' +
        '        arr[j] = arr[j-gap]\n' +
        '        j -= gap\n' +
        '    arr[j] = temp\n\n' +
        'print(arr)',
      options: ['[1, 2, 3, 5, 6, 8]', '[2, 1, 3, 8, 5, 6]', '[5, 1, 3, 2, 8, 6]', '[1, 8, 2, 6, 3, 5]'],
      answer: 2,
      explanation: 'gap=3으로 (0,3), (1,4), (2,5) 위치를 비교한다. 8과 2, 6과 3이 바뀌어 [2, 1, 3, 8, 5, 6]이 된다.',
      concepts: ['쉘 정렬', '코드 추적'],
    },
    {
      no: 31, type: 'code', topic: '퀵 정렬',
      prompt: '다음 코드의 출력 결과는? (퀵 정렬 - partition 결과)',
      code:
        'arr = [6, 3, 8, 2, 5]\n' +
        'pivot = arr[0]\n' +
        'left = []\n' +
        'right = []\n' +
        'for x in arr[1:]:\n' +
        '    if x < pivot:\n' +
        '        left.append(x)\n' +
        '    else:\n' +
        '        right.append(x)\n\n' +
        'print(left, pivot, right)',
      options: ["[3, 2, 5] 6 [8]", "[2, 3, 5] 6 [8]", "[3, 8, 2, 5] 6 []", "[8] 6 [3, 2, 5]"],
      answer: 1,
      explanation: 'pivot 6보다 작은 3, 2, 5는 left, 큰 8은 right에 들어가므로 [3, 2, 5] 6 [8]이다.',
      concepts: ['퀵 정렬', '분할(partition)'],
    },
    {
      no: 32, type: 'code', topic: '퀵 정렬',
      prompt: '다음 코드의 출력 결과는? (퀵 정렬 - 재귀 결과)',
      code:
        'def quick_sort(arr):\n' +
        '    if len(arr) <= 1:\n' +
        '        return arr\n\n' +
        '    pivot = arr[0]\n' +
        '    left = [x for x in arr[1:] if x < pivot]\n' +
        '    right = [x for x in arr[1:] if x >= pivot]\n\n' +
        '    return quick_sort(left) + [pivot] + quick_sort(right)\n' +
        'print(quick_sort([4, 2, 4, 1]))',
      options: ['[1, 2, 4]', '[1, 2, 4, 4]', '[4, 4, 2, 1]', '오류'],
      answer: 2,
      explanation: 'pivot 4 기준으로 [2,1]과 [4]로 나뉘고 재귀 정렬 결과가 합쳐져 [1, 2, 4, 4]가 된다.',
      concepts: ['퀵 정렬', '재귀'],
    },
    {
      no: 33, type: 'code', topic: '퀵 정렬',
      prompt: '빈칸에 들어갈 값은? (퀵 정렬 - 빈칸 추론)',
      code:
        'def quick_sort(arr):\n' +
        '    if len(arr) <= 1:\n' +
        '        return arr\n\n' +
        '    pivot = arr[0]\n' +
        '    left = [x for x in arr[1:] if x < pivot]\n' +
        '    right = [x for x in arr[1:] if x >= pivot]\n\n' +
        '    return quick_sort(left) + [____] + quick_sort(right)\n' +
        'print(quick_sort([3, 1, 2]))',
      options: ['arr', 'left', 'pivot', 'right'],
      answer: 3,
      explanation: '퀵 정렬은 quick_sort(left) + [pivot] + quick_sort(right) 형태로 pivot을 가운데에 둔다.',
      concepts: ['퀵 정렬', '빈칸 추론'],
    },
    {
      no: 34, type: 'code', topic: '퀵 정렬',
      prompt: '다음 코드의 출력 결과는? (퀵 정렬 - 제자리 partition)',
      code:
        'arr = [6, 4, 8, 3, 5]\n' +
        'pivot = arr[0]\n' +
        'left = 1\n' +
        'right = len(arr) - 1\n' +
        'while left <= right:\n' +
        '    while left <= right and arr[left] <= pivot:\n' +
        '         left += 1\n' +
        '    while left <= right and arr[right] >= pivot:\n' +
        '         right -= 1\n' +
        '    if left < right:\n' +
        '         arr[left], arr[right] = arr[right], arr[left]\n' +
        'arr[0], arr[right] = arr[right], arr[0]\n' +
        'print(arr)',
      options: ['[5, 4, 3, 6, 8]', '[3, 4, 5, 6, 8]', '[4, 3, 5, 6, 8]', '[6, 4, 8, 3, 5]'],
      answer: 2,
      explanation: 'pivot 6보다 작은 값들을 왼쪽으로 모은 뒤 pivot과 right 위치를 교환해 [3, 4, 5, 6, 8]이 된다.',
      concepts: ['퀵 정렬', '분할(partition)'],
    },
    {
      no: 35, type: 'code', topic: '병합 정렬',
      prompt: '다음 코드의 출력 결과는? (병합 정렬 - merge 과정)',
      code:
        'left = [1, 4, 7]\n' +
        'right = [2, 3, 6]\n' +
        'result = []\n' +
        'i = j = 0\n' +
        'while i < len(left) and j < len(right):\n' +
        '    if left[i] <= right[j]:\n' +
        '        result.append(left[i])\n' +
        '        i += 1\n' +
        '    else:\n' +
        '        result.append(right[j])\n' +
        '        j += 1\n' +
        'result += left[i:]\n' +
        'result += right[j:]\n' +
        'print(result)',
      options: ['[1, 2, 3, 4, 6, 7]', '[1, 4, 7, 2, 3, 6]', '[2, 3, 6, 1, 4, 7]', '[1, 2, 4, 3, 6, 7]'],
      answer: 1,
      explanation: '두 정렬된 리스트를 작은 값부터 result에 넣고 남은 값을 붙이면 [1, 2, 3, 4, 6, 7]이다.',
      concepts: ['병합 정렬', 'merge'],
    },
    {
      no: 36, type: 'code', topic: '병합 정렬',
      prompt: '다음 코드의 출력 결과는? (병합 정렬 - 안정성)',
      code:
        "left = [(2, 'A'), (3, 'B')]\n" +
        "right = [(2, 'C'), (4, 'D')]\n" +
        'result = []\n' +
        'i = j = 0\n' +
        'while i < len(left) and j < len(right):\n' +
        '    if left[i][0] <= right[j][0]:\n' +
        '        result.append(left[i])\n' +
        '        i += 1\n' +
        '    else:\n' +
        '        result.append(right[j])\n' +
        '        j += 1\n' +
        'result += left[i:]\n' +
        'result += right[j:]\n' +
        'print(result)',
      options: [
        "[(2, 'A'), (2, 'C'), (3, 'B'), (4, 'D')]",
        "[(2, 'C'), (2, 'A'), (3, 'B'), (4, 'D')]",
        "[(2, 'A'), (3, 'B'), (2, 'C'), (4, 'D')]",
        '오류',
      ],
      answer: 1,
      explanation: "비교 조건이 <=이므로 같은 key 2에서는 left의 (2, 'A')가 먼저 들어가 안정성이 유지된다.",
      concepts: ['병합 정렬', '정렬 안정성'],
    },
    {
      no: 37, type: 'code', topic: '힙 정렬',
      prompt: '다음 코드의 출력 결과는? (힙 정렬 - down heap 1회)',
      code:
        'arr = [3, 8, 7, 1, 5]\n' +
        'parent = 0\n' +
        'child = 1\n' +
        'if child + 1 < len(arr) and arr[child] < arr[child+1]:\n' +
        '    child += 1\n' +
        'if arr[parent] < arr[child]:\n' +
        '    arr[parent], arr[child] = arr[child], arr[parent]\n' +
        'print(arr)',
      options: ['[8, 3, 7, 1, 5]', '[7, 8, 3, 1, 5]', '[3, 8, 7, 1, 5]', '[8, 7, 3, 1, 5]'],
      answer: 1,
      explanation: '두 자식 8과 7 중 큰 자식은 8이고, parent 3과 교환해 [8, 3, 7, 1, 5]가 된다.',
      concepts: ['힙 정렬', 'down heap'],
    },
    {
      no: 38, type: 'code', topic: '힙 정렬',
      prompt: '다음 코드의 출력 결과는? (힙 정렬 - heapify)',
      code:
        'arr = [4, 10, 3, 5, 1]\n' +
        'n = len(arr)\n' +
        '# heapify (최대 힙 구성)\n' +
        'for i in range(n//2 - 1, -1, -1):\n' +
        '    parent = i\n' +
        '    child = 2 * parent + 1\n' +
        '    if child + 1 < n and arr[child] < arr[child+1]:\n' +
        '        child += 1\n' +
        '    if arr[parent] < arr[child]:\n' +
        '        arr[parent], arr[child] = arr[child], arr[parent]\n\n' +
        'print(arr)',
      options: ['[10, 5, 3, 4, 1]', '[10, 4, 3, 5, 1]', '[4, 10, 3, 5, 1]', '[5, 10, 3, 4, 1]'],
      answer: 2,
      explanation: 'i=1에서는 10이 5보다 커서 그대로이고, i=0에서 4와 10이 교환되어 [10, 4, 3, 5, 1]이 된다.',
      concepts: ['힙 정렬', 'heapify'],
    },
    {
      no: 39, type: 'code', topic: '도수 정렬',
      prompt: '다음 코드의 출력 결과는? (도수 정렬 - 도수 배열)',
      code:
        'arr = [2, 0, 1, 2, 1, 0, 2]\n' +
        'count = [0] * 3\n' +
        'for x in arr:\n' +
        '    count[x] += 1\n' +
        'print(count)',
      options: ['[2, 2, 3]', '[3, 2, 2]', '[0, 1, 2]', '[2, 3, 2]'],
      answer: 1,
      explanation: '0은 2개, 1은 2개, 2는 3개이므로 count는 [2, 2, 3]이다.',
      concepts: ['도수 정렬', '도수 배열'],
    },
    {
      no: 40, type: 'code', topic: '도수 정렬',
      prompt: '다음 코드의 출력 결과는? (도수 정렬 - 누적 도수)',
      code:
        'count = [2, 2, 3]\n' +
        'for i in range(1, len(count)):\n' +
        '    count[i] += count[i-1]\n' +
        'print(count)',
      options: ['[2, 2, 3]', '[2, 4, 7]', '[7, 5, 3]', '[0, 2, 4]'],
      answer: 2,
      explanation: '누적합을 만들면 count[1]=2+2=4, count[2]=3+4=7이 되어 [2, 4, 7]이다.',
      concepts: ['도수 정렬', '누적 합'],
    },
  ],
}
