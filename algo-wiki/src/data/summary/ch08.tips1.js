export const tips = {
  41: {
    focus: "배열 기반 리스트의 특징 고르기",
    steps: [
      { label: '핵심', text: "배열 = 연속 메모리 + <code>인덱스로 바로 접근</code>" },
      { label: '적용', text: "삽입·삭제는 데이터 이동 큼(오답), 포인터·비연속은 연결 리스트 특징(오답)" },
    ],
    answer: "배열은 인덱스로 원하는 칸에 O(1) 접근",
    mnemonic: "배열=칸번호로 순간이동 / 연결=한칸씩 걸어가기",
  },
  42: {
    focus: "연결 리스트의 장점 고르기",
    steps: [
      { label: '핵심', text: "연결 = 링크(next)만 바꾸면 끝 → 데이터 이동 적음" },
      { label: '적용', text: "인덱스 빠름·메모리 적음은 배열 쪽, 정렬 유지는 무관(오답)" },
    ],
    answer: "링크만 조정하므로 삽입·삭제 시 데이터 이동이 적다",
    mnemonic: "연결의 자랑거리=삽입·삭제 가볍다",
  },
  43: {
    focus: "단순 연결 리스트에서 마지막 노드 삭제가 비효율적인 이유",
    steps: [
      { label: '핵심', text: "삭제하려면 tail의 '바로 앞 노드(predecessor)'를 알아야 함" },
      { label: '적용', text: "next만 있어 뒤로만 감 → 앞 노드는 head부터 다시 찾아야 함" },
    ],
    answer: "단순 리스트는 이전 노드를 바로 알 수 없어 head부터 순차 탐색 필요",
    mnemonic: "next만 있으면 뒤돌아보기 불가 = 앞 노드 못 봄",
  },
  44: {
    focus: "단순 연결 리스트 노드가 담는 정보",
    steps: [
      { label: '핵심', text: "노드 = <code>데이터 + next</code>(다음 노드 주소)" },
      { label: '적용', text: "힙 주소·부모 노드·루트 주소는 트리/기타 개념(오답)" },
    ],
    answer: "노드는 데이터와 다음 노드를 가리키는 next를 가진다",
    mnemonic: "노드 = 알맹이(데이터) + 화살표(next)",
  },
  45: {
    focus: "predecessor node의 의미",
    steps: [
      { label: '핵심', text: "pre = '앞' → 현재 노드의 바로 앞 노드" },
      { label: '적용', text: "부모·자식·리프는 트리 용어라 함정(오답)" },
    ],
    answer: "predecessor는 현재 노드 바로 앞 노드",
    mnemonic: "pre(앞)decessor=선행 / suc(뒤)cessor=후속",
  },
  46: {
    focus: "successor node의 의미",
    steps: [
      { label: '핵심', text: "successor = '뒤' → 현재 노드의 바로 뒤 노드" },
      { label: '적용', text: "부모·리프·루트는 트리 용어(오답)" },
    ],
    answer: "successor는 현재 노드 바로 뒤 노드",
    mnemonic: "성공(success)은 다음에 온다 → 뒤 노드",
  },
  47: {
    focus: "연결 리스트의 기본 탐색 방식",
    steps: [
      { label: '핵심', text: "인덱스로 못 뛰어감 → head부터 한 칸씩" },
      { label: '적용', text: "이진·해시·트리 탐색은 임의 접근/다른 구조 필요(오답)" },
    ],
    answer: "head부터 차례로 따라가는 순차 탐색이 기본",
    mnemonic: "연결=계단 한 칸씩=순차 탐색",
  },
  48: {
    focus: "연결 리스트가 중간 삽입에 유리한 이유",
    steps: [
      { label: '핵심', text: "중간 삽입 = 앞뒤 링크만 다시 연결" },
      { label: '적용', text: "배열은 뒤 칸 전부 밀어야 함 ↔ 연결은 안 밀어도 됨" },
    ],
    answer: "링크 조정만으로 처리되어 데이터 대량 이동이 없다",
    mnemonic: "끼워넣기=화살표만 바꿔 끼우면 끝",
  },
  49: {
    focus: "연결 리스트의 단점 고르기",
    steps: [
      { label: '핵심', text: "인덱스가 없음 → i번째를 바로 못 집음(임의 접근 ✗)" },
      { label: '적용', text: "삽입 불가·저장 불가·포인터 불가는 모두 거짓(오답)" },
    ],
    answer: "인덱스로 바로 접근하는 임의 접근이 어렵다",
    mnemonic: "연결의 약점='몇 번째' 콕 집기",
  },
  50: {
    focus: "단순 연결 리스트 마지막 노드의 next 값",
    steps: [
      { label: '핵심', text: "마지막 = 다음 노드가 없음" },
      { label: '적용', text: "자기 자신·head는 원형 리스트 이야기, predecessor는 방향이 반대(오답)" },
    ],
    answer: "다음 노드가 없으므로 next는 None",
    mnemonic: "끝=막다른 길=None / 끝이 head 가리키면 원형",
  },
  51: {
    focus: "current 포인터의 역할",
    steps: [
      { label: '핵심', text: "current = '지금 보고 있는' 노드" },
      { label: '적용', text: "길이 저장·삭제·head 생성은 current가 할 일 아님(오답)" },
    ],
    answer: "current는 현재 처리·탐색 중인 노드를 가리킨다",
    mnemonic: "current=손가락(지금 짚은 칸)",
  },
  52: {
    focus: "remove_first() 수행 결과",
    steps: [
      { label: '핵심', text: "첫 노드 제거 = head를 '한 칸 뒤'로" },
      { label: '적용', text: "<code>head = head.next</code> → 둘째 노드가 새 head" },
    ],
    answer: "head를 기존 head.next로 옮긴다",
    mnemonic: "앞 빼기=head 한 칸 전진(O(1))",
  },
  53: {
    focus: "커서 연결 리스트 구현의 특징",
    steps: [
      { label: '핵심', text: "포인터 대신 <code>배열 인덱스</code>로 연결 표현" },
      { label: '적용', text: "완전 리스트·삭제 불가·트리 전용은 거짓(오답)" },
    ],
    answer: "포인터 대신 배열 인덱스로 다음 칸을 가리킨다",
    mnemonic: "커서=포인터 없는 환경의 '주소=배열 번호'",
  },
  54: {
    focus: "커서 연결 리스트의 free list 역할",
    steps: [
      { label: '핵심', text: "free = '비어 재사용 가능한' 칸 모음" },
      { label: '적용', text: "트리 높이·정렬 유지·재귀는 무관(오답)" },
    ],
    answer: "삭제된 레코드(빈 칸)를 모아 재사용 관리",
    mnemonic: "free list=빈 자리 대기열(재활용 통)",
  },
  55: {
    focus: "커서 리스트에서 삭제만 반복되면 생기는 문제",
    steps: [
      { label: '핵심', text: "삭제 칸이 재사용 안 되면 그냥 쌓임" },
      { label: '적용', text: "루트 충돌·이진탐색·배열접근 불가는 무관(오답)" },
    ],
    answer: "재사용되지 않으면 빈 레코드가 계속 증가",
    mnemonic: "빼기만 하고 안 채우면 빈칸만 늘어남",
  },
  56: {
    focus: "원형 연결 리스트의 특징",
    steps: [
      { label: '핵심', text: "원형 = 끝이 처음으로 이어짐(tail.next=head)" },
      { label: '적용', text: "tail.next가 None이면 단순 리스트(오답), head 없음·prev 필수는 거짓" },
    ],
    answer: "마지막 노드가 첫 노드(head)를 가리킨다",
    mnemonic: "원형=뱀이 꼬리 물기(끝→처음)",
  },
  57: {
    focus: "이중 연결 리스트 노드가 담는 정보",
    steps: [
      { label: '핵심', text: "이중 = 양방향 → <code>prev + next</code> 둘 다" },
      { label: '적용', text: "next만/prev만/인덱스만은 단순·다른 구조(오답)" },
    ],
    answer: "노드가 prev와 next 포인터를 모두 가진다",
    mnemonic: "이중=양손에 화살표(앞 prev, 뒤 next)",
  },
  58: {
    focus: "이중 연결 리스트의 장점",
    steps: [
      { label: '핵심', text: "prev 덕분에 뒤로도 갈 수 있음" },
      { label: '적용', text: "메모리는 오히려 더 씀, O(1) 검색·정렬 향상은 거짓(오답)" },
    ],
    answer: "prev·next로 앞뒤 양방향 탐색이 가능",
    mnemonic: "이중의 장점=뒤돌아보기 가능",
  },
  59: {
    focus: "원형 이중 연결 리스트의 설명",
    steps: [
      { label: '핵심', text: "이름 그대로 '원형' + '이중'의 결합" },
      { label: '적용', text: "배열+트리·큐+스택·힙은 다른 조합(오답)" },
    ],
    answer: "원형 구조와 이중 연결 구조를 결합한 형태",
    mnemonic: "이름 풀면 답: 원형(끝→처음)+이중(prev·next)",
  },
  60: {
    focus: "연결 리스트 데이터 탐색의 시간복잡도",
    steps: [
      { label: '핵심', text: "head부터 끝까지 순차 확인 → 최악 n번" },
      { label: '적용', text: "O(1)·O(log n)은 임의/이진 접근 가정(오답), O(n²)는 이중 루프(오답)" },
    ],
    answer: "처음부터 끝까지 순차 탐색하므로 O(n)",
    mnemonic: "한 칸씩 n번=O(n) / 이진은 정렬+임의접근 있어야",
  },
}
