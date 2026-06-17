// Ch06 정렬 알고리즘 — 코드형 문제(21~40) 풀이전략 tips
// 형광펜=코드에서 봐야 할 핵심 / 떠올릴 것=개념 / 적용=값 추적
export const tips = {
  21: {
    focus: "바깥 루프가 2번만 도는 부분 버블 정렬의 결과",
    steps: [
      { label: '형광펜', text: "<code>for i in range(2)</code> — 2회전만 돈다" },
      { label: '떠올릴 것', text: "버블 1회전 = 최댓값이 맨 뒤로 확정" },
      { label: '적용', text: "1회전 → [3,4,1,2,5](5 확정), 2회전 → [3,1,2,4,5](4 확정). 앞 3,1,2는 그대로" },
    ],
    answer: "2회전만 하므로 5,4만 뒤로 가고 앞쪽은 미정렬 → [3,1,2,4,5]",
    mnemonic: "range가 작으면 끝까지 안 돈다 의심. 버블 = 큰 거품이 위(뒤)로",
  },
  22: {
    focus: "조기 종료 없는 버블 정렬의 비교 횟수",
    steps: [
      { label: '형광펜', text: "<code>cnt += 1</code>이 안쪽 루프마다, swapped/break 없음" },
      { label: '떠올릴 것', text: "버블 비교 횟수 = n(n-1)/2 (입력과 무관, 고정)" },
      { label: '적용', text: "n=4 → 3+2+1 = 6" },
    ],
    answer: "비교 총합 = 4·3/2 = 6",
    mnemonic: "비교는 (n-1)+(n-2)+…+1. 정렬돼 있어도 break 없으면 다 센다",
  },
  23: {
    focus: "조기 종료(swapped) 버블 정렬에서 정렬된 입력의 비교 횟수",
    steps: [
      { label: '형광펜', text: "<code>swapped=False</code> … <code>if not swapped: break</code>" },
      { label: '떠올릴 것', text: "한 패스에 교환 0번이면 정렬 완료로 보고 즉시 break (최선 O(n))" },
      { label: '적용', text: "[1,2,3,4]는 이미 정렬 → 1회전 3번 비교, 교환 0 → break. cnt=3" },
    ],
    answer: "첫 패스 n-1=3번 비교 후 교환 없어 break",
    mnemonic: "break는 바깥 루프를 끝낸다(swapped 검사가 안쪽 루프 밖)",
  },
  24: {
    focus: "바깥 루프가 2번만 도는 부분 선택 정렬의 결과",
    steps: [
      { label: '형광펜', text: "<code>for i in range(2)</code> + min_idx 찾아 swap" },
      { label: '떠올릴 것', text: "선택 1회차 = 남은 구간 최솟값 1개를 앞으로 확정" },
      { label: '적용', text: "i=0: 최솟값 1을 맨 앞으로 → [1,2,5,4,3]. i=1: 2가 이미 제자리 → 변화 없음" },
    ],
    answer: "1만 앞으로 오고 2는 그대로 → [1,2,5,4,3]",
    mnemonic: "선택=최솟값 골라 맨 앞. range(2)면 앞 2자리만 확정",
  },
  25: {
    focus: "선택 정렬 swap 빈칸 (현재 위치 i ↔ 최솟값 위치 min_idx)",
    steps: [
      { label: '형광펜', text: "<code>arr[i], arr[__] = arr[__], arr[i]</code>" },
      { label: '떠올릴 것', text: "선택 정렬은 i 자리와 찾은 최솟값 자리(min_idx)를 맞바꾼다" },
      { label: '적용', text: "표준 swap = <code>arr[i], arr[min_idx] = arr[min_idx], arr[i]</code> → 두 칸 다 min_idx" },
    ],
    answer: "교환 상대는 둘 다 min_idx여야 swap 성립",
    mnemonic: "swap은 좌우 인덱스가 X자로 엇갈린다. 한쪽만 바꾸면 깨짐",
  },
  26: {
    focus: "선택 정렬의 비교 횟수 (입력과 무관하게 고정)",
    steps: [
      { label: '형광펜', text: "<code>cnt += 1</code>만 있고 교환 코드는 없음 (순수 비교 카운트)" },
      { label: '떠올릴 것', text: "선택 비교 횟수 = n(n-1)/2, 역순이든 정렬이든 항상 동일" },
      { label: '적용', text: "n=5 → 4+3+2+1 = 10" },
    ],
    answer: "비교 총합 = 5·4/2 = 10",
    mnemonic: "선택은 '비교 많고 교환 적다'. 비교는 항상 n(n-1)/2 고정",
  },
  27: {
    focus: "바깥 루프가 2번만 도는 부분 삽입 정렬의 결과",
    steps: [
      { label: '형광펜', text: "<code>for i in range(1, 3)</code> — i=1,2만 처리 (마지막 원소 미처리)" },
      { label: '떠올릴 것', text: "삽입 = key를 앞 정렬 구간 알맞은 자리에 끼움" },
      { label: '적용', text: "i=1: 2를 앞으로 → [2,4,3,1]. i=2: 3 끼움 → [2,3,4,1]. 1은 안 건드림" },
    ],
    answer: "range(1,3)이라 1은 미처리 → [2,3,4,1]",
    mnemonic: "range(1,3)=i 1,2뿐. 마지막 원소 정렬 안 됨 주의",
  },
  28: {
    focus: "삽입 정렬의 이동(밀기) 횟수",
    steps: [
      { label: '형광펜', text: "while 안 <code>arr[j+1] = arr[j]; move += 1</code> (밀기만 카운트)" },
      { label: '떠올릴 것', text: "이동 = 앞 원소를 한 칸씩 미는 횟수 = 역전(inversion) 수" },
      { label: '적용', text: "[5,3,4,1]: 3넣기 1회 + 4넣기 1회 + 1을 맨앞까지 3회 = 5" },
    ],
    answer: "밀기 합 = 1+1+3 = 5",
    mnemonic: "제자리 배치 arr[j+1]=key는 안 셈. 밀기(arr[j+1]=arr[j])만 카운트",
  },
  29: {
    focus: "삽입 정렬 삽입 위치 빈칸 (key가 들어갈 칸)",
    steps: [
      { label: '형광펜', text: "while 끝난 뒤 <code>arr[__] = key</code>" },
      { label: '떠올릴 것', text: "while은 j를 한 번 더 줄이고 멈춤 → 빈 칸은 j+1" },
      { label: '적용', text: "arr[j]가 key 이하인 위치에서 멈춤 → 그 다음 칸 arr[j+1]에 key" },
    ],
    answer: "while 종료 후 빈 칸은 항상 j+1 (j 아님)",
    mnemonic: "off-by-one: j는 한 번 더 내려갔다 → 삽입은 j+1",
  },
  30: {
    focus: "gap=3 한 단계만 수행하는 쉘 정렬의 결과",
    steps: [
      { label: '형광펜', text: "<code>gap = 3</code> (gap을 줄이는 외부 루프 없음 → 부분 정렬)" },
      { label: '떠올릴 것', text: "쉘 = gap 간격 떨어진 원소끼리만 삽입 정렬. 그룹 {0,3},{1,4},{2,5}" },
      { label: '적용', text: "{0,3}:8,2→2,8 / {1,4}:1,5 그대로 / {2,5}:6,3→3,6 ⇒ [2,1,3,8,5,6]" },
    ],
    answer: "gap=1 패스가 없어 완전 정렬 아님 → [2,1,3,8,5,6]",
    mnemonic: "gap=3이면 3칸 떨어진 짝끼리만 비교. gap 안 줄면 미완성",
  },
  31: {
    focus: "퀵 정렬 partition 결과 (정렬 아님, 분리만)",
    steps: [
      { label: '형광펜', text: "<code>pivot = arr[0]</code>, x<pivot이면 left 아니면 right, append" },
      { label: '떠올릴 것', text: "partition은 작은/큰으로 '분리'만. 정렬 X, 등장 순서 보존" },
      { label: '적용', text: "pivot=6: 3,2,5는 작아서 left(순서대로), 8은 right → [3,2,5] 6 [8]" },
    ],
    answer: "left는 정렬 안 된 등장 순서 그대로 → [3,2,5] 6 [8]",
    mnemonic: "left=작은 값 모음일 뿐 정렬 아님. append 순서 유지",
  },
  32: {
    focus: "재귀 퀵 정렬 결과 (중복 값 보존)",
    steps: [
      { label: '형광펜', text: "<code>right = [x ... if x >= pivot]</code> — 등호 포함!" },
      { label: '떠올릴 것', text: ">= 라서 pivot과 같은 중복 값도 right에 살아남음 → 원소 안 사라짐" },
      { label: '적용', text: "pivot=4: left=[2,1]→[1,2], right=[4]. 합 [1,2]+[4]+[4]=[1,2,4,4]" },
    ],
    answer: "중복 4가 >= 조건으로 보존 → [1,2,4,4]",
    mnemonic: ">= 의 등호가 중복을 살린다. > 면 중복 누락",
  },
  33: {
    focus: "퀵 정렬 결합식 빈칸 (left와 right 사이 값)",
    steps: [
      { label: '형광펜', text: "<code>quick_sort(left) + [__] + quick_sort(right)</code>" },
      { label: '떠올릴 것', text: "결합식 = 작은쪽 + [pivot] + 큰쪽. 가운데는 분할 기준 pivot" },
      { label: '적용', text: "[3,1,2]: pivot=3, left=[1,2], right=[] → [1,2]+[3]+[]=[1,2,3]" },
    ],
    answer: "left·right 사이 확정 위치는 분할 기준 pivot",
    mnemonic: "퀵 결합 = 왼 + [피벗] + 오. 가운데 칸은 늘 pivot",
  },
  34: {
    focus: "제자리(in-place) partition 결과",
    steps: [
      { label: '형광펜', text: "두 포인터 left/right로 좁히고, 마지막 <code>arr[0], arr[right] = ...</code>" },
      { label: '떠올릴 것', text: "작은 값을 왼쪽에 모은 뒤 pivot을 경계(right) 위치와 교환해 확정" },
      { label: '적용', text: "pivot=6: 8↔5 → [6,4,5,3,8], 교차 후 arr[0]↔arr[3]: 6↔3 → [3,4,5,6,8]" },
    ],
    answer: "pivot을 right 경계와 교환 → 6 제자리, [3,4,5,6,8]",
    mnemonic: "마지막 교환은 pivot↔right(left 아님). 그래야 작은 값 바로 뒤",
  },
  35: {
    focus: "병합 정렬 merge 과정 결과",
    steps: [
      { label: '형광펜', text: "두 포인터 i,j로 <code>left[i] <= right[j]</code> 작은 값을 result에" },
      { label: '떠올릴 것', text: "merge = 이미 정렬된 두 리스트를 작은 값부터 합침 → 완전 정렬" },
      { label: '적용', text: "1,2,3,4,6 차례로 넣고 left 남은 7 붙임 → [1,2,3,4,6,7]" },
    ],
    answer: "두 정렬 리스트 병합 → [1,2,3,4,6,7]",
    mnemonic: "merge는 '지퍼' 잠그듯 작은 값부터 끼움. 단순 연결 아님",
  },
  36: {
    focus: "병합 정렬의 안정성 (동률 비교 시 left 우선)",
    steps: [
      { label: '형광펜', text: "<code>left[i][0] <= right[j][0]</code> — 등호 포함이라 동률 시 left 먼저" },
      { label: '떠올릴 것', text: "안정성 = 같은 key의 원래 순서 보존. <= 면 left(원래 앞)가 우선" },
      { label: '적용', text: "key 2 동률: (2,'A')(left) 먼저 → (2,'A'),(2,'C'),(3,'B'),(4,'D')" },
    ],
    answer: "<= 라서 left의 A가 C보다 앞 유지 → 안정 정렬",
    mnemonic: "등호가 left쪽(<=)이면 안정. <로 바꾸면 불안정",
  },
  37: {
    focus: "down-heap 1회 (두 자식 중 큰 쪽과 교환)",
    steps: [
      { label: '형광펜', text: "<code>if arr[child] < arr[child+1]: child += 1</code> (큰 자식 선택)" },
      { label: '떠올릴 것', text: "최대 힙 down-heap = 두 자식 중 큰 쪽 고르고, 부모가 작으면 교환" },
      { label: '적용', text: "자식 8,7 중 큰 8 선택, 부모 3<8 → 교환 → [8,3,7,1,5]" },
    ],
    answer: "큰 자식 8과 부모 3 교환 → [8,3,7,1,5]",
    mnemonic: "자식 인덱스 2i+1·2i+2 = 왼·오. 큰 자식 먼저 고르고 부모와 비교",
  },
  38: {
    focus: "heapify (마지막 내부 노드부터 역순, sift-down 1단계)",
    steps: [
      { label: '형광펜', text: "<code>range(n//2-1, -1, -1)</code> — 내부 노드만 역순(i=1,0)" },
      { label: '떠올릴 것', text: "각 노드서 큰 자식과 비교 교환. 이 코드는 교환 후 더 안 내려감(1단계만)" },
      { label: '적용', text: "i=1: 10>5 변화없음. i=0: 부모 4<큰자식 10 → 교환 → [10,4,3,5,1]" },
    ],
    answer: "i=0에서 4↔10 한 번 교환 → [10,4,3,5,1]",
    mnemonic: "heapify는 뒤(n//2-1)서 앞으로. 코드 그대로 따라가기(완전 힙 가정 금지)",
  },
  39: {
    focus: "도수 정렬 도수 배열 (값별 등장 횟수)",
    steps: [
      { label: '형광펜', text: "<code>count[x] += 1</code> — 인덱스=값, 원소=개수" },
      { label: '떠올릴 것', text: "도수 배열 count[v] = 값 v가 나온 횟수 (비교 없는 정렬 1단계)" },
      { label: '적용', text: "0이 2개, 1이 2개, 2가 3개 → [2,2,3]" },
    ],
    answer: "각 값 개수 세면 [2,2,3]",
    mnemonic: "count의 인덱스는 값, 칸 안은 개수. 값 자체([0,1,2])랑 헷갈리지 말 것",
  },
  40: {
    focus: "도수 정렬 누적 도수 (prefix sum, in-place)",
    steps: [
      { label: '형광펜', text: "<code>count[i] += count[i-1]</code> — 앞에서부터 누적(이미 갱신된 값 사용)" },
      { label: '떠올릴 것', text: "누적합 = 각 값이 들어갈 위치(경계). 앞→뒤 inclusive 누적" },
      { label: '적용', text: "i=1: 2+2=4 / i=2: 3+4=7 → [2,4,7]" },
    ],
    answer: "앞에서부터 누적 → [2,4,7]",
    mnemonic: "왼→오로 굴러가며 더함. count[i-1]은 갱신된 누적값(원본 아님)",
  },
}
