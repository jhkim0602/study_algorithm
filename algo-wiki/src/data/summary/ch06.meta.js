// Ch06 정렬 알고리즘 — 시험대비 요약노트(핵심 요약 + 개념별 정리). WF가 채움.
export const meta = {
  cheatsheet: [
    { type: 'h3', text: '정렬 3대 평가 축' },
    {
      type: 'list',
      items: [
        '<b>시간복잡도</b> — 입력 n에 대한 비교·이동 횟수. <b>최선/평균/최악</b>을 구분해서 외운다.',
        '<b>안정성(stable)</b> — 같은 키 원소의 <b>원래 순서</b>가 정렬 뒤에도 유지되면 안정.',
        '<b>제자리(in-place)</b> — 추가 메모리 거의 없이(<code>O(1)~O(log n)</code>) 정렬하면 제자리.',
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html: '비교 정렬의 이론 하한은 <code>Ω(n log n)</code>. 이보다 빠르려면 비교를 버려야 한다 → <b>도수 정렬(비비교)</b>만 <code>O(n+k)</code>.',
    },
    { type: 'h3', text: '8대 정렬 한 표 암기' },
    {
      type: 'table',
      headers: ['정렬', '평균', '최악', '안정', '제자리', '한 줄 핵심'],
      rows: [
        ['버블', 'O(n²)', 'O(n²)', '안정', 'O', '<b>인접</b> 두 칸 비교·교환'],
        ['선택', 'O(n²)', 'O(n²)', '<b>불안정</b>', 'O', '남은 곳 <b>최솟값</b> 골라 앞에'],
        ['삽입', 'O(n²)', 'O(n²)', '안정', 'O', '앞 정렬구간에 <b>끼워넣기</b>(거의정렬↦O(n))'],
        ['쉘', 'O(n^1.3)', 'O(n²)', '<b>불안정</b>', 'O', '<b>gap</b> 삽입정렬, gap 줄여가며'],
        ['퀵', '<b>O(n log n)</b>', 'O(n²)', '<b>불안정</b>', 'O', 'pivot <b>분할정복</b>(나쁜 pivot↦최악)'],
        ['병합', 'O(n log n)', '<b>O(n log n)</b>', '안정', '<b>X</b>', '반 나눠 정렬 후 <b>merge</b>(보조배열)'],
        ['힙', 'O(n log n)', '<b>O(n log n)</b>', '<b>불안정</b>', 'O', '최대힙 루트를 <b>뒤로</b> 빼냄'],
        ['도수', 'O(n+k)', 'O(n+k)', '안정', '<b>X</b>', '<b>비비교</b>, 개수 세고 누적합'],
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html: '<b>형광펜 암기법</b> · 안정정렬 = <b>삽버병도</b>(삽입·버블·병합·도수) · 불안정 = <b>선퀵힙쉘</b> · 항상 nlogn 보장 = <b>병합·힙</b> · 제자리 아님(보조메모리) = <b>병합·도수</b>.',
    },
    { type: 'h4', text: '복잡도 공식 빠른 계산' },
    {
      type: 'table',
      headers: ['항목', '공식', 'n=5 예시'],
      rows: [
        ['버블·선택 비교 횟수', '<code>n(n-1)/2</code> = (n-1)+…+1', '4+3+2+1 = 10'],
        ['1회전 비교(버블 i회전째)', '<code>n-1-i</code>', 'i=0 → 4번'],
        ['이론 하한(비교정렬)', '<code>Ω(n log n)</code>', '—'],
        ['도수 정렬', '<code>O(n+k)</code> (k=값 범위)', '—'],
      ],
    },
    {
      type: 'callout',
      tone: 'warn',
      html: '<b>함정 정리</b> · 선택정렬 비교 횟수는 <b>입력과 무관하게 항상 n(n-1)/2</b>(이미 정렬돼도 동일) · 퀵은 <b>이미 정렬 + 나쁜 pivot</b>에서 최악 O(n²) · 도수정렬은 <b>k가 크면</b> 메모리·시간 낭비 · 안정성은 같은 키에서 <b>비교를 &lt;= 로 하느냐</b>가 좌우.',
    },
    { type: 'h3', text: '상황별 어떤 정렬?' },
    {
      type: 'list',
      items: [
        '<b>거의 정렬된 데이터</b> → 삽입 정렬(이동 거의 없어 O(n)에 근접).',
        '<b>최악에도 안정+보장 nlogn 필요</b> → 병합 정렬(단, 보조 메모리).',
        '<b>제자리 + 보장 nlogn</b> → 힙 정렬(불안정은 감수).',
        '<b>값 범위가 작은 정수</b> → 도수 정렬(O(n+k)로 가장 빠름).',
        '<b>메모리 적고 평균 빠르게</b> → 퀵 정렬(pivot만 잘 고르면 최강).',
      ],
    },
  ],
  groups: [
    {
      title: '버블 정렬',
      tags: ['버블 정렬'],
      gist: '<b>인접한 두 칸</b>을 비교해 크면 교환, 한 회전마다 가장 큰 값이 <b>뒤로 거품처럼</b> 떠오른다. 한 회전에 교환이 0이면 조기 종료 가능.',
      mnemonic: '거품(bubble)이 위로 보글보글 → 큰 값이 맨 뒤로. 회전 i째 비교 횟수 = <code>n-1-i</code>.',
      svg: '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="22" text-anchor="middle" font-size="13" fill="var(--text-soft)">인접 두 칸 비교 후 큰 값을 뒤로 교환</text>'
        + '<g font-size="14" fill="var(--accent-text)" text-anchor="middle">'
        + '<rect x="40" y="90" width="50" height="70" rx="4" fill="var(--viz-compare)"/><text x="65" y="132">5</text>'
        + '<rect x="100" y="60" width="50" height="100" rx="4" fill="var(--viz-compare)"/><text x="125" y="118">8</text>'
        + '<rect x="160" y="110" width="50" height="50" rx="4" fill="var(--viz-bar)"/><text x="185" y="142">3</text>'
        + '<rect x="220" y="100" width="50" height="60" rx="4" fill="var(--viz-bar)"/><text x="245" y="138">4</text>'
        + '<rect x="280" y="75" width="50" height="85" rx="4" fill="var(--viz-sorted)"/><text x="305" y="125">9</text>'
        + '</g>'
        + '<path d="M 65 75 q 30 -30 60 0" fill="none" stroke="var(--viz-swap)" stroke-width="2.5"/>'
        + '<path d="M 122 75 l 3 -8 l 6 9 z" fill="var(--viz-swap)"/>'
        + '<text x="95" y="50" text-anchor="middle" font-size="12" fill="var(--viz-swap)">5 &lt; 8 비교</text>'
        + '<rect x="280" y="75" width="50" height="85" rx="4" fill="none" stroke="var(--viz-sorted)" stroke-width="2.5"/>'
        + '<text x="305" y="180" text-anchor="middle" font-size="11" fill="var(--ok)">맨 뒤 정렬 확정</text>'
        + '</svg>',
      svgCaption: '한 회전이 끝나면 가장 큰 값(초록)이 맨 뒤에 고정된다.',
    },
    {
      title: '선택 정렬',
      tags: ['선택 정렬'],
      gist: '매 회차 <b>남은 구간 전체를 훑어 최솟값</b>을 찾아 맨 앞과 한 번 교환. 비교는 항상 <code>n(n-1)/2</code>로 일정, 교환은 회차당 1번.',
      mnemonic: '"제일 작은 거 골라서(select) 앞에 꽂기". 비교 횟수는 입력과 <b>무관하게 고정</b> → 이미 정렬돼도 안 줄어든다.',
      svg: '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="22" text-anchor="middle" font-size="13" fill="var(--text-soft)">남은 구간에서 최솟값을 찾아 맨 앞과 교환</text>'
        + '<g font-size="15" text-anchor="middle">'
        + '<rect x="40" y="70" width="48" height="60" rx="4" fill="var(--viz-bar)"/><text x="64" y="106" fill="var(--accent-text)">4</text>'
        + '<rect x="98" y="70" width="48" height="60" rx="4" fill="var(--viz-bar)"/><text x="122" y="106" fill="var(--accent-text)">2</text>'
        + '<rect x="156" y="70" width="48" height="60" rx="4" fill="var(--viz-bar)"/><text x="180" y="106" fill="var(--accent-text)">5</text>'
        + '<rect x="214" y="70" width="48" height="60" rx="4" fill="var(--viz-pivot)"/><text x="238" y="106" fill="var(--accent-text)">1</text>'
        + '<rect x="272" y="70" width="48" height="60" rx="4" fill="var(--viz-bar)"/><text x="296" y="106" fill="var(--accent-text)">3</text>'
        + '</g>'
        + '<text x="238" y="150" text-anchor="middle" font-size="11" fill="var(--viz-pivot)">최솟값 1 발견</text>'
        + '<path d="M 64 150 q 87 35 174 0" fill="none" stroke="var(--viz-swap)" stroke-width="2.5"/>'
        + '<path d="M 234 154 l 6 -3 l -2 9 z" fill="var(--viz-swap)"/>'
        + '<text x="151" y="190" text-anchor="middle" font-size="12" fill="var(--viz-swap)">맨 앞(4)과 교환</text>'
        + '</svg>',
      svgCaption: '남은 칸 전체에서 최솟값(1)을 찾아 맨 앞 자리와 단 1번 교환한다.',
    },
    {
      title: '삽입 정렬',
      tags: ['삽입 정렬'],
      gist: '앞쪽을 <b>이미 정렬된 구간</b>으로 보고, 새 원소(key)를 뒤에서부터 밀며 <b>알맞은 위치에 끼워 넣는다</b>. 거의 정렬된 데이터에서 O(n)에 근접.',
      mnemonic: '카드 정리할 때처럼 손에 든 카드를 <b>제자리에 꽂기</b>. while 끝나면 <code>arr[j+1]=key</code>.',
      svg: '<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="22" text-anchor="middle" font-size="13" fill="var(--text-soft)">앞쪽 정렬구간에 key를 끼워 넣기</text>'
        + '<rect x="40" y="70" width="170" height="56" rx="6" fill="none" stroke="var(--viz-sorted)" stroke-width="2" stroke-dasharray="5 4"/>'
        + '<text x="125" y="62" text-anchor="middle" font-size="11" fill="var(--ok)">정렬된 구간</text>'
        + '<g font-size="15" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="48" y="74" width="44" height="48" rx="4" fill="var(--viz-sorted)"/><text x="70" y="104">2</text>'
        + '<rect x="98" y="74" width="44" height="48" rx="4" fill="var(--viz-sorted)"/><text x="120" y="104">5</text>'
        + '<rect x="148" y="74" width="44" height="48" rx="4" fill="var(--viz-sorted)"/><text x="170" y="104">7</text>'
        + '<rect x="300" y="74" width="44" height="48" rx="4" fill="var(--viz-pivot)"/><text x="322" y="104">4</text>'
        + '</g>'
        + '<text x="322" y="142" text-anchor="middle" font-size="11" fill="var(--viz-pivot)">key = 4</text>'
        + '<path d="M 300 98 q -50 0 -95 0" fill="none" stroke="var(--accent)" stroke-width="2.5"/>'
        + '<path d="M 210 98 l 9 -4 l 0 8 z" fill="var(--accent)"/>'
        + '<text x="250" y="165" text-anchor="middle" font-size="12" fill="var(--accent)">5·7을 뒤로 밀고 2와 5 사이에 삽입</text>'
        + '<text x="240" y="195" text-anchor="middle" font-size="13" fill="var(--text)">결과 → 2 4 5 7</text>'
        + '</svg>',
      svgCaption: 'key(4)를 정렬된 구간에 넣기 위해 큰 값(5,7)을 오른쪽으로 밀고 빈 자리에 꽂는다.',
    },
    {
      title: '쉘 정렬',
      tags: ['쉘 정렬'],
      gist: '삽입 정렬의 "한 칸씩만 이동" 단점 보완. <b>gap 간격</b>으로 떨어진 원소끼리 먼저 삽입 정렬하고 gap을 점점 줄여(예: 3→1) 마지막에 일반 삽입 정렬로 마무리.',
      mnemonic: '<b>멀리부터 대강, 가까이서 마무리</b>. gap=3이면 (0·3),(1·4),(2·5) 같은 칸끼리 비교.',
      svg: '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="22" text-anchor="middle" font-size="13" fill="var(--text-soft)">gap=3 — 3칸 떨어진 원소끼리 묶어 정렬</text>'
        + '<g font-size="15" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="36" y="80" width="46" height="50" rx="4" fill="var(--viz-compare)"/><text x="59" y="112">8</text>'
        + '<rect x="90" y="80" width="46" height="50" rx="4" fill="var(--viz-bar)"/><text x="113" y="112">1</text>'
        + '<rect x="144" y="80" width="46" height="50" rx="4" fill="var(--viz-bar)"/><text x="167" y="112">6</text>'
        + '<rect x="198" y="80" width="46" height="50" rx="4" fill="var(--viz-compare)"/><text x="221" y="112">2</text>'
        + '<rect x="252" y="80" width="46" height="50" rx="4" fill="var(--viz-bar)"/><text x="275" y="112">5</text>'
        + '<rect x="306" y="80" width="46" height="50" rx="4" fill="var(--viz-bar)"/><text x="329" y="112">3</text>'
        + '</g>'
        + '<g font-size="11" text-anchor="middle">'
        + '<text x="36" y="148" fill="var(--text-faint)">0</text><text x="90" y="148" fill="var(--text-faint)">1</text>'
        + '<text x="144" y="148" fill="var(--text-faint)">2</text><text x="198" y="148" fill="var(--text-faint)">3</text>'
        + '<text x="252" y="148" fill="var(--text-faint)">4</text><text x="306" y="148" fill="var(--text-faint)">5</text>'
        + '</g>'
        + '<path d="M 59 78 q 81 -34 162 0" fill="none" stroke="var(--viz-swap)" stroke-width="2.5"/>'
        + '<path d="M 218 75 l 6 -3 l -1 9 z" fill="var(--viz-swap)"/>'
        + '<text x="140" y="38" text-anchor="middle" font-size="12" fill="var(--viz-swap)">인덱스 0 ↔ 3 (gap=3)</text>'
        + '<text x="240" y="178" text-anchor="middle" font-size="12" fill="var(--text-soft)">gap을 1까지 줄이며 반복</text>'
        + '</svg>',
      svgCaption: 'gap만큼 떨어진 칸(0·3 등)끼리 먼저 정렬해 큰 값을 멀리 보낸 뒤, gap을 줄여 마무리한다.',
    },
    {
      title: '퀵 정렬',
      tags: ['퀵 정렬', '분할(partition)'],
      gist: '<b>pivot</b>을 기준으로 작은 값/큰 값으로 <b>분할(partition)</b>한 뒤 양쪽을 재귀 정렬. 평균 O(n log n), 단 <b>이미 정렬 + 나쁜 pivot</b>이면 한쪽으로 쏠려 최악 O(n²).',
      mnemonic: '<code>quick_sort(left) + [pivot] + quick_sort(right)</code> — pivot은 정렬 후 <b>제자리 확정</b>.',
      svg: '<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="22" text-anchor="middle" font-size="13" fill="var(--text-soft)">pivot 기준 작은 값 / 큰 값으로 분할</text>'
        + '<g font-size="15" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="180" y="42" width="48" height="44" rx="4" fill="var(--viz-pivot)"/><text x="204" y="71">6</text>'
        + '</g>'
        + '<text x="252" y="68" font-size="12" fill="var(--viz-pivot)">← pivot</text>'
        + '<path d="M 200 90 l -70 36" fill="none" stroke="var(--border-strong)" stroke-width="2"/>'
        + '<path d="M 208 90 l 70 36" fill="none" stroke="var(--border-strong)" stroke-width="2"/>'
        + '<rect x="56" y="128" width="148" height="56" rx="6" fill="var(--bg-elev)" stroke="var(--ok)" stroke-width="1.5"/>'
        + '<text x="130" y="120" text-anchor="middle" font-size="12" fill="var(--ok)">작은 값 (&lt; 6)</text>'
        + '<g font-size="14" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="66" y="138" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="84" y="162">3</text>'
        + '<rect x="108" y="138" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="126" y="162">2</text>'
        + '<rect x="150" y="138" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="168" y="162">5</text>'
        + '</g>'
        + '<rect x="276" y="128" width="106" height="56" rx="6" fill="var(--bg-elev)" stroke="var(--danger)" stroke-width="1.5"/>'
        + '<text x="329" y="120" text-anchor="middle" font-size="12" fill="var(--danger)">큰 값 (≥ 6)</text>'
        + '<g font-size="14" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="288" y="138" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="306" y="162">8</text>'
        + '<rect x="330" y="138" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="348" y="162">9</text>'
        + '</g>'
        + '<text x="240" y="203" text-anchor="middle" font-size="12" fill="var(--text-soft)">양쪽을 재귀 정렬 후 [작은]+[6]+[큰] 으로 합침</text>'
        + '</svg>',
      svgCaption: 'pivot(6)보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 나눈 뒤 각 묶음을 다시 퀵 정렬한다.',
    },
    {
      title: '병합 정렬',
      tags: ['병합 정렬', 'merge'],
      gist: '배열을 <b>반으로 나눠</b> 각각 정렬한 뒤, 두 정렬된 부분을 <b>merge</b>로 합친다. 입력과 무관하게 <b>항상 O(n log n)·안정</b>이지만 보조 배열이 필요해 제자리 아님.',
      mnemonic: '두 줄을 지퍼 잠그듯 작은 값부터 뽑아 합치기. 같은 값은 <code>&lt;=</code>로 비교해 <b>왼쪽 먼저</b> → 안정성 유지.',
      svg: '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="22" text-anchor="middle" font-size="13" fill="var(--text-soft)">정렬된 두 배열을 작은 값부터 병합(merge)</text>'
        + '<g font-size="14" text-anchor="middle" fill="var(--accent-text)">'
        + '<text x="38" y="55" font-size="11" fill="var(--text-faint)" text-anchor="end">left</text>'
        + '<rect x="44" y="40" width="40" height="34" rx="3" fill="var(--viz-sorted)"/><text x="64" y="63">1</text>'
        + '<rect x="90" y="40" width="40" height="34" rx="3" fill="var(--viz-sorted)"/><text x="110" y="63">4</text>'
        + '<rect x="136" y="40" width="40" height="34" rx="3" fill="var(--viz-sorted)"/><text x="156" y="63">7</text>'
        + '<text x="38" y="115" font-size="11" fill="var(--text-faint)" text-anchor="end">right</text>'
        + '<rect x="44" y="100" width="40" height="34" rx="3" fill="var(--viz-compare)"/><text x="64" y="123">2</text>'
        + '<rect x="90" y="100" width="40" height="34" rx="3" fill="var(--viz-compare)"/><text x="110" y="123">3</text>'
        + '<rect x="136" y="100" width="40" height="34" rx="3" fill="var(--viz-compare)"/><text x="156" y="123">6</text>'
        + '</g>'
        + '<path d="M 200 87 l 28 0" fill="none" stroke="var(--accent)" stroke-width="2.5"/>'
        + '<path d="M 224 83 l 9 4 l -9 4 z" fill="var(--accent)"/>'
        + '<g font-size="14" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="244" y="70" width="34" height="34" rx="3" fill="var(--viz-bar)"/><text x="261" y="93">1</text>'
        + '<rect x="280" y="70" width="34" height="34" rx="3" fill="var(--viz-bar)"/><text x="297" y="93">2</text>'
        + '<rect x="316" y="70" width="34" height="34" rx="3" fill="var(--viz-bar)"/><text x="333" y="93">3</text>'
        + '<rect x="352" y="70" width="34" height="34" rx="3" fill="var(--viz-bar)"/><text x="369" y="93">4</text>'
        + '<rect x="388" y="70" width="34" height="34" rx="3" fill="var(--viz-bar)"/><text x="405" y="93">6</text>'
        + '</g>'
        + '<text x="380" y="125" text-anchor="middle" font-size="11" fill="var(--text-faint)">… 7</text>'
        + '<text x="313" y="160" text-anchor="middle" font-size="12" fill="var(--ok)">합친 결과 → 1 2 3 4 6 7</text>'
        + '</svg>',
      svgCaption: '두 정렬된 배열의 앞에서 더 작은 값을 차례로 뽑아 하나의 정렬 배열로 합친다.',
    },
    {
      title: '힙 정렬',
      tags: ['힙 정렬', 'down heap', 'heapify'],
      gist: '배열을 <b>완전이진트리</b>로 보고 <b>최대 힙</b>을 구성(build heap, O(n)) → 루트(최댓값)를 맨 뒤로 보내고 힙 크기를 줄이며 <b>down-heap</b> 반복. 항상 O(n log n)이지만 불안정.',
      mnemonic: '자식 인덱스 = <code>2i+1</code>(왼) · <code>2i+2</code>(오). down-heap은 <b>더 큰 자식</b>과 비교해 아래로 내려보내기.',
      svg: '<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="22" text-anchor="middle" font-size="13" fill="var(--text-soft)">완전이진트리 ↔ 배열 (자식 = 2i+1, 2i+2)</text>'
        + '<line x1="120" y1="62" x2="70" y2="112" stroke="var(--border-strong)" stroke-width="2"/>'
        + '<line x1="120" y1="62" x2="170" y2="112" stroke="var(--border-strong)" stroke-width="2"/>'
        + '<line x1="70" y1="132" x2="42" y2="172" stroke="var(--border-strong)" stroke-width="2"/>'
        + '<line x1="70" y1="132" x2="98" y2="172" stroke="var(--border-strong)" stroke-width="2"/>'
        + '<g font-size="15" text-anchor="middle" fill="var(--accent-text)">'
        + '<circle cx="120" cy="52" r="20" fill="var(--viz-pivot)"/><text x="120" y="57">10</text>'
        + '<circle cx="70" cy="122" r="20" fill="var(--viz-bar)"/><text x="70" y="127">5</text>'
        + '<circle cx="170" cy="122" r="20" fill="var(--viz-bar)"/><text x="170" y="127">3</text>'
        + '<circle cx="42" cy="182" r="18" fill="var(--viz-bar)"/><text x="42" y="187">4</text>'
        + '<circle cx="98" cy="182" r="18" fill="var(--viz-bar)"/><text x="98" y="187">1</text>'
        + '</g>'
        + '<text x="120" y="30" text-anchor="middle" font-size="11" fill="var(--viz-pivot)">루트=최댓값</text>'
        + '<g font-size="13" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="250" y="100" width="36" height="36" rx="3" fill="var(--viz-pivot)"/><text x="268" y="124">10</text>'
        + '<rect x="286" y="100" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="304" y="124">5</text>'
        + '<rect x="322" y="100" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="340" y="124">3</text>'
        + '<rect x="358" y="100" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="376" y="124">4</text>'
        + '<rect x="394" y="100" width="36" height="36" rx="3" fill="var(--viz-bar)"/><text x="412" y="124">1</text>'
        + '</g>'
        + '<g font-size="11" text-anchor="middle" fill="var(--text-faint)">'
        + '<text x="268" y="150">0</text><text x="304" y="150">1</text><text x="340" y="150">2</text>'
        + '<text x="376" y="150">3</text><text x="412" y="150">4</text>'
        + '</g>'
        + '<text x="340" y="180" text-anchor="middle" font-size="11" fill="var(--text-soft)">루트(10)를 맨 뒤로 보내고 힙 축소 → down-heap</text>'
        + '</svg>',
      svgCaption: '배열 인덱스 i의 자식은 2i+1·2i+2. 최대 힙의 루트(최댓값)를 맨 뒤로 빼며 정렬한다.',
    },
    {
      title: '도수 정렬',
      tags: ['도수 정렬', '도수 배열', '누적 합'],
      gist: '<b>비교 없이</b> 각 값의 <b>개수를 세고(도수 배열)</b>, 누적합으로 위치를 정해 배치하는 정렬. 값 범위 k가 작으면 <code>O(n+k)</code>로 매우 빠르나, k가 크면 메모리·시간 낭비.',
      mnemonic: '값을 직접 비교 안 하고 <b>출석부처럼 개수 세기</b> → 누적합 = "내 앞에 몇 개 있나" = 들어갈 자리.',
      svg: '<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">'
        + '<text x="240" y="20" text-anchor="middle" font-size="13" fill="var(--text-soft)">개수 세기 → 누적합 → 위치 결정 (비비교)</text>'
        + '<text x="40" y="52" font-size="12" fill="var(--text-soft)">입력</text>'
        + '<g font-size="13" text-anchor="middle" fill="var(--accent-text)">'
        + '<rect x="90" y="38" width="30" height="28" rx="3" fill="var(--viz-bar)"/><text x="105" y="58">2</text>'
        + '<rect x="124" y="38" width="30" height="28" rx="3" fill="var(--viz-bar)"/><text x="139" y="58">0</text>'
        + '<rect x="158" y="38" width="30" height="28" rx="3" fill="var(--viz-bar)"/><text x="173" y="58">1</text>'
        + '<rect x="192" y="38" width="30" height="28" rx="3" fill="var(--viz-bar)"/><text x="207" y="58">2</text>'
        + '<rect x="226" y="38" width="30" height="28" rx="3" fill="var(--viz-bar)"/><text x="241" y="58">1</text>'
        + '<rect x="260" y="38" width="30" height="28" rx="3" fill="var(--viz-bar)"/><text x="275" y="58">0</text>'
        + '<rect x="294" y="38" width="30" height="28" rx="3" fill="var(--viz-bar)"/><text x="309" y="58">2</text>'
        + '</g>'
        + '<text x="40" y="112" font-size="12" fill="var(--text-soft)">도수</text>'
        + '<g font-size="13" text-anchor="middle">'
        + '<rect x="90" y="96" width="46" height="30" rx="3" fill="var(--viz-compare)"/><text x="113" y="116" fill="var(--accent-text)">2</text>'
        + '<rect x="140" y="96" width="46" height="30" rx="3" fill="var(--viz-compare)"/><text x="163" y="116" fill="var(--accent-text)">2</text>'
        + '<rect x="190" y="96" width="46" height="30" rx="3" fill="var(--viz-compare)"/><text x="213" y="116" fill="var(--accent-text)">3</text>'
        + '<text x="113" y="142" font-size="10" fill="var(--text-faint)">값0</text>'
        + '<text x="163" y="142" font-size="10" fill="var(--text-faint)">값1</text>'
        + '<text x="213" y="142" font-size="10" fill="var(--text-faint)">값2</text>'
        + '</g>'
        + '<text x="40" y="178" font-size="12" fill="var(--text-soft)">누적합</text>'
        + '<g font-size="13" text-anchor="middle">'
        + '<rect x="90" y="162" width="46" height="30" rx="3" fill="var(--viz-sorted)"/><text x="113" y="182" fill="var(--accent-text)">2</text>'
        + '<rect x="140" y="162" width="46" height="30" rx="3" fill="var(--viz-sorted)"/><text x="163" y="182" fill="var(--accent-text)">4</text>'
        + '<rect x="190" y="162" width="46" height="30" rx="3" fill="var(--viz-sorted)"/><text x="213" y="182" fill="var(--accent-text)">7</text>'
        + '</g>'
        + '<text x="340" y="180" text-anchor="middle" font-size="11" fill="var(--ok)">[2,2,3] → [2,4,7]</text>'
        + '<text x="340" y="116" text-anchor="middle" font-size="11" fill="var(--text-faint)">0:2개 1:2개 2:3개</text>'
        + '</svg>',
      svgCaption: '각 값의 개수를 센 도수 배열 [2,2,3]을 누적합 [2,4,7]로 바꾸면 각 값이 들어갈 끝 위치가 정해진다.',
    },
  ],
}
