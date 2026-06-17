// Ch08 리스트 — 문제별 풀이전략(tips) 61~80 (O/X)
// 시험 직전 빠른 암기·풀이용. 각 tip: focus, steps, answer, mnemonic

export const tips = {
  61: {
    focus: '연결 리스트 노드의 기본 구성 (O/X)',
    steps: [
      { label: '핵심', text: '노드 = 데이터 필드 + next(다음 노드 주소) 링크' },
      { label: '적용', text: '"데이터 + 다음 노드 포인터" = 연결 리스트 노드의 정의 그대로' },
    ],
    answer: '노드는 데이터와 next 링크를 가지므로 참',
    mnemonic: '노드 = 알맹이(데이터) + 화살표(next)',
  },
  62: {
    focus: '단순 연결 리스트에서 predecessor 찾기 (O/X)',
    steps: [
      { label: '핵심', text: '단순 리스트는 next만 있다 = 단방향, 뒤로 못 감' },
      { label: '적용', text: '앞 노드(predecessor)를 알려면 head부터 다시 훑어야 함 → 참' },
    ],
    answer: 'next만 있어 거꾸로 못 가므로 head부터 순차 탐색 필요 (O(n))',
    mnemonic: '단방향 = 일방통행, 앞으로 못 봐서 처음부터 다시',
  },
  63: {
    focus: '일반 단순 리스트 tail의 next 값 (O/X)',
    steps: [
      { label: '핵심', text: '함정: "자기 자신을 가리킨다"' },
      { label: '적용', text: '일반 tail.next = None(끝 표시). 자기 자신이면 무한 루프' },
    ],
    answer: 'tail.next는 None이지 자기 자신이 아니므로 거짓',
    mnemonic: 'tail.next=None(끝) / =head면 원형 / =자기자신은 둘 다 아님',
  },
  64: {
    focus: '배열 리스트의 중간 삽입 비용 (O/X)',
    steps: [
      { label: '핵심', text: '배열 = 연속 메모리 = 자리 비우려면 밀어야 함' },
      { label: '적용', text: '중간 삽입 시 뒤쪽 원소 shift → 데이터 이동 발생 → 참' },
    ],
    answer: '연속 공간이라 중간 삽입 시 뒤 원소를 밀어야 하므로 참',
    mnemonic: '배열은 만원 지하철, 가운데 타려면 다 밀어야',
  },
  65: {
    focus: '연결 리스트의 삽입·삭제 데이터 이동 (O/X)',
    steps: [
      { label: '핵심', text: '연결 리스트는 링크(화살표)만 바꾼다' },
      { label: '적용', text: '데이터 자체를 옮기지 않으므로 이동 거의 없음 → 참' },
    ],
    answer: '링크만 변경해서 처리하므로 데이터 이동이 적어 참',
    mnemonic: '연결=화살표만 다시 그림, 알맹이는 안 옮김',
  },
  66: {
    focus: '연결 리스트의 검색 방식 (O/X)',
    steps: [
      { label: '핵심', text: '함정: "이진 검색(binary search) 사용"' },
      { label: '적용', text: '이진 검색은 인덱스 임의 접근 필요 → 연결 리스트는 불가 → 거짓' },
    ],
    answer: '임의 접근이 안 되어 이진 검색 부적합, 순차 탐색이 기본이라 거짓',
    mnemonic: '이진 검색은 배열 전용(가운데 콕 집기), 연결은 처음부터 줄줄',
  },
  67: {
    focus: 'search() 함수의 탐색 시작점 (O/X)',
    steps: [
      { label: '핵심', text: '연결 리스트 탐색의 출발은 항상 head' },
      { label: '적용', text: 'head에서 next 따라 순차 확인 → 참' },
    ],
    answer: 'head부터 순차적으로 따라가며 찾으므로 참',
    mnemonic: '연결 리스트는 무조건 head에서 출발',
  },
  68: {
    focus: '빈 리스트일 때 head 값 (O/X)',
    steps: [
      { label: '핵심', text: '빈 리스트 = 가리킬 노드가 없음' },
      { label: '적용', text: 'head가 가리킬 대상이 없으니 None → 참' },
    ],
    answer: '빈 리스트는 노드가 없어 head = None이므로 참',
    mnemonic: '비었다 = head가 None',
  },
  69: {
    focus: '노드 1개일 때 head/tail 관계 (O/X)',
    steps: [
      { label: '핵심', text: '노드가 하나뿐이면 그게 처음이자 끝' },
      { label: '적용', text: '유일한 노드 = head이면서 동시에 tail → 참' },
    ],
    answer: '노드가 하나면 첫 노드이자 마지막 노드이므로 참',
    mnemonic: '혼자면 반장이자 막내',
  },
  70: {
    focus: 'remove_first 후 head 변화 (O/X)',
    steps: [
      { label: '핵심', text: '첫 노드 삭제 = head를 다음으로 한 칸 이동' },
      { label: '적용', text: 'head = head.next 로 변경 → 참 (O(1))' },
    ],
    answer: '첫 노드 제거 시 head를 기존 head.next로 옮기므로 참',
    mnemonic: 'remove_first = head 한 칸 앞으로(head=head.next)',
  },
  71: {
    focus: 'remove_last의 순차 탐색 필요성 (O/X)',
    steps: [
      { label: '핵심', text: '단순 리스트는 tail 직전 노드를 바로 모른다' },
      { label: '적용', text: '마지막 직전 노드를 head부터 찾아야 함 → 참' },
    ],
    answer: '단순 리스트는 tail 이전 노드를 알려면 순차 탐색 필요하므로 참',
    mnemonic: 'remove_first는 O(1), remove_last는 단방향이라 처음부터 다시',
  },
  72: {
    focus: 'current 포인터의 역할 (O/X)',
    steps: [
      { label: '핵심', text: 'current = 지금 주목 중인 노드' },
      { label: '적용', text: '탐색·처리하는 현재 노드를 가리킴 → 참' },
    ],
    answer: 'current는 현재 주목하는 노드를 가리키므로 참',
    mnemonic: 'current = 지금 보고 있는 손가락',
  },
  73: {
    focus: 'next() 함수의 동작 (O/X)',
    steps: [
      { label: '핵심', text: 'next() = current를 다음으로 이동' },
      { label: '적용', text: 'current = current.next 로 한 칸 전진 → 참' },
    ],
    answer: 'next()는 current를 current.next로 옮기므로 참',
    mnemonic: 'next()=손가락 한 칸 앞으로',
  },
  74: {
    focus: 'clear() 함수의 삭제 순서 (O/X)',
    steps: [
      { label: '핵심', text: '함정: "tail부터 삭제 반복"' },
      { label: '적용', text: '단방향 리스트는 head부터 차례로 처리 → tail부터는 비현실적 → 거짓' },
    ],
    answer: 'clear는 보통 head부터 차례로 처리하므로 "tail부터"는 거짓',
    mnemonic: '단방향에서 뒤(tail)부터 지우긴 어렵다 = 함정',
  },
  75: {
    focus: '커서 연결 리스트의 연결 표현 (O/X)',
    steps: [
      { label: '핵심', text: '커서 = 포인터 대신 배열 인덱스로 연결' },
      { label: '적용', text: 'next 자리에 주소가 아니라 배열 칸 번호 저장 → 참' },
    ],
    answer: '커서 방식은 포인터 대신 배열 인덱스를 링크로 쓰므로 참',
    mnemonic: '커서 = 포인터 없이 인덱스(칸 번호)로 연결',
  },
  76: {
    focus: '커서 리스트의 삭제 반복 시 문제 (O/X)',
    steps: [
      { label: '핵심', text: '삭제 칸을 재사용 안 하면 빈 칸이 쌓임' },
      { label: '적용', text: '삭제 반복 → 빈 레코드 증가 가능 → 참' },
    ],
    answer: '삭제가 반복되면 빈 레코드가 늘 수 있으므로 참',
    mnemonic: '삭제만 하고 안 치우면 빈 칸(레코드) 쌓인다',
  },
  77: {
    focus: 'free list의 역할 (O/X)',
    steps: [
      { label: '핵심', text: 'free list = 삭제된 빈 칸 모음' },
      { label: '적용', text: '삭제된 레코드를 재사용하려고 관리 → 참' },
    ],
    answer: 'free list는 삭제된 레코드를 재사용하기 위한 구조이므로 참',
    mnemonic: 'free list = 빈 칸 재활용 창고',
  },
  78: {
    focus: '원형 리스트에서 tail.next (O/X)',
    steps: [
      { label: '핵심', text: '원형 = 끝과 처음이 이어짐' },
      { label: '적용', text: 'tail.next가 head를 가리킴 → 참' },
    ],
    answer: '원형 리스트의 tail.next는 head를 가리키므로 참',
    mnemonic: '원형 = tail이 head 손잡고 한 바퀴',
  },
  79: {
    focus: '이중 연결 리스트 노드 구성 (O/X)',
    steps: [
      { label: '핵심', text: '이중(double) = 양쪽 링크 둘 다' },
      { label: '적용', text: '각 노드가 prev + next 모두 보유 → 참' },
    ],
    answer: '이중 연결 리스트 노드는 prev와 next를 모두 가지므로 참',
    mnemonic: '이중 = 앞화살(prev) + 뒤화살(next) 둘 다',
  },
  80: {
    focus: '원형 이중 리스트의 더미 노드 역할 (O/X)',
    steps: [
      { label: '핵심', text: '더미(dummy) = 경계 조건 줄이는 빈 노드' },
      { label: '적용', text: '빈 리스트·양끝 예외를 없애 삽입·삭제 단순화 → 참' },
    ],
    answer: '더미 노드는 경계 조건을 줄여 삽입·삭제를 단순화하므로 참',
    mnemonic: '더미 = 양 끝 예외 막아주는 완충 노드',
  },
}
