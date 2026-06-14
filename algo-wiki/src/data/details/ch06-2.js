export const details = {
  21: {
    summary: '바깥 루프가 2회(i=0,1)만 도는 부분 버블 정렬이라 완전 정렬되지 않고, 추적 결과 [3, 1, 2, 4, 5]가 된다.',
    reasoning: [
      '초기 <code>arr=[5,3,4,1,2]</code>. 바깥 루프 <code>range(2)</code>이므로 i=0, i=1 두 회전만 수행한다.',
      'i=0: 안쪽 j는 0..3. j=0: 5>3 교환 → [3,5,4,1,2]. j=1: 5>4 교환 → [3,4,5,1,2]. j=2: 5>1 교환 → [3,4,1,5,2]. j=3: 5>2 교환 → [3,4,1,2,5]. 가장 큰 5가 맨 뒤로 확정됐다.',
      'i=1: 안쪽 j는 0..2 (<code>len-1-i=3</code>). j=0: 3>4? 아니오. j=1: 4>1 교환 → [3,1,4,2,5]. j=2: 4>2 교환 → [3,1,2,4,5]. 두 번째로 큰 4가 제자리에 확정됐다.',
      '바깥 루프가 여기서 끝나므로 최종 <code>arr=[3, 1, 2, 4, 5]</code>. 앞쪽 3,1,2는 아직 정렬되지 않았다. 따라서 정답은 ③.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '[1,2,3,4,5]는 완전 정렬 결과지만, 바깥 루프가 2회뿐이라 앞부분이 정리되지 않아 도달하지 못한다.' },
      { label: '②', verdict: '오답', why: '[3,4,1,2,5]는 i=0 회전만 끝난 중간 상태로, i=1 회전이 더 진행된다.' },
      { label: '③', verdict: '정답', why: 'i=0,1 두 회전 후 큰 값 5,4가 뒤로 확정되고 앞 3,1,2는 그대로라 [3,1,2,4,5]가 된다.' },
      { label: '④', verdict: '오답', why: '[5,4,3,2,1]은 내림차순으로, 오름차순 비교 교환 로직과 정반대다.' }
    ],
    keyConcepts: ['버블 정렬 한 회전마다 최댓값이 뒤로 확정', '<code>range(2)</code>로 회전 수를 제한하면 부분 정렬', '안쪽 범위 <code>len-1-i</code>는 확정된 뒤쪽을 제외'],
    pitfall: '바깥 루프 횟수를 보지 않고 "버블 정렬이니 완전 정렬"이라고 단정하는 실수. range(2)는 2회전만 한다.'
  },
  22: {
    summary: '비교문 <code>cnt += 1</code>은 안쪽 루프가 도는 횟수만큼 실행되며, n=4에서 3+2+1=6회다.',
    reasoning: [
      '<code>arr=[1,2,3,4]</code>로 이미 정렬되어 있지만, 이 코드에는 조기 종료가 없으므로 비교는 모두 수행된다.',
      'i=0: 안쪽 j 범위 <code>range(len-1-0)=range(3)</code> → 3회 비교.',
      'i=1: <code>range(len-1-1)=range(2)</code> → 2회 비교.',
      'i=2: <code>range(len-1-2)=range(1)</code> → 1회 비교.',
      '총 <code>cnt = 3+2+1 = 6</code>. 이는 버블/선택 정렬의 비교 횟수 공식 n(n-1)/2 = 4·3/2 = 6과 일치한다. 따라서 정답은 ③.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '3은 i=0 회전 한 번의 비교 횟수일 뿐, 전체 합이 아니다.' },
      { label: '②', verdict: '오답', why: '4는 바깥 루프 횟수(3)나 원소 수(4)와 헷갈린 값으로 비교 총합이 아니다.' },
      { label: '③', verdict: '정답', why: '3+2+1=6으로 n(n-1)/2 공식과 일치하는 비교 총횟수다.' },
      { label: '④', verdict: '오답', why: '10은 n=5일 때의 비교 횟수(4+3+2+1)로, 여기 n=4와 맞지 않는다.' }
    ],
    keyConcepts: ['조기 종료 없는 버블 정렬 비교 횟수 = n(n-1)/2', '입력이 정렬돼 있어도 비교는 그대로 수행', '교환 횟수는 입력에 따라 달라지지만 비교 횟수는 고정'],
    pitfall: '교환 횟수와 비교 횟수를 혼동하기 쉽다. 여기서 세는 것은 if 도달 횟수(비교)이지 실제 교환이 아니다.'
  },
  23: {
    summary: '입력이 이미 정렬돼 있어 첫 회전에서 교환이 한 번도 없으므로 <code>swapped</code>가 False가 되어 break, 비교는 3회에서 멈춘다.',
    reasoning: [
      '<code>arr=[1,2,3,4]</code>는 이미 오름차순이다. 22번과 달리 <code>swapped</code> 플래그와 <code>break</code>가 추가됐다.',
      'i=0: <code>swapped=False</code>로 시작. j=0..2 세 번 비교(cnt=1,2,3). 1<2, 2<3, 3<4라 어느 것도 교환 조건(<code>arr[j]>arr[j+1]</code>)을 만족하지 못해 swapped는 계속 False.',
      'i=0 안쪽 루프 종료 후 <code>if not swapped</code>가 참 → <code>break</code>. 바깥 루프가 즉시 끝난다.',
      '따라서 <code>cnt=3</code>에서 멈춘다. 정렬된 입력에서 버블 정렬은 단 한 번의 패스(n-1회 비교)로 종료된다. 정답은 ①.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '정답', why: '정렬된 입력은 첫 패스에서 교환이 없어 break하고, 비교는 3회만 일어난다.' },
      { label: '②', verdict: '오답', why: '4는 의미 없는 값으로, 첫 패스 비교는 n-1=3회다.' },
      { label: '③', verdict: '오답', why: '6은 조기 종료가 없을 때(22번)의 총 비교 횟수이며, 여기서는 break로 줄어든다.' },
      { label: '④', verdict: '오답', why: '10은 n=5 가정의 값으로 맞지 않는다.' }
    ],
    keyConcepts: ['swapped 플래그로 한 패스에 교환이 없으면 정렬 완료로 간주', '조기 종료 버블 정렬의 최선 시간복잡도 O(n)', '정렬된 입력에서 비교는 n-1회뿐'],
    pitfall: 'break가 안쪽 루프가 아니라 바깥 루프를 끝낸다는 점. swapped 검사는 안쪽 루프 밖(바깥 루프 본문)에 있다.'
  },
  24: {
    summary: '바깥 루프가 2회만 도는 부분 선택 정렬로, i=0에서 최솟값 1을 앞으로 보내고 i=1에서는 이미 최솟값 2라 변화 없어 [1, 2, 5, 4, 3]이 된다.',
    reasoning: [
      '<code>arr=[4,2,5,1,3]</code>. 선택 정렬은 매 회차 i 이후 구간의 최솟값을 찾아 arr[i]와 교환한다.',
      'i=0: min_idx=0(값 4)에서 시작. j=1:2<4 → min_idx=1. j=2:5<2? 아니오. j=3:1<2 → min_idx=3. j=4:3<1? 아니오. 최솟값 위치 3과 0을 교환 → [1,2,5,4,3].',
      'i=1: min_idx=1(값 2). j=2:5<2? 아니오. j=3:4<2? 아니오. j=4:3<2? 아니오. min_idx는 그대로 1이라 arr[1]끼리 교환(자기 자신) → 변화 없음.',
      '바깥 루프 <code>range(2)</code> 종료. 최종 <code>arr=[1, 2, 5, 4, 3]</code>. 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '완전 정렬 [1,2,3,4,5]는 2회차만으로 도달 불가하며, 뒤쪽 5,4,3이 남는다.' },
      { label: '②', verdict: '정답', why: 'i=0에 1을 앞으로, i=1은 2가 제자리라 변화 없어 [1,2,5,4,3]이 된다.' },
      { label: '③', verdict: '오답', why: '[1,4,5,2,3]은 교환 과정과 맞지 않는 임의 배열이다.' },
      { label: '④', verdict: '오답', why: '[2,4,1,5,3]은 어떤 회차 상태와도 일치하지 않는다.' }
    ],
    keyConcepts: ['선택 정렬은 회차마다 최솟값 1개를 앞으로 확정', '<code>range(2)</code>로 2개 위치만 확정하는 부분 정렬', '최솟값이 이미 제자리면 자기 자신과 교환'],
    pitfall: '선택 정렬은 멀리 떨어진 원소와 교환하므로 같은 값의 순서가 뒤바뀔 수 있다(불안정). 또한 2회차로 끝나 완전 정렬이 아니다.'
  },
  25: {
    summary: '선택 정렬의 교환은 현재 위치 i와 찾은 최솟값 위치 min_idx 사이에서 일어나므로, 두 빈칸 모두 min_idx여야 한다.',
    reasoning: [
      '선택 정렬의 핵심은 i..끝 구간에서 최솟값의 인덱스 <code>min_idx</code>를 찾은 뒤, <code>arr[i]</code>와 <code>arr[min_idx]</code>를 맞바꾸는 것이다.',
      'Python 동시 대입 <code>arr[i], arr[A] = arr[B], arr[i]</code>가 올바른 swap이 되려면, A와 B가 모두 상대편 인덱스인 min_idx여야 한다.',
      'A=min_idx, B=min_idx를 대입하면 <code>arr[i], arr[min_idx] = arr[min_idx], arr[i]</code> → 표준 교환식이 완성된다.',
      '따라서 두 빈칸 모두 <code>min_idx</code>. 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: 'i, j는 안쪽 루프가 끝난 뒤 j값이 최솟값 위치라는 보장이 없어 올바른 교환이 아니다.' },
      { label: '②', verdict: '정답', why: '<code>arr[i], arr[min_idx] = arr[min_idx], arr[i]</code>로 현재 위치와 최솟값 위치를 맞바꾸는 표준 swap이다.' },
      { label: '③', verdict: '오답', why: 'j, i는 <code>arr[i], arr[j] = arr[i], arr[i]</code>처럼 양쪽이 어긋나 교환이 깨진다.' },
      { label: '④', verdict: '오답', why: 'i+1, min_idx는 첫 인덱스가 i+1이라 정작 arr[i]가 갱신되지 않아 정렬이 망가진다.' }
    ],
    keyConcepts: ['선택 정렬의 교환 대상: 현재 위치 i ↔ 최솟값 위치 min_idx', 'Python 동시 대입을 이용한 swap 관용구', 'min_idx==i면 자기 자신과 교환(무해)'],
    pitfall: 'Python의 동시 대입은 우변을 먼저 모두 평가하므로 임시 변수가 필요 없다. 인덱스를 한쪽만 바꾸면 swap이 깨진다.'
  },
  26: {
    summary: '비교 카운트는 안쪽 루프 회전 수의 합으로, 입력 내용과 무관하게 n=5에서 4+3+2+1=10이다.',
    reasoning: [
      '이 코드는 비교 횟수만 세고 실제 교환은 하지 않는다. <code>cnt += 1</code>이 안쪽 루프마다 실행된다.',
      'i=0: <code>range(1,5)</code> → 4회. i=1: <code>range(2,5)</code> → 3회. i=2: <code>range(3,5)</code> → 2회. i=3: <code>range(4,5)</code> → 1회.',
      '합 <code>cnt = 4+3+2+1 = 10</code>. 선택 정렬의 비교 횟수는 항상 n(n-1)/2 = 5·4/2 = 10으로 입력 상태와 무관하게 일정하다.',
      '입력이 역순 [5,4,3,2,1]이든 정렬돼 있든 비교 횟수는 10으로 동일하다. 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '5는 원소 개수일 뿐 비교 총합이 아니다.' },
      { label: '②', verdict: '정답', why: '4+3+2+1=10 = n(n-1)/2로 선택 정렬의 고정 비교 횟수다.' },
      { label: '③', verdict: '오답', why: '15는 n=6일 때(5+4+3+2+1)의 값으로 맞지 않는다.' },
      { label: '④', verdict: '오답', why: '20은 n·(n-1)=5·4로 1/2를 빠뜨린 값이다.' }
    ],
    keyConcepts: ['선택 정렬 비교 횟수는 항상 n(n-1)/2', '입력 분포와 무관하게 비교 수 고정', '교환 횟수는 회차당 최대 1번이라 비교 수보다 훨씬 적음'],
    pitfall: '선택 정렬의 "고정 비교 횟수"와 "적은 교환 횟수"를 헷갈리면 안 된다. 비교는 많고 교환은 적은 것이 특징이다.'
  },
  27: {
    summary: '바깥 루프가 i=1,2 두 번만 도는 부분 삽입 정렬이라, 앞 세 원소만 정리되어 [2, 3, 4, 1]이 된다.',
    reasoning: [
      '<code>arr=[4,2,3,1]</code>. 삽입 정렬은 key를 앞쪽 정렬 구간의 알맞은 자리에 끼워 넣는다. 바깥 루프는 <code>range(1,3)</code>이라 i=1,2만 수행한다.',
      'i=1: key=2, j=0. <code>arr[0]=4 > 2</code> → arr[1]=4로 밀고 j=-1. 루프 종료 후 arr[0]=2 → [2,4,3,1].',
      'i=2: key=3, j=1. <code>arr[1]=4 > 3</code> → arr[2]=4로 밀고 j=0. <code>arr[0]=2 > 3</code>? 아니오 → 종료. arr[1]=3 → [2,3,4,1].',
      '바깥 루프 종료(i=3은 제외). 마지막 원소 1은 건드리지 않아 그대로다. 최종 <code>arr=[2, 3, 4, 1]</code>. 정답은 ①.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '정답', why: 'i=1,2 두 회전으로 앞 세 원소만 정렬되고 1은 손대지 않아 [2,3,4,1]이 된다.' },
      { label: '②', verdict: '오답', why: '[1,2,3,4]는 i=3까지 돌아야 하는 완전 정렬로, range(1,3)에서는 1이 처리되지 않는다.' },
      { label: '③', verdict: '오답', why: '[2,4,3,1]은 i=1만 끝난 중간 상태로, i=2가 더 진행된다.' },
      { label: '④', verdict: '오답', why: '[4,3,2,1]은 내림차순으로 삽입 정렬 동작과 무관하다.' }
    ],
    keyConcepts: ['삽입 정렬은 i번째 원소를 앞 정렬 구간에 삽입', '<code>range(1,3)</code>이라 마지막 원소(1)는 미처리', 'key보다 큰 값들을 한 칸씩 밀고 빈자리에 key 삽입'],
    pitfall: '바깥 루프 상한이 len(arr)가 아니라 3이라 마지막 원소가 정렬되지 않는다. 범위를 끝까지로 착각하지 말 것.'
  },
  28: {
    summary: '이동(=앞 원소를 한 칸 미는 횟수)은 3 삽입 시 1회, 4 삽입 시 1회, 1 삽입 시 3회로 총 5회다.',
    reasoning: [
      '<code>arr=[5,3,4,1]</code>. <code>move</code>는 while 안 <code>arr[j+1]=arr[j]</code> 실행 횟수(앞 원소 밀기)를 센다.',
      'i=1: key=3, j=0. arr[0]=5>3 → 밀기(move=1), j=-1. 종료. arr[0]=3 → [3,5,4,1].',
      'i=2: key=4, j=1. arr[1]=5>4 → 밀기(move=2), j=0. arr[0]=3>4? 아니오 → 종료. arr[1]=4 → [3,4,5,1].',
      'i=3: key=1, j=2. arr[2]=5>1 → 밀기(move=3), j=1. arr[1]=4>1 → 밀기(move=4), j=0. arr[0]=3>1 → 밀기(move=5), j=-1. 종료. arr[0]=1 → [1,3,4,5].',
      '총 <code>move=5</code>. 가장 작은 1을 맨 앞까지 옮기느라 3회 이동이 발생했다. 정답은 ③.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '3은 마지막 key=1 삽입 한 번의 이동 횟수일 뿐 전체 합이 아니다.' },
      { label: '②', verdict: '오답', why: '4는 중간 카운트 값으로, key=1을 다 넣기 전 상태다.' },
      { label: '③', verdict: '정답', why: '1+1+3=5로, 각 key 삽입 시 밀기 횟수의 합이다.' },
      { label: '④', verdict: '오답', why: '6은 비교 횟수 등과 혼동한 값으로, 실제 이동은 5회다.' }
    ],
    keyConcepts: ['삽입 정렬 이동 횟수 = while 본문 실행 합', '작은 값이 뒤에 있으면 멀리 이동해 비용 증가', '이동 횟수는 입력의 역전(inversion) 수와 일치'],
    pitfall: '마지막 <code>arr[j+1]=key</code>(제자리 배치)는 move에 세지 않는다. 밀기(arr[j+1]=arr[j])만 카운트 대상이다.'
  },
  29: {
    summary: 'while이 끝났을 때 j는 key보다 작거나 같은 값의 위치(또는 -1)이므로, key는 그 다음 칸 <code>arr[j+1]</code>에 들어간다.',
    reasoning: [
      '삽입 정렬에서 while은 <code>arr[j] > key</code>인 동안 arr[j]를 한 칸 뒤(arr[j+1])로 밀며 j를 감소시킨다.',
      'while이 멈추는 순간은 <code>arr[j] <= key</code>이거나 <code>j < 0</code>일 때다. 즉 j 위치의 값은 key 이하이고, j+1 칸은 비어 있다(직전에 밀렸거나 원래 key 자리).',
      '따라서 key가 들어갈 정확한 위치는 <code>arr[j+1]</code>이다. 예: <code>arr=[3,1,2]</code>, i=1 key=1이면 j=0에서 3>1 밀고 j=-1, key는 arr[0]=arr[j+1]에 들어가 [1,3,2].',
      '정답은 ② <code>j+1</code>.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: 'arr[j]에 넣으면 방금 밀어낸 값을 덮어써 데이터가 손실된다.' },
      { label: '②', verdict: '정답', why: 'while 종료 시 j는 key 이하 값의 위치라 빈 칸 arr[j+1]에 key를 넣는다.' },
      { label: '③', verdict: '오답', why: 'arr[i]는 key의 원래 자리이며, 값들이 밀린 뒤라 일반적으로 올바른 삽입 위치가 아니다.' },
      { label: '④', verdict: '오답', why: 'arr[i+1]은 정렬 구간 밖(미처리 영역)이라 범위와 위치 모두 잘못됐다.' }
    ],
    keyConcepts: ['while 종료 조건: arr[j] <= key 또는 j < 0', '밀기 후 빈 칸은 항상 j+1', 'j=-1까지 내려가면 arr[0]에 key 삽입'],
    pitfall: 'j가 한 번 더 감소한 뒤 루프를 빠져나오므로, 삽입 위치는 j가 아니라 j+1이다. off-by-one에 주의.'
  },
  30: {
    summary: 'gap=3 한 단계만 수행하는 쉘 정렬로, (0,3)·(1,4)·(2,5) 간격 쌍을 정렬해 [2, 1, 3, 8, 5, 6]이 된다.',
    reasoning: [
      '<code>arr=[8,1,6,2,5,3]</code>, gap=3. gap 간격 떨어진 원소끼리 삽입 정렬한다. 인덱스 그룹은 {0,3}, {1,4}, {2,5}.',
      'i=3: temp=arr[3]=2, j=3. <code>arr[0]=8 > 2</code> → arr[3]=8, j=0. j<gap이라 종료. arr[0]=2 → [2,1,6,8,5,3]. (그룹 {0,3}: 8,2 → 2,8)',
      'i=4: temp=arr[4]=5, j=4. <code>arr[1]=1 > 5</code>? 아니오 → 종료. arr[4]=5 그대로 → [2,1,6,8,5,3]. (그룹 {1,4}: 1,5 이미 정렬)',
      'i=5: temp=arr[5]=3, j=5. <code>arr[2]=6 > 3</code> → arr[5]=6, j=2. j<gap이라 종료. arr[2]=3 → [2,1,3,8,5,6]. (그룹 {2,5}: 6,3 → 3,6)',
      '최종 <code>arr=[2, 1, 3, 8, 5, 6]</code>. gap=1 단계는 코드에 없으므로 완전 정렬이 아니다. 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '[1,2,3,5,6,8]은 완전 정렬 결과로, gap=1 패스가 없는 이 코드에서는 도달 불가하다.' },
      { label: '②', verdict: '정답', why: 'gap=3 패스로 {0,3}·{2,5}만 교환되고 {1,4}는 그대로라 [2,1,3,8,5,6]이 된다.' },
      { label: '③', verdict: '오답', why: '[5,1,3,2,8,6]은 간격 그룹 정렬 결과와 일치하지 않는다.' },
      { label: '④', verdict: '오답', why: '[1,8,2,6,3,5]은 임의 배열로 추적 결과와 다르다.' }
    ],
    keyConcepts: ['쉘 정렬은 gap 간격 부분 리스트를 삽입 정렬', 'gap=3 한 단계만 돌면 부분 정렬 상태', '보통 gap을 줄여(3→1) 마지막에 일반 삽입 정렬로 마무리'],
    pitfall: 'gap이 1로 줄어드는 외부 루프가 없으므로 완전 정렬되지 않는다. 그룹별로 따로 정렬됨을 기억할 것.'
  },
  31: {
    summary: 'pivot=arr[0]=6 기준으로 나머지를 분할하면 6보다 작은 3,2,5는 left, 큰 8은 right에 모여 [3, 2, 5] 6 [8]이 된다.',
    reasoning: [
      '<code>arr=[6,3,8,2,5]</code>, pivot=arr[0]=6. <code>arr[1:]=[3,8,2,5]</code>를 차례로 검사한다.',
      'x=3: 3<6 → left=[3]. x=8: 8<6? 아니오 → right=[8]. x=2: 2<6 → left=[3,2]. x=5: 5<6 → left=[3,2,5].',
      '순서대로 추가하므로 left는 원래 등장 순서를 유지해 <code>[3,2,5]</code>(정렬 안 됨), right=<code>[8]</code>.',
      '출력 <code>print(left, pivot, right)</code> → <code>[3, 2, 5] 6 [8]</code>. 정답은 ①.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '정답', why: 'pivot 6보다 작은 3,2,5가 등장 순서대로 left, 큰 8이 right에 들어간다.' },
      { label: '②', verdict: '오답', why: '[2,3,5]는 left를 정렬한 형태지만, 이 분할 코드는 정렬하지 않고 append 순서를 유지한다.' },
      { label: '③', verdict: '오답', why: '[3,8,2,5] 6 []는 8을 left로 잘못 보낸 경우로, 8>6이라 right에 가야 한다.' },
      { label: '④', verdict: '오답', why: 'left와 right가 뒤바뀐 형태로, 작은 값이 left에 가야 한다.' }
    ],
    keyConcepts: ['partition은 pivot 기준 작은/큰 그룹으로만 분리(정렬 아님)', 'append는 등장 순서를 보존', '<code>else</code> 분기라 pivot과 같은 값은 right로'],
    pitfall: 'partition 결과의 left는 "정렬된" 것이 아니라 "pivot보다 작은" 값들의 모음일 뿐이다. 재귀 정렬 전 단계임에 주의.'
  },
  32: {
    summary: 'pivot=4 기준 left=[2,1], right=[4](중복 4는 >= 조건으로 right)로 나뉘고 재귀 결과를 합쳐 [1, 2, 4, 4]가 된다.',
    reasoning: [
      '<code>quick_sort([4,2,4,1])</code>: pivot=4. <code>left=[x for x in [2,4,1] if x<4]=[2,1]</code>, <code>right=[x ... if x>=4]=[4]</code>.',
      '<code>quick_sort([2,1])</code>: pivot=2, left=[1], right=[]. → quick_sort([1]) + [2] + quick_sort([]) = [1]+[2]+[] = [1,2].',
      '<code>quick_sort([4])</code>: 길이 1이라 [4] 반환.',
      '합치면 <code>[1,2] + [4] + [4] = [1, 2, 4, 4]</code>. 두 개의 4가 모두 보존된다(중복 손실 없음). 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '[1,2,4]는 중복 4 하나를 잃은 결과로, >= 조건 덕에 두 4가 모두 남는다.' },
      { label: '②', verdict: '정답', why: 'pivot 4와 right의 4가 모두 보존되어 [1,2,4,4]가 된다.' },
      { label: '③', verdict: '오답', why: '[4,4,2,1]은 내림차순으로 오름차순 퀵 정렬 결과와 반대다.' },
      { label: '④', verdict: '오답', why: '재귀 종료 조건(len<=1)이 있어 무한 재귀나 오류가 나지 않는다.' }
    ],
    keyConcepts: ['중복 값은 <code>x >= pivot</code> 조건으로 right에 포함되어 보존', 'len<=1 기저 조건이 재귀 종료 보장', '리스트 연결 left + [pivot] + right로 결합'],
    pitfall: 'right 조건을 <code>x > pivot</code>(등호 없이)으로 쓰면 pivot과 같은 값이 누락되어 원소가 사라진다. 등호 위치가 핵심.'
  },
  33: {
    summary: '퀵 정렬은 작은 값(left)과 큰 값(right) 사이에 pivot을 끼워 결합하므로, 빈칸은 <code>pivot</code>이다.',
    reasoning: [
      '퀵 정렬의 분할 정복 결합식은 <code>quick_sort(left) + [기준값] + quick_sort(right)</code> 형태다.',
      'left는 pivot보다 작은 값들, right는 pivot 이상 값들이므로, 정렬된 결과에서 이 둘 사이에 와야 하는 것은 분할 기준인 <code>pivot</code>이다.',
      '검증: <code>quick_sort([3,1,2])</code>에서 pivot=3, left=[1,2], right=[]. <code>quick_sort([1,2]) + [3] + [] = [1,2,3]</code>으로 올바르게 정렬된다.',
      '만약 left나 right 등을 넣으면 리스트가 중첩되거나 pivot이 누락되어 결과가 깨진다. 정답은 ③.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: 'arr 전체를 끼우면 이미 분할한 원소를 통째로 다시 넣어 중복·무한 재귀가 된다.' },
      { label: '②', verdict: '오답', why: 'left를 끼우면 정렬 안 된 부분 리스트가 통째로 들어가고 pivot이 빠진다.' },
      { label: '③', verdict: '정답', why: '분할 기준 pivot을 left와 right 사이에 두는 것이 퀵 정렬의 결합 규칙이다.' },
      { label: '④', verdict: '오답', why: 'right를 넣으면 pivot이 사라지고 right가 두 번 들어가 결과가 망가진다.' }
    ],
    keyConcepts: ['결합식: quick_sort(left) + [pivot] + quick_sort(right)', 'pivot은 분할 기준이자 정렬 후 left·right 사이의 확정 위치', '재귀 호출은 left, right에만 적용'],
    pitfall: '빈칸은 <code>[____]</code> 형태로 리스트 안에 들어가므로, pivot 단일 값을 넣어 <code>[pivot]</code>이 되어야 연결(+)이 성립한다.'
  },
  34: {
    summary: '제자리 분할로 6보다 작은 값들을 왼쪽에 모은 뒤 pivot(arr[0])과 경계(right)를 교환해 [3, 4, 5, 6, 8]이 된다.',
    reasoning: [
      '<code>arr=[6,4,8,3,5]</code>, pivot=arr[0]=6, left=1, right=4. 두 포인터로 안쪽에서 바깥으로 좁혀간다.',
      '1라운드: left는 <code>arr[left]<=6</code>인 동안 전진 → arr[1]=4(<=6,전진), arr[2]=8(>6,멈춤) left=2. right는 <code>arr[right]>=6</code>인 동안 후진 → arr[4]=5(<6,멈춤) right=4. left(2)<right(4) → arr[2]↔arr[4] 교환(8↔5) → [6,4,5,3,8].',
      '2라운드: left=2에서 arr[2]=5(<=6,전진), arr[3]=3(<=6,전진), arr[4]=8(>6,멈춤) left=4. right=4에서 arr[4]=8(>=6,후진) right=3. left(4)<=right(3)? 거짓 → 바깥 while 종료. left<right도 거짓이라 교환 없음.',
      '루프 종료 후 <code>arr[0] ↔ arr[right=3]</code> 교환(6↔3) → [3,4,5,6,8]. pivot 6이 정확히 경계 위치로 확정됐다.',
      '최종 <code>arr=[3, 4, 5, 6, 8]</code>. 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '[5,4,3,6,8]은 마지막 pivot 교환 위치(right)를 잘못 잡은 경우로, right=3이라 arr[3]과 교환한다.' },
      { label: '②', verdict: '정답', why: '작은 값을 왼쪽에 모은 뒤 pivot을 right=3 위치와 교환해 [3,4,5,6,8]이 된다.' },
      { label: '③', verdict: '오답', why: '[4,3,5,6,8]은 앞 두 값 순서가 추적과 다르다.' },
      { label: '④', verdict: '오답', why: '입력 그대로 [6,4,8,3,5]는 분할이 전혀 일어나지 않은 경우로 틀리다.' }
    ],
    keyConcepts: ['제자리 분할은 left·right 두 포인터로 pivot 경계 탐색', '교환 조건 <code>left < right</code>로 포인터 교차 방지', '마지막에 pivot을 경계(right) 위치와 교환해 확정'],
    pitfall: 'pivot을 left가 아닌 right와 교환해야 작은 값들 바로 뒤에 놓인다. 포인터 멈춤 조건의 등호(<=, >=) 위치도 동작에 직결된다.'
  },
  35: {
    summary: '두 정렬된 리스트를 작은 값부터 비교해 합치는 표준 merge로, 결과는 완전히 정렬된 [1, 2, 3, 4, 6, 7]이다.',
    reasoning: [
      '<code>left=[1,4,7]</code>, <code>right=[2,3,6]</code>. 두 포인터 i,j로 앞에서부터 비교해 작은 값을 result에 넣는다.',
      'left[0]=1 <= right[0]=2 → result=[1], i=1. left[1]=4 <= 2? 아니오 → result=[1,2], j=1. 4<=3? 아니오 → [1,2,3], j=2. 4<=6? 예 → [1,2,3,4], i=2. left[2]=7<=6? 아니오 → [1,2,3,4,6], j=3.',
      'j=3이라 right 소진 → while 종료. <code>result += left[2:]=[7]</code> → [1,2,3,4,6,7]. <code>result += right[3:]=[]</code> 변화 없음.',
      '최종 <code>[1, 2, 3, 4, 6, 7]</code>. 정답은 ①.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '정답', why: '두 정렬 리스트를 작은 값부터 병합하면 완전 정렬된 [1,2,3,4,6,7]이 된다.' },
      { label: '②', verdict: '오답', why: '[1,4,7,2,3,6]은 left·right를 단순 연결만 한 것으로, 병합 비교가 빠졌다.' },
      { label: '③', verdict: '오답', why: '[2,3,6,1,4,7]은 right를 먼저 붙인 형태로 비교 로직과 무관하다.' },
      { label: '④', verdict: '오답', why: '[1,2,4,3,6,7]은 중간 비교가 한 번 어긋난 잘못된 순서다.' }
    ],
    keyConcepts: ['merge는 두 정렬 리스트를 O(n+m)에 합침', '<code>left[i] <= right[j]</code> 비교로 작은 값 선택', '한쪽 소진 후 남은 꼬리를 그대로 이어 붙임'],
    pitfall: 'merge는 입력 두 리스트가 "이미 정렬돼 있다"는 전제 위에서만 정렬 결과를 보장한다. 무작위 리스트엔 적용 불가.'
  },
  36: {
    summary: '비교 조건이 <code><=</code>(등호 포함)이라 같은 key 2에서 left의 (2,"A")가 먼저 들어가, 안정성이 유지된 [(2,"A"),(2,"C"),(3,"B"),(4,"D")]가 된다.',
    reasoning: [
      'left=[(2,"A"),(3,"B")], right=[(2,"C"),(4,"D")]. key는 튜플의 [0]번 정수다.',
      'left[0][0]=2 <= right[0][0]=2 → 등호 포함이라 left를 먼저 선택 → result=[(2,"A")], i=1.',
      'left[1][0]=3 <= 2? 아니오 → result=[(2,"A"),(2,"C")], j=1. 3<=4? 예 → [(2,"A"),(2,"C"),(3,"B")], i=2.',
      'i=2라 left 소진 → 종료. result += left[2:]=[], result += right[1:]=[(4,"D")] → [(2,"A"),(2,"C"),(3,"B"),(4,"D")].',
      '같은 key 2에서 원래 left에 있던 A가 right의 C보다 앞에 유지됐다. 안정 정렬이다. 정답은 ①.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '정답', why: '<= 조건이라 동률 시 left의 (2,"A")를 먼저 넣어 원래 순서(A→C)가 보존된다.' },
      { label: '②', verdict: '오답', why: '(2,"C")가 (2,"A")보다 앞서려면 비교가 <(등호 없음)여야 하며, 그러면 불안정해진다.' },
      { label: '③', verdict: '오답', why: '(2,"C")가 (3,"B") 뒤로 가는 일은 없다. key 2는 항상 3보다 먼저 병합된다.' },
      { label: '④', verdict: '오답', why: '튜플 비교·인덱싱 모두 정상 동작하므로 오류가 아니다.' }
    ],
    keyConcepts: ['병합 정렬의 안정성은 동률 비교에서 left 우선(<=)으로 보장', '튜플 첫 원소를 key로 비교', '등호를 right쪽(<)에 두면 불안정해짐'],
    pitfall: '안정성은 비교 연산자의 등호 위치로 결정된다. <code>left[i][0] < right[j][0]</code>로 바꾸면 동률에서 right가 먼저 들어가 안정성이 깨진다.'
  },
  37: {
    summary: 'down-heap 1회로 부모(arr[0]=3)와 더 큰 자식을 비교한다. 두 자식 8,7 중 큰 8과 교환해 [8, 3, 7, 1, 5]가 된다.',
    reasoning: [
      '<code>arr=[3,8,7,1,5]</code>. parent=0의 자식은 index 1(=8)과 index 2(=7).',
      '<code>child=1</code>로 시작. <code>child+1=2 < 5</code>이고 <code>arr[1]=8 < arr[2]=7</code>? 8<7 거짓 → child는 1 그대로(더 큰 자식은 왼쪽 8).',
      '<code>arr[parent]=3 < arr[child]=8</code>? 참 → arr[0]↔arr[1] 교환 → [8,3,7,1,5].',
      '최종 <code>arr=[8, 3, 7, 1, 5]</code>. 최댓값 8이 루트로 올라왔다. 정답은 ①.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '정답', why: '두 자식 중 큰 8을 골라 부모 3과 교환해 [8,3,7,1,5]가 된다.' },
      { label: '②', verdict: '오답', why: '[7,8,3,1,5]는 자식 선택을 7로 잘못한 경우로, 8>7이라 8을 골라야 한다.' },
      { label: '③', verdict: '오답', why: '입력 그대로 [3,8,7,1,5]는 교환이 일어나지 않은 경우인데, 3<8이라 반드시 교환된다.' },
      { label: '④', verdict: '오답', why: '[8,7,3,1,5]는 두 자식까지 모두 바꾼 형태로, 한 번의 down-heap은 한 번만 교환한다.' }
    ],
    keyConcepts: ['최대 힙 down-heap은 두 자식 중 큰 쪽과 비교', '<code>arr[child] < arr[child+1]</code>로 더 큰 자식 선택', '부모가 더 작을 때만 교환'],
    pitfall: '두 자식 중 큰 쪽을 먼저 고른 뒤 부모와 비교해야 한다. 무조건 왼쪽 자식과만 비교하면 힙 성질이 깨진다.'
  },
  38: {
    summary: 'heapify를 i=1,0 순으로 한 단계씩만 수행한다. i=1은 10>5라 변화 없고, i=0에서 4와 큰 자식 10이 교환되어 [10, 4, 3, 5, 1]이 된다.',
    reasoning: [
      '<code>arr=[4,10,3,5,1]</code>, n=5. <code>range(n//2-1,-1,-1)=range(1,-1,-1)</code> → i=1, i=0 순으로 처리(내부 노드만).',
      'i=1: parent=1, child=2·1+1=3. <code>child+1=4 < 5</code>이고 <code>arr[3]=5 < arr[4]=1</code>? 거짓 → child=3. <code>arr[1]=10 < arr[3]=5</code>? 거짓 → 교환 없음. arr 그대로.',
      'i=0: parent=0, child=1. <code>child+1=2 < 5</code>이고 <code>arr[1]=10 < arr[2]=3</code>? 거짓 → child=1. <code>arr[0]=4 < arr[1]=10</code>? 참 → arr[0]↔arr[1] 교환 → [10,4,3,5,1].',
      '최종 <code>arr=[10, 4, 3, 5, 1]</code>. 이 코드는 교환 후 더 내려가는 재귀 down-heap이 없어 sift-down이 1단계만 일어난다(정식 heapify와 다름). 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '[10,5,3,4,1]은 완전 heapify(교환 후 하위까지 재정렬) 결과로, 이 코드엔 추가 sift-down이 없어 도달하지 않는다.' },
      { label: '②', verdict: '정답', why: 'i=1 무변화, i=0에서 4↔10 한 번 교환으로 [10,4,3,5,1]이 된다.' },
      { label: '③', verdict: '오답', why: '입력 그대로 [4,10,3,5,1]는 i=0 교환을 빠뜨린 경우로, 4<10이라 교환된다.' },
      { label: '④', verdict: '오답', why: '[5,10,3,4,1]는 교환 대상을 잘못 잡은 경우로, 큰 자식은 10(index1)이다.' }
    ],
    keyConcepts: ['heapify는 마지막 내부 노드부터 역순(n//2-1 → 0)으로 진행', '각 노드에서 두 자식 중 큰 쪽과 비교 교환', '이 코드는 sift-down을 1단계만 해 정식 heapify와 결과가 다를 수 있음'],
    pitfall: '정식 heapify는 교환 후 자식 쪽으로 계속 내려가야 하지만, 이 코드엔 그 반복이 없다. 추적은 코드 그대로 따라야지 "완전한 최대 힙"을 가정하면 틀린다.'
  },
  39: {
    summary: '각 값의 등장 횟수를 세는 도수 배열로, 0이 2개·1이 2개·2가 3개이므로 count=[2, 2, 3]이다.',
    reasoning: [
      '<code>arr=[2,0,1,2,1,0,2]</code>, <code>count=[0,0,0]</code>. 각 x마다 <code>count[x]+=1</code>로 도수를 센다.',
      '값별 개수: 0 → index 1,5 두 번(2개). 1 → index 2,4 두 번(2개). 2 → index 0,3,6 세 번(3개).',
      '따라서 <code>count=[2, 2, 3]</code> (각각 0,1,2의 개수). 정답은 ①.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '정답', why: '0이 2개, 1이 2개, 2가 3개로 count=[2,2,3]이다.' },
      { label: '②', verdict: '오답', why: '[3,2,2]는 0과 2의 개수를 뒤바꾼 형태다(0은 2개, 2는 3개).' },
      { label: '③', verdict: '오답', why: '[0,1,2]는 인덱스 값 자체일 뿐 도수가 아니다.' },
      { label: '④', verdict: '오답', why: '[2,3,2]는 1의 개수(2)와 2의 개수(3)를 잘못 맞바꾼 형태다.' }
    ],
    keyConcepts: ['도수 배열 count[v] = 값 v의 등장 횟수', '인덱스가 곧 값이므로 정수·소범위에 적합', '비교 없이 분포만으로 정렬하는 비비교 정렬의 첫 단계'],
    pitfall: 'count 배열의 인덱스는 "값"이고 원소는 "개수"다. 둘을 혼동해 값 자체([0,1,2])를 답으로 고르면 안 된다.'
  },
  40: {
    summary: '도수 배열을 앞에서부터 누적합으로 변환하면 count[1]=2+2=4, count[2]=3+4=7이 되어 [2, 4, 7]이다.',
    reasoning: [
      '<code>count=[2,2,3]</code>. <code>for i in range(1,3)</code>로 <code>count[i] += count[i-1]</code>을 차례로 적용한다.',
      'i=1: <code>count[1] += count[0]</code> → 2+2=4 → count=[2,4,3].',
      'i=2: <code>count[2] += count[1]</code> → 3+4=7 → count=[2,4,7]. (이때 count[1]은 이미 갱신된 4를 사용)',
      '최종 <code>count=[2, 4, 7]</code>. 누적 도수는 도수 정렬에서 각 값이 들어갈 마지막 위치(경계)를 알려준다. 정답은 ②.'
    ],
    optionAnalysis: [
      { label: '①', verdict: '오답', why: '[2,2,3]은 누적 전 원본 도수 배열로, 이 코드는 누적합으로 바꾼다.' },
      { label: '②', verdict: '정답', why: '앞에서부터 누적하면 2, 2+2=4, 3+4=7로 [2,4,7]이 된다.' },
      { label: '③', verdict: '오답', why: '[7,5,3]은 뒤에서부터 누적(suffix sum)한 형태로, 코드는 앞에서부터 진행한다.' },
      { label: '④', verdict: '오답', why: '[0,2,4]는 한 칸 밀린 누적(exclusive prefix)으로, 이 코드는 inclusive 누적이다.' }
    ],
    keyConcepts: ['누적 도수 prefix sum으로 각 값의 출력 위치(경계) 결정', '<code>count[i] += count[i-1]</code>는 직전까지의 누적을 더함', '도수 정렬의 안정성은 누적합을 활용한 역순 배치에서 나옴'],
    pitfall: 'in-place 누적이라 count[i-1]은 "이미 갱신된" 누적값을 쓴다. 원본 값을 더한다고 착각하면 결과가 달라진다.'
  },
}
