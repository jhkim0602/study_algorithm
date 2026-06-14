export const details = {
  61: {
    summary: '연결 리스트의 노드는 데이터 필드와 다음 노드를 가리키는 next 링크 필드로 구성되므로 명제는 참이다.',
    reasoning: [
      '연결 리스트는 물리적으로 흩어진 메모리 공간을 <b>논리적 순서</b>로 묶기 위해, 각 원소를 노드(node) 단위로 표현한다.',
      '하나의 노드는 최소 두 가지를 담는다. 하나는 실제 값을 담는 <b>데이터 필드</b>, 다른 하나는 다음 노드의 주소를 담는 <code>next</code> 링크 필드다.',
      '이 <code>next</code> 링크가 있어야 head에서 출발해 노드들을 순서대로 따라갈 수 있다. 링크가 없으면 흩어진 노드를 이어 붙일 방법이 사라진다.',
      '따라서 "각 노드는 데이터와 다음 노드를 가리키는 포인터를 가진다"는 단순 연결 리스트의 정의 그 자체이므로 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '노드는 데이터 필드 + next 링크 필드로 구성된다. 이것이 연결 리스트 노드의 기본 정의다.' },
      { label: 'X', verdict: '오답', why: '데이터만 있고 링크가 없다면 노드들을 연결할 수 없어 연결 리스트 자체가 성립하지 않는다.' }
    ],
    keyConcepts: ['노드 = 데이터 필드 + 링크 필드', 'next는 다음 노드의 주소(참조)', '논리적 순서를 링크로 표현'],
    pitfall: '이중 연결 리스트는 prev까지 갖지만, 그렇다고 단순 연결 리스트가 next를 안 가지는 것은 아니다. next는 모든 연결 리스트의 공통 필수 요소다.'
  },
  62: {
    summary: '단순 연결 리스트는 next만 있어 뒤로 갈 수 없으므로, 어떤 노드의 predecessor를 찾으려면 head부터 다시 따라와야 한다. 참이다.',
    reasoning: [
      'predecessor(선행 노드)는 현재 노드 바로 <b>앞</b>에 있는 노드다.',
      '단순 연결 리스트의 노드는 <code>next</code>만 가지고 <code>prev</code>는 없다. 즉 링크는 앞→뒤 한 방향으로만 흐른다.',
      '현재 노드의 주소만 알고 있을 때, 그 노드의 앞 노드로 "직접" 돌아갈 수단이 없다. 링크를 거꾸로 따라갈 수 없기 때문이다.',
      '결국 head에서 출발해 <code>cur.next == target</code>이 되는 노드를 만날 때까지 순차 탐색해야 한다. 이 과정은 최악 O(n)이다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: 'next 단방향 링크만 있으므로 앞 노드를 알려면 head부터 다시 훑어야 한다.' },
      { label: 'X', verdict: '오답', why: '이중 연결 리스트라면 prev로 O(1)에 가지만, 명제는 단순 연결 리스트를 전제하므로 틀린 진술이 된다.' }
    ],
    keyConcepts: ['단순 연결 리스트는 단방향(next만)', 'predecessor 탐색은 head부터 O(n)', '이중 연결 리스트는 prev로 O(1)'],
    pitfall: '이중 연결 리스트의 prev와 혼동하지 말 것. 단방향 리스트에서는 "현재 노드 포인터만으로 뒤로 가기"가 불가능하다.'
  },
  63: {
    summary: '일반 단순 연결 리스트의 tail.next는 None(끝 표시)이며 자기 자신이 아니다. 명제는 거짓이므로 정답은 X다.',
    reasoning: [
      'tail node(마지막 노드)는 더 이상 이어질 노드가 없다는 사실을 표현해야 한다.',
      '단순 연결 리스트에서 이 "끝"은 <code>tail.next = None</code>으로 나타낸다. 순회 코드는 <code>cur is None</code>일 때 반복을 멈춘다.',
      '만약 <code>tail.next</code>가 자기 자신을 가리킨다면, 순회 시 <code>cur = cur.next</code>가 영원히 같은 노드를 맴돌아 무한 루프에 빠진다.',
      '마지막 노드의 next가 다른 노드(head)를 가리키는 것은 <b>원형 연결 리스트</b>의 특징이다. 일반 단순 리스트가 아니다.',
      '따라서 "tail.next가 자기 자신을 가리킨다"는 거짓이고 정답은 X다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '오답', why: 'tail.next가 자기 자신이면 순회가 무한 루프에 빠진다. 일반 리스트는 이렇게 구현하지 않는다.' },
      { label: 'X', verdict: '정답', why: '일반 단순 리스트의 tail.next는 None이다. 자기 자신도, head도 아니다.' }
    ],
    keyConcepts: ['tail.next = None (끝 표시)', '순회 종료 조건 cur is None', '원형 리스트만 tail.next가 head'],
    pitfall: '원형 연결 리스트(tail.next=head)와 자기 참조(tail.next=tail)는 서로 다르다. 일반 단순 리스트는 둘 다 아니고 None이다.'
  },
  64: {
    summary: '배열은 연속 메모리에 원소를 채우므로 중간 삽입 시 뒤쪽 원소들을 한 칸씩 밀어야 한다. 명제는 참이다.',
    reasoning: [
      '배열 기반 리스트는 원소들을 메모리상 <b>연속된</b> 칸에 인덱스 순서대로 저장한다.',
      'i번 위치에 새 원소를 끼워 넣으려면, 기존 i, i+1, ... 원소들이 차지하던 칸을 비워줘야 한다.',
      '이를 위해 i부터 끝까지의 원소를 모두 한 칸씩 뒤로 이동(shift)시킨다. 맨 앞에 삽입하면 전체 n개를 옮기므로 최악 O(n)이다.',
      '이 "데이터 이동" 비용이 바로 배열 리스트의 약점이며, 링크만 바꾸면 되는 연결 리스트와 대비된다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '연속 메모리 구조이므로 중간 삽입 시 뒤쪽 원소들을 shift해야 하고, 이는 데이터 이동을 유발한다.' },
      { label: 'X', verdict: '오답', why: '배열은 인덱스 접근만 O(1)일 뿐, 중간 삽입·삭제 시 이동 비용이 분명히 발생한다.' }
    ],
    keyConcepts: ['배열은 연속 메모리', '중간/앞 삽입은 shift로 O(n)', '인덱스 접근만 O(1)'],
    pitfall: '맨 끝(append) 삽입은 이동이 없어 amortized O(1)이지만, 중간·앞 삽입은 이동이 발생한다는 점을 구분해야 한다.'
  },
  65: {
    summary: '연결 리스트는 삽입·삭제를 링크 재배선으로 처리하므로 원소 이동이 거의 없다. 명제는 참이다.',
    reasoning: [
      '연결 리스트에서 삽입은 새 노드의 <code>next</code>를 적절히 연결하고, 앞 노드의 <code>next</code>를 새 노드로 바꾸는 것으로 끝난다.',
      '삭제도 마찬가지로 앞 노드의 <code>next</code>를 삭제 대상의 <code>next</code>로 바꾸는, 링크 한두 개 갱신이다.',
      '배열처럼 뒤쪽 원소를 줄줄이 옮기는 작업이 없다. 즉 <b>데이터 자체의 물리적 이동</b>이 발생하지 않는다.',
      '단, 삽입·삭제 위치를 "찾는" 데에는 순차 탐색 O(n)이 들 수 있다. 명제는 이동(이동 비용)에 관한 진술이므로 참이다.',
      '따라서 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '삽입·삭제는 링크 재배선으로 처리되어 원소를 물리적으로 옮길 필요가 없다.' },
      { label: 'X', verdict: '오답', why: '데이터 이동이 적은 것은 연결 리스트의 핵심 장점이다. 이를 부정하면 틀린 진술이 된다.' }
    ],
    keyConcepts: ['삽입·삭제 = 링크 재배선', '데이터 물리 이동 없음', '단, 위치 탐색에는 O(n) 가능'],
    pitfall: '"이동이 적다"와 "삽입·삭제 전체가 O(1)이다"는 다른 말이다. 위치를 모르면 탐색에 O(n)이 들 수 있다.'
  },
  66: {
    summary: '연결 리스트는 임의 접근(O(1) 인덱싱)이 불가능해 이진 탐색의 중간 원소 접근 전제를 만족하지 못한다. 명제는 거짓이므로 정답은 X다.',
    reasoning: [
      '이진 탐색은 정렬된 자료에서 매 단계 <b>가운데 원소</b>에 O(1)로 접근해 탐색 범위를 절반씩 줄이는 기법이다.',
      '이 효율은 "임의 위치를 상수 시간에 접근할 수 있다"는 전제(배열의 인덱싱)에 전적으로 의존한다.',
      '연결 리스트는 인덱스로 바로 점프할 수 없고, 중간 노드에 가려면 head부터 링크를 따라 O(n)을 걸어야 한다.',
      '따라서 매 단계 중간 노드 접근에 O(n)이 들어 이진 탐색의 이점이 사라지고, 사실상 순차 탐색만 못하게 된다. 연결 리스트에는 이진 탐색을 쓰지 않는다.',
      '따라서 명제는 거짓이고 정답은 X다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '오답', why: '이진 탐색은 O(1) 중간 접근이 전제인데 연결 리스트는 이를 못 한다. 일반적으로 사용하지 않는다.' },
      { label: 'X', verdict: '정답', why: '연결 리스트는 임의 접근이 불가능해 이진 탐색에 부적합하다. 기본은 순차 탐색이다.' }
    ],
    keyConcepts: ['이진 탐색 전제 = O(1) 임의 접근', '연결 리스트는 임의 접근 O(n)', '연결 리스트 기본 탐색 = 순차'],
    pitfall: '"정렬되어 있으면 이진 탐색 가능"은 배열에만 해당한다. 정렬돼 있어도 연결 리스트에서는 중간 접근 비용 때문에 의미가 없다.'
  },
  67: {
    summary: 'search()는 진입점인 head에서 시작해 next를 따라 순차적으로 값을 비교하므로 명제는 참이다.',
    reasoning: [
      '연결 리스트에 들어가는 유일한 진입점은 <code>head</code>다. 내부 노드로 직접 점프할 수단이 없다.',
      '따라서 탐색은 <code>cur = head</code>에서 시작해 <code>cur.data == target</code>인지 확인하고, 아니면 <code>cur = cur.next</code>로 한 칸 이동하는 식으로 진행한다.',
      '찾으면 해당 노드를 반환하고, <code>cur is None</code>(끝 도달)이면 탐색 실패를 반환한다.',
      '이 과정이 곧 <b>순차 탐색(linear search)</b>이며 최악 O(n)이다. 연결 리스트 search의 표준 구현이다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: 'head가 유일한 진입점이므로 search는 head부터 next를 따라 순차 비교한다.' },
      { label: 'X', verdict: '오답', why: 'head를 건너뛰고 중간부터 시작할 방법이 없다. 순차 탐색이 표준이다.' }
    ],
    keyConcepts: ['head가 유일한 진입점', '순차 탐색 O(n)', 'cur is None이면 탐색 실패'],
    pitfall: '검색 자체는 O(n)이다. "탐색을 head에서 시작"하는 것이지, 그 비용이 O(1)인 것은 아니다.'
  },
  68: {
    summary: '빈 리스트는 첫 노드가 없으므로 head가 None을 가리킨다. 명제는 참이다.',
    reasoning: [
      '<code>head</code>는 리스트의 첫 번째 노드를 가리키는 참조다.',
      '리스트가 비어 있다는 것은 노드가 하나도 없다는 뜻이므로, head가 가리킬 대상이 존재하지 않는다.',
      '이 "가리킬 노드 없음" 상태를 <code>None</code>(또는 null)으로 표현한다. 즉 <code>head is None</code>이 곧 빈 리스트 판정 조건이다.',
      '실제로 삽입·삭제·순회 코드들은 <code>if head is None</code>으로 빈 리스트 경계 조건을 처리한다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '노드가 없으면 head가 가리킬 대상이 없으므로 head = None이고, 이것이 빈 리스트 판정 조건이다.' },
      { label: 'X', verdict: '오답', why: '빈 리스트인데 head가 어떤 노드를 가리키면 모순이다. head는 None이어야 한다.' }
    ],
    keyConcepts: ['head = 첫 노드 참조', '빈 리스트 ⇔ head is None', '경계 조건 처리의 기준'],
    pitfall: '더미(dummy) head를 쓰는 구현에서는 빈 리스트여도 head가 더미 노드를 가리킬 수 있다. 이 문제는 일반적인 head 기준이다.'
  },
  69: {
    summary: '노드가 1개면 그 노드가 곧 첫 노드(head)이자 마지막 노드(tail)다. 명제는 참이다.',
    reasoning: [
      'head node는 리스트의 첫 노드, tail node는 마지막 노드를 뜻한다.',
      '노드가 정확히 1개라면 그 노드는 "처음"인 동시에 "끝"이다. 앞에도 뒤에도 다른 노드가 없기 때문이다.',
      '따라서 <code>head == tail</code>이 성립하고, 그 노드의 <code>next</code>는 None(단순 리스트 기준)이다.',
      '이 단일 노드 상태는 삽입·삭제 코드에서 자주 등장하는 특수 경계 조건이다. 노드를 지우면 head와 tail이 동시에 None이 된다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '원소가 하나뿐이면 그 노드가 처음이자 끝이므로 head이면서 동시에 tail이다.' },
      { label: 'X', verdict: '오답', why: 'head와 tail이 서로 다른 노드여야 한다는 규칙은 없다. 노드 1개면 둘은 같은 노드다.' }
    ],
    keyConcepts: ['노드 1개 ⇒ head == tail', '단일 노드는 특수 경계 조건', '삭제 시 head·tail 동시에 None'],
    pitfall: '노드 1개 삭제 시 head만 None으로 바꾸고 tail 갱신을 빠뜨리면 댕글링(dangling) tail 버그가 생긴다.'
  },
  70: {
    summary: 'remove_first()는 head를 기존 head.next로 옮겨 첫 노드를 분리한다. 명제는 참이다.',
    reasoning: [
      'remove_first()는 리스트의 첫 노드를 제거하는 연산이다.',
      '첫 노드를 떼어내려면, 리스트의 새 시작점이 기존 두 번째 노드가 되어야 한다.',
      '두 번째 노드는 곧 <code>head.next</code>이므로, <code>head = head.next</code> 한 줄로 head를 옮기면 기존 첫 노드는 리스트에서 분리된다.',
      '어떤 노드의 <code>next</code>도 거꾸로 훑을 필요가 없어 이 연산은 <b>O(1)</b>이다. 단순 연결 리스트가 앞쪽 삭제에 강한 이유다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '첫 노드를 떼면 새 시작점은 head.next이므로 head = head.next로 옮긴다. O(1) 연산이다.' },
      { label: 'X', verdict: '오답', why: 'head를 그대로 두면 첫 노드가 제거되지 않는다. head는 반드시 다음 노드로 이동해야 한다.' }
    ],
    keyConcepts: ['remove_first: head = head.next', '앞쪽 삭제는 O(1)', '단일 노드면 head = None'],
    pitfall: '빈 리스트(head is None)에서 remove_first를 호출하면 head.next 접근이 오류를 낸다. 호출 전 빈 리스트 검사가 필요하다.'
  },
  71: {
    summary: '단순 연결 리스트에서 remove_last는 tail의 prev를 모르므로 head부터 그 직전 노드를 순차 탐색해야 한다. 명제는 참이다.',
    reasoning: [
      'remove_last는 마지막 노드를 제거하는 연산이다. 제거 후 그 직전 노드가 새 tail이 되어야 한다.',
      '새 tail이 될 노드의 <code>next</code>를 None으로 만들어야 하는데, 그러려면 "tail 바로 앞 노드"의 참조가 필요하다.',
      '단순 연결 리스트는 <code>prev</code>가 없어 tail에서 거꾸로 한 칸 갈 수 없다. 결국 head에서 출발해 <code>cur.next.next is None</code>(또는 <code>cur.next == tail</code>)이 되는 노드를 찾아야 한다.',
      '이 직전 노드 탐색은 사실상 리스트 전체를 훑는 작업이라 최악 O(n)이다. 앞쪽 삭제 O(1)과 대조된다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: 'prev가 없어 tail 직전 노드를 알 수 없으므로 head부터 순차 탐색해야 한다. O(n)이다.' },
      { label: 'X', verdict: '오답', why: '이중 연결 리스트라면 prev로 O(1)이지만, 단순 연결 리스트는 직전 노드 탐색이 불가피하다.' }
    ],
    keyConcepts: ['remove_last: 직전 노드 탐색 필요', '단순 리스트는 O(n)', '앞쪽 삭제 O(1)과 비대칭'],
    pitfall: 'tail 포인터를 따로 들고 있어도 단순 리스트에서는 그 직전 노드를 모른다. tail 캐시만으로 remove_last가 O(1)이 되지 않는다.'
  },
  72: {
    summary: 'current는 순회·삽입·삭제 중 지금 다루고 있는 노드를 가리키는 작업용 포인터다. 명제는 참이다.',
    reasoning: [
      '리스트를 순회하거나 특정 위치를 처리할 때, "지금 어느 노드를 보고 있는지"를 기억할 변수가 필요하다.',
      '그 역할을 하는 것이 <code>current</code>(또는 cur) 포인터다. 보통 <code>current = head</code>로 시작해 작업을 진행한다.',
      'head가 리스트의 고정된 시작점이라면, current는 탐색이 진행됨에 따라 <code>current = current.next</code>로 옮겨 다니는 이동용 커서다.',
      '삽입·삭제·탐색 알고리즘은 모두 current가 현재 주목 노드를 가리킨다는 전제로 작성된다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: 'current는 순회·처리 중 지금 주목하는 노드를 가리키는 이동용 포인터다.' },
      { label: 'X', verdict: '오답', why: 'current를 리스트 길이나 head 생성 등 다른 의미로 보는 것은 잘못이다. 주목 노드 참조가 맞다.' }
    ],
    keyConcepts: ['current = 현재 주목 노드', 'head는 고정 시작점, current는 이동 커서', '보통 current = head로 초기화'],
    pitfall: 'current를 옮길 때 head를 그대로 둬야 한다. head를 함께 옮겨버리면 리스트의 시작점을 잃어버린다.'
  },
  73: {
    summary: 'next() 동작은 current를 그 다음 노드(current.next)로 한 칸 전진시킨다. 명제는 참이다.',
    reasoning: [
      '순회를 진행하려면 주목 노드를 한 칸씩 뒤로 옮겨야 한다.',
      '각 노드의 <code>next</code> 링크는 바로 다음 노드를 가리키므로, <code>current = current.next</code>를 실행하면 current가 다음 노드로 이동한다.',
      'next() 함수/연산은 바로 이 "current를 current.next로 갱신"하는 동작을 캡슐화한 것이다.',
      'current가 None에 도달하면 리스트의 끝을 지난 것이므로 순회를 멈춘다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: 'next()는 current = current.next로 주목 노드를 다음 노드로 전진시키는 연산이다.' },
      { label: 'X', verdict: '오답', why: 'next가 current를 이동시키지 않는다면 순회 자체가 불가능해진다. 전진이 그 본질이다.' }
    ],
    keyConcepts: ['next(): current = current.next', '한 칸 전진이 순회의 기본 동작', 'current is None이면 순회 종료'],
    pitfall: 'current가 None일 때 next()를 또 호출하면 None.next 접근으로 오류가 난다. 끝 도달 검사가 필요하다.'
  },
  74: {
    summary: 'clear()는 보통 head에서 시작해 앞에서부터 차례로 노드를 해제한다. "tail부터 반복 삭제"는 옳지 않으므로 정답은 X다.',
    reasoning: [
      'clear()는 리스트의 모든 노드를 제거해 빈 리스트로 만드는 연산이다.',
      '단순 연결 리스트는 next만 있어 앞→뒤 방향으로만 노드를 따라갈 수 있다. tail부터 거꾸로 지우려면 매번 직전 노드를 찾느라 O(n²)이 든다.',
      '따라서 일반적 구현은 <code>cur = head</code>에서 시작해 다음 노드를 임시 저장하고 현재 노드를 해제하며 <b>앞에서부터</b> 진행한다. 마지막에 <code>head = None</code>으로 만든다.',
      '파이썬처럼 GC가 있는 언어에서는 <code>head = None</code> 한 줄로 사슬 전체가 참조를 잃어 회수되기도 한다. 어느 경우든 "tail부터"는 자연스러운 방식이 아니다.',
      '따라서 "tail부터 삭제를 반복한다"는 거짓이고 정답은 X다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '오답', why: '단방향 리스트에서 tail부터 지우면 매번 직전 노드 탐색이 필요해 비효율적이다. 일반적 방식이 아니다.' },
      { label: 'X', verdict: '정답', why: 'clear는 보통 head에서 앞쪽부터 차례로 해제하거나 head = None으로 처리한다. tail부터가 아니다.' }
    ],
    keyConcepts: ['clear는 head부터 앞쪽으로 처리', 'tail부터 삭제는 O(n²)로 비효율', 'GC 언어는 head = None만으로 가능'],
    pitfall: '단방향 리스트에서 "뒤에서부터" 처리한다는 발상은 거의 항상 비효율의 신호다. prev가 없다는 점을 떠올려야 한다.'
  },
  75: {
    summary: '커서 연결 리스트는 실제 포인터 대신 배열 인덱스로 next 링크를 표현한다. 명제는 참이다.',
    reasoning: [
      '커서(cursor) 연결 리스트는 포인터(동적 메모리 주소)를 직접 쓸 수 없거나 쓰고 싶지 않은 환경에서 연결 리스트를 모사하는 기법이다.',
      '노드들을 하나의 배열에 저장하고, 각 노드의 "next"를 실제 주소가 아니라 <b>배열 인덱스</b>(정수)로 표현한다.',
      '예를 들어 <code>arr[i].next = j</code>는 i번 노드의 다음이 j번 칸이라는 의미다. None 대신 -1 같은 특수 인덱스로 끝을 표시한다.',
      '이렇게 하면 동적 할당 없이 정적 배열 안에서 연결 구조를 구현할 수 있고, 삭제된 칸은 free list로 재사용한다.',
      '따라서 "포인터 대신 배열 인덱스를 사용한다"는 커서 리스트의 정의이므로 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '커서 리스트는 next 링크를 배열 인덱스(정수)로 표현한다. 포인터를 쓰지 않는 것이 핵심이다.' },
      { label: 'X', verdict: '오답', why: '커서 리스트의 본질이 바로 인덱스 기반 연결이다. 이를 부정하면 정의에 어긋난다.' }
    ],
    keyConcepts: ['커서 리스트 = 배열 인덱스로 링크 표현', '동적 할당 없이 연결 구조 모사', '끝 표시는 -1 등 특수 인덱스'],
    pitfall: '커서 리스트의 "next"는 메모리 주소가 아니라 같은 배열 안의 칸 번호다. 인덱스를 주소처럼 오해하지 말 것.'
  },
  76: {
    summary: '커서 리스트에서 삭제된 칸을 즉시 재사용하지 않으면 빈 레코드가 쌓일 수 있다. 명제는 참이다.',
    reasoning: [
      '커서 리스트는 고정된 배열 칸 위에 노드를 올려 쓴다. 노드를 삭제하면 그 배열 칸은 더 이상 유효한 데이터가 아닌 "빈 칸"이 된다.',
      '삭제가 반복되는데 이 빈 칸들을 회수해 재사용하지 않으면, 배열 곳곳에 사용 불가능한 빈 레코드가 흩어져 쌓인다.',
      '그 결과 실제 원소 수는 적은데도 배열 공간이 빨리 소진되어, 새 삽입 요청 시 "배열이 꽉 찼다"는 상황이 올 수 있다.',
      '이 문제를 막기 위해 삭제된 칸을 <b>free list</b>로 묶어 다음 삽입 때 재활용한다. 명제는 이 빈 레코드 증가 현상을 정확히 지적한다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '삭제된 칸을 재사용하지 않으면 배열에 빈 레코드가 누적되어 공간을 낭비한다.' },
      { label: 'X', verdict: '오답', why: '커서 리스트는 고정 배열 위에서 동작하므로 삭제 칸 관리를 안 하면 빈 레코드가 늘어난다. 부정은 틀린 진술이다.' }
    ],
    keyConcepts: ['삭제 칸 = 빈 레코드', '재사용 안 하면 공간 낭비', 'free list로 회수·재활용'],
    pitfall: '커서 리스트의 빈 레코드 누적은 free list가 없을 때의 문제다. free list로 관리하면 이 증가를 막을 수 있다.'
  },
  77: {
    summary: 'free list는 삭제로 비워진 칸들을 모아 두었다가 새 삽입 시 재사용하는 구조다. 명제는 참이다.',
    reasoning: [
      'free list(프리 리스트)는 커서 리스트에서 삭제로 비워진 배열 칸들을 별도의 연결 사슬로 관리하는 장치다.',
      '노드를 삭제하면 그 칸을 버리지 않고 free list의 머리에 끼워 넣는다(흔히 LIFO 방식).',
      '새 노드를 삽입할 때는 새 칸을 찾아 헤매지 않고 free list에서 칸 하나를 꺼내 즉시 재사용한다.',
      '이렇게 하면 삭제로 생긴 빈 칸이 누적되지 않고 순환 재활용되어 배열 공간을 효율적으로 쓴다. 명제가 말하는 "재사용 구조"와 정확히 일치한다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: 'free list는 삭제된 레코드를 모아 두었다가 삽입 시 재사용하기 위한 구조다. 정의 그대로다.' },
      { label: 'X', verdict: '오답', why: 'free list의 목적이 바로 삭제 공간 재사용이다. 이를 부정하면 정의에 어긋난다.' }
    ],
    keyConcepts: ['free list = 빈 칸 재사용 사슬', '삭제 시 free list에 반납', '삽입 시 free list에서 칸 꺼내 사용'],
    pitfall: 'free list는 데이터 리스트와 별개의 사슬이다. 두 사슬은 같은 배열을 공유하되 머리(head)가 서로 다르다.'
  },
  78: {
    summary: '원형 연결 리스트는 마지막 노드의 next가 head를 가리켜 처음과 끝이 이어진다. 명제는 참이다.',
    reasoning: [
      '원형(circular) 연결 리스트는 단순 리스트의 "끝"을 None으로 끊지 않고, 마지막 노드를 다시 처음으로 잇는 구조다.',
      '구체적으로 <code>tail.next = head</code>로 설정해 리스트를 하나의 고리로 만든다.',
      '덕분에 어느 노드에서 출발하든 next만 계속 따라가면 결국 모든 노드를 거쳐 다시 출발점으로 돌아온다. 라운드로빈 스케줄링 등에 유용하다.',
      '명제 "tail node의 next가 head node를 가리킨다"는 원형 리스트의 정의 그 자체다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '원형 리스트는 tail.next = head로 끝과 처음을 잇는다. 이것이 원형 구조의 정의다.' },
      { label: 'X', verdict: '오답', why: 'tail.next가 None이면 일반 단순 리스트다. 원형 리스트에서는 head를 가리킨다.' }
    ],
    keyConcepts: ['원형 리스트: tail.next = head', '끝과 처음이 고리로 연결', '라운드로빈 등에 활용'],
    pitfall: '원형 리스트 순회는 None을 만날 수 없으므로, "head로 한 바퀴 돌아왔는지"를 종료 조건으로 삼아야 무한 루프를 피한다.'
  },
  79: {
    summary: '이중 연결 리스트의 노드는 앞 노드 prev와 뒤 노드 next를 모두 가진다. 명제는 참이다.',
    reasoning: [
      '이중(doubly) 연결 리스트는 단순 리스트의 단방향 한계를 보완하기 위해 각 노드에 링크를 하나 더 둔다.',
      '각 노드는 다음 노드를 가리키는 <code>next</code>와 이전 노드를 가리키는 <code>prev</code>를 모두 보유한다.',
      '덕분에 어떤 노드에서든 앞·뒤 양방향으로 이동할 수 있고, predecessor를 head부터 다시 찾을 필요 없이 <code>cur.prev</code>로 O(1)에 접근한다.',
      '이는 remove_last 같은 뒤쪽 연산이나 역방향 순회를 효율적으로 만든다. 추가 prev 링크만큼 메모리는 더 든다.',
      '명제 "각 노드가 prev와 next를 모두 가진다"는 이중 연결 리스트의 정의이므로 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '이중 연결 리스트의 노드는 prev와 next를 모두 가져 양방향 이동이 가능하다. 정의 그대로다.' },
      { label: 'X', verdict: '오답', why: 'next만 가지면 단순 연결 리스트다. 이중 리스트는 prev도 반드시 가진다.' }
    ],
    keyConcepts: ['이중 리스트 노드 = prev + next', '양방향 탐색 가능', 'predecessor 접근이 O(1)'],
    pitfall: '이중 리스트는 삽입·삭제 시 prev와 next 양쪽 링크를 모두 갱신해야 한다. 한쪽만 고치면 링크가 끊긴다.'
  },
  80: {
    summary: '더미(dummy) 노드는 빈 리스트·끝 노드 같은 특수 경계를 일반 경우처럼 다루게 해 삽입·삭제 코드를 단순화한다. 명제는 참이다.',
    reasoning: [
      '원형 이중 연결 리스트에서 더미(sentinel) 노드는 실제 데이터를 담지 않고 리스트의 기준점 역할만 하는 가짜 노드다.',
      '더미를 두면 리스트가 비어 있어도 항상 더미 노드 하나가 존재하므로, "head가 None인 빈 리스트" 같은 특수 케이스가 사라진다.',
      '삽입·삭제 시 "맨 앞인지", "맨 뒤인지", "리스트가 비었는지"를 따로 분기하지 않고, 항상 두 이웃 노드 사이에 끼우거나 빼는 <b>일반 로직 하나</b>로 처리할 수 있다.',
      '결과적으로 경계 조건(boundary case) 분기가 크게 줄어 코드가 짧고 버그가 적어진다. 명제가 말하는 "삽입·삭제 단순화"와 정확히 일치한다.',
      '따라서 명제는 참이고 정답은 O다.'
    ],
    optionAnalysis: [
      { label: 'O', verdict: '정답', why: '더미 노드는 빈 리스트·끝 노드 같은 경계 조건을 없애 삽입·삭제를 단일 로직으로 처리하게 해준다.' },
      { label: 'X', verdict: '오답', why: '더미 노드의 도입 목적이 바로 경계 조건 단순화다. 이를 부정하면 그 효용을 잘못 본 것이다.' }
    ],
    keyConcepts: ['더미(sentinel) 노드 = 데이터 없는 기준점', '경계 조건 분기 제거', '삽입·삭제를 단일 로직으로 통일'],
    pitfall: '더미 노드 자체는 데이터가 아니므로 순회·길이 계산 시 세지 않도록 주의해야 한다.'
  },
}
