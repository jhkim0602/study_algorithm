// Ch09 트리 — 시험대비 요약노트(핵심 요약 + 개념별 정리). WF 생성.
export const meta = {
  cheatsheet: [
    { type: 'h3', text: '트리 한 장 요약' },
    {
      type: 'p',
      html:
        '트리는 <b>루트 하나</b>에서 부모→자식으로 가지를 뻗는 <b>비선형·계층</b> 구조. ' +
        '핵심은 셋: <b>용어</b>(높이=거리 ≠ 개수), <b>순회</b>(DFS 3종 + BFS), <b>BST</b>(왼&lt;부모&lt;오).',
    },
    { type: 'h4', text: '순회 4종 — 방문 순서로 외운다' },
    {
      type: 'table',
      headers: ['순회', '방문 순서', '분류', '핵심'],
      rows: [
        ['전위 preorder', '<b>노드</b>→왼→오', 'DFS', '뿌리 먼저(루트 first)'],
        ['중위 inorder', '왼→<b>노드</b>→오', 'DFS', 'BST면 <b>오름차순</b>'],
        ['후위 postorder', '왼→오→<b>노드</b>', 'DFS', '뿌리 마지막(루트 last)'],
        ['레벨 level order', '위 레벨부터 좌→우', 'BFS', '큐 사용, 층층이'],
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html:
        '암기: 전·중·후는 <b>노드를 언제 찍느냐</b>로 구분 — 앞(前)·가운데(中)·뒤(後). ' +
        '왼→오 순서는 셋 다 동일. <b>level order만 BFS</b>, 나머지 셋은 DFS.',
    },
    { type: 'h4', text: 'BST 복잡도 — 모양이 운명' },
    {
      type: 'table',
      headers: ['상태', '높이', '탐색·삽입·삭제'],
      rows: [
        ['균형 잡힘', '<code>log n</code>', '<b>O(log n)</b>'],
        ['치우침(정렬 삽입)', '<code>n</code>', '<b>O(n)</b> — 리스트처럼'],
      ],
    },
    {
      type: 'callout',
      tone: 'warn',
      html:
        '<b>정렬된 순서로 삽입</b>하면(1,2,3,4,5…) 한쪽으로만 매달려 사실상 연결 리스트가 된다 → O(n). ' +
        'BST는 "항상 O(log n) 보장"이 <b>아니다</b>(자가 균형 트리라야 보장).',
    },
    { type: 'h4', text: '완전 이진 트리 배열 공식' },
    {
      type: 'table',
      headers: ['관계', '0-기반 인덱스 i'],
      rows: [
        ['왼쪽 자식', '<code>2i + 1</code>'],
        ['오른쪽 자식', '<code>2i + 2</code>'],
        ['부모', '<code>(i - 1) // 2</code>'],
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html: '암기: <b>2i+1·2i+2 = 왼·오 자식</b> (홀수가 왼쪽, 짝수가 오른쪽). 힙이 이 표현을 그대로 쓴다.',
    },
    { type: 'h4', text: 'BST 삭제 — 자식 수로 분기' },
    {
      type: 'table',
      headers: ['자식 수', '처리'],
      rows: [
        ['0개 (리프)', '그냥 삭제'],
        ['1개', '하나뿐인 자식을 끌어올려 잇기'],
        ['2개 (최난도)', '<b>왼쪽 최댓값(전임자)</b> 또는 <b>오른쪽 최솟값(후임자)</b>으로 대체'],
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html:
        '암기: 두 자식 삭제 = <b>"왼끝(왼쪽 최대) or 오끝(오른쪽 최소)"</b>로 갈아끼우기. ' +
        '두 후보 모두 BST 정렬 순서에서 삭제 노드 바로 옆값이라 조건이 유지된다.',
    },
    {
      type: 'svg',
      caption: '순회 분류 한눈에 — DFS 3형제(전·중·후)와 BFS(레벨)',
      svg:
        '<svg viewBox="0 0 480 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<text x="120" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--accent)">DFS (깊이 우선)</text>' +
        '<rect x="20" y="38" width="200" height="28" rx="6" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="120" y="57" text-anchor="middle" font-size="12" fill="var(--text)">전위 · 중위 · 후위</text>' +
        '<rect x="20" y="74" width="200" height="22" rx="5" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="120" y="89" text-anchor="middle" font-size="11" fill="var(--text-soft)">한 경로 끝까지 → 되돌아옴</text>' +
        '<text x="360" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--ok)">BFS (너비 우선)</text>' +
        '<rect x="260" y="38" width="200" height="28" rx="6" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="360" y="57" text-anchor="middle" font-size="12" fill="var(--text)">레벨 순회 (level order)</text>' +
        '<rect x="260" y="74" width="200" height="22" rx="5" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="360" y="89" text-anchor="middle" font-size="11" fill="var(--text-soft)">같은 레벨 다 보고 → 다음 층</text>' +
        '<text x="240" y="130" text-anchor="middle" font-size="12" fill="var(--text-soft)">중위 순회 + BST = 오름차순 정렬</text>' +
        '<text x="240" y="150" text-anchor="middle" font-size="11" fill="var(--text-faint)">전·중·후는 노드를 찍는 시점만 다름 (왼→오는 동일)</text>' +
        '</svg>',
    },
  ],
  groups: [
    {
      title: '트리 용어',
      tags: ['트리 용어'],
      gist: '루트는 단 하나(부모 없음). 리프=자식 없음, 형제=부모 같음. <b>높이는 거리(가장 긴 경로)지 노드 개수가 아니다.</b>',
      mnemonic: '루트=부모 없는 1명 / 리프=자식 없는 막내 / 높이=개수 아닌 "거리"(낚시 주의)',
      svgCaption: '루트·부모·자식·형제·리프, 그리고 높이=루트→가장 먼 리프까지의 거리',
      svg:
        '<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<line x1="240" y1="40" x2="140" y2="100" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="240" y1="40" x2="340" y2="100" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="140" y1="100" x2="90" y2="160" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="140" y1="100" x2="190" y2="160" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<circle cx="240" cy="40" r="22" fill="var(--accent)" stroke="var(--border-strong)"/>' +
        '<text x="240" y="45" text-anchor="middle" font-size="13" fill="var(--accent-text)">루트</text>' +
        '<circle cx="140" cy="100" r="22" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="140" y="105" text-anchor="middle" font-size="12" fill="var(--text)">부모</text>' +
        '<circle cx="340" cy="100" r="22" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="340" y="98" text-anchor="middle" font-size="11" fill="var(--text)">리프</text>' +
        '<text x="340" y="111" text-anchor="middle" font-size="9" fill="var(--text-soft)">(자식X)</text>' +
        '<circle cx="90" cy="160" r="22" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="90" y="165" text-anchor="middle" font-size="11" fill="var(--text)">자식</text>' +
        '<circle cx="190" cy="160" r="22" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="190" y="165" text-anchor="middle" font-size="11" fill="var(--text)">형제</text>' +
        '<text x="140" y="200" text-anchor="middle" font-size="10" fill="var(--text-faint)">90·190은 형제(부모 같음)</text>' +
        '<line x1="430" y1="40" x2="430" y2="160" stroke="var(--danger)" stroke-width="2" stroke-dasharray="4 3"/>' +
        '<text x="445" y="104" text-anchor="middle" font-size="11" fill="var(--danger)" transform="rotate(90 445 104)">높이=거리</text>' +
        '</svg>',
    },
    {
      title: '순회 (DFS/BFS)',
      tags: ['순회', 'DFS/BFS'],
      gist: 'DFS는 한 경로를 끝까지 내려갔다 되돌아옴(전·중·후위). BFS는 레벨 순서(level order). <b>중위+BST=오름차순.</b>',
      mnemonic: '노드 찍는 시점: 전(앞)·중(가운데)·후(뒤) / level order만 BFS, 나머지 셋은 DFS',
      svgCaption: '같은 트리, 노드(N)를 언제 찍느냐로 전위·중위·후위가 갈린다',
      svg:
        '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<line x1="80" y1="35" x2="45" y2="80" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="80" y1="35" x2="115" y2="80" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<circle cx="80" cy="35" r="16" fill="var(--accent)" stroke="var(--border-strong)"/>' +
        '<text x="80" y="40" text-anchor="middle" font-size="12" fill="var(--accent-text)">N</text>' +
        '<circle cx="45" cy="85" r="14" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="45" y="90" text-anchor="middle" font-size="11" fill="var(--text)">왼</text>' +
        '<circle cx="115" cy="85" r="14" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="115" y="90" text-anchor="middle" font-size="11" fill="var(--text)">오</text>' +
        '<text x="240" y="40" font-size="13" fill="var(--text)"><tspan font-weight="bold" fill="var(--accent)">전위</tspan> : N → 왼 → 오</text>' +
        '<text x="240" y="68" font-size="13" fill="var(--text)"><tspan font-weight="bold" fill="var(--ok)">중위</tspan> : 왼 → N → 오  → 정렬!</text>' +
        '<text x="240" y="96" font-size="13" fill="var(--text)"><tspan font-weight="bold" fill="var(--warn)">후위</tspan> : 왼 → 오 → N</text>' +
        '<rect x="30" y="140" width="420" height="44" rx="8" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="240" y="160" text-anchor="middle" font-size="12" fill="var(--ok)" font-weight="bold">레벨 순회 (BFS)</text>' +
        '<text x="240" y="177" text-anchor="middle" font-size="11" fill="var(--text-soft)">위 레벨부터 좌→우, 층층이 (큐 사용)</text>' +
        '</svg>',
    },
    {
      title: '이진·완전이진 트리',
      tags: ['이진 트리', '완전 이진 트리', '배열 표현'],
      gist: '이진 트리=노드당 자식 최대 2개. 완전 이진 트리=마지막 레벨만 빼고 꽉, 마지막은 <b>왼쪽부터</b> 채움. 배열로 i의 왼=2i+1, 오=2i+2.',
      mnemonic: '완전=빈틈 없이 왼쪽부터 / 배열 공식 2i+1·2i+2 = 왼·오 자식 (힙도 동일)',
      svgCaption: '완전 이진 트리 ↔ 배열 인덱스 대응 (i=0 루트, 왼 2i+1 / 오 2i+2)',
      svg:
        '<svg viewBox="0 0 480 215" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<line x1="120" y1="35" x2="70" y2="85" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="120" y1="35" x2="170" y2="85" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="70" y1="85" x2="40" y2="135" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="70" y1="85" x2="100" y2="135" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<circle cx="120" cy="35" r="17" fill="var(--accent)" stroke="var(--border-strong)"/>' +
        '<text x="120" y="40" text-anchor="middle" font-size="12" fill="var(--accent-text)">0</text>' +
        '<circle cx="70" cy="85" r="17" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="70" y="90" text-anchor="middle" font-size="12" fill="var(--text)">1</text>' +
        '<circle cx="170" cy="85" r="17" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="170" y="90" text-anchor="middle" font-size="12" fill="var(--text)">2</text>' +
        '<circle cx="40" cy="135" r="17" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="40" y="140" text-anchor="middle" font-size="12" fill="var(--text)">3</text>' +
        '<circle cx="100" cy="135" r="17" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="100" y="140" text-anchor="middle" font-size="12" fill="var(--text)">4</text>' +
        '<g font-size="12">' +
        '<rect x="280" y="40" width="34" height="34" fill="var(--accent)" stroke="var(--border-strong)"/>' +
        '<text x="297" y="62" text-anchor="middle" fill="var(--accent-text)">0</text>' +
        '<rect x="314" y="40" width="34" height="34" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="331" y="62" text-anchor="middle" fill="var(--text)">1</text>' +
        '<rect x="348" y="40" width="34" height="34" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="365" y="62" text-anchor="middle" fill="var(--text)">2</text>' +
        '<rect x="382" y="40" width="34" height="34" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="399" y="62" text-anchor="middle" fill="var(--text)">3</text>' +
        '<rect x="416" y="40" width="34" height="34" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="433" y="62" text-anchor="middle" fill="var(--text)">4</text>' +
        '</g>' +
        '<text x="365" y="92" text-anchor="middle" font-size="11" fill="var(--text-soft)">배열 인덱스 = 레벨 순서</text>' +
        '<text x="240" y="180" text-anchor="middle" font-size="12" fill="var(--accent)" font-weight="bold">왼 = 2i+1   ·   오 = 2i+2   ·   부모 = (i-1)//2</text>' +
        '<text x="240" y="202" text-anchor="middle" font-size="11" fill="var(--text-faint)">예: i=1 → 왼 3, 오 4 / 부모 0</text>' +
        '</svg>',
    },
    {
      title: '이진 검색 트리(BST)',
      tags: ['BST', 'BST 탐색', 'BST 삽입'],
      gist: '모든 노드에서 <b>왼 &lt; 부모 &lt; 오</b>. 탐색·삽입은 루트부터 비교해 <b>한 방향</b>으로만 내려감. 첫 삽입값이 루트.',
      mnemonic: '왼&lt;부모&lt;오 / 탐색=한 방향만 (양쪽 X) / 정렬 순서로 넣으면 한쪽 쏠림→O(n)',
      svgCaption: 'BST 규칙: 왼쪽 서브트리 < 부모 < 오른쪽 서브트리, 탐색은 한쪽으로만',
      svg:
        '<svg viewBox="0 0 480 205" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<line x1="200" y1="38" x2="120" y2="98" stroke="var(--accent)" stroke-width="2.5"/>' +
        '<line x1="200" y1="38" x2="280" y2="98" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="280" y1="98" x2="240" y2="158" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="280" y1="98" x2="330" y2="158" stroke="var(--accent)" stroke-width="2.5"/>' +
        '<circle cx="200" cy="38" r="20" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="200" y="44" text-anchor="middle" font-size="14" fill="var(--text)">8</text>' +
        '<circle cx="120" cy="98" r="20" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="120" y="104" text-anchor="middle" font-size="14" fill="var(--text)">3</text>' +
        '<circle cx="280" cy="98" r="20" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="280" y="104" text-anchor="middle" font-size="14" fill="var(--text)">10</text>' +
        '<circle cx="240" cy="158" r="20" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="240" y="164" text-anchor="middle" font-size="14" fill="var(--text)">9</text>' +
        '<circle cx="330" cy="158" r="20" fill="var(--accent)" stroke="var(--border-strong)"/>' +
        '<text x="330" y="164" text-anchor="middle" font-size="14" fill="var(--accent-text)">14</text>' +
        '<text x="135" y="40" font-size="12" fill="var(--text-soft)">왼 작음</text>' +
        '<text x="312" y="80" font-size="12" fill="var(--text-soft)">오 큼</text>' +
        '<text x="240" y="196" text-anchor="middle" font-size="11" fill="var(--accent)">14 탐색: 8→10→14 (큰 쪽으로만 3번 비교)</text>' +
        '</svg>',
    },
    {
      title: 'BST 삭제',
      tags: ['BST 삭제'],
      gist: '자식 0개=바로 삭제, 1개=자식 끌어올리기, <b>2개=최난도</b>: 왼쪽 최댓값(전임자) 또는 오른쪽 최솟값(후임자)으로 대체.',
      mnemonic: '두 자식 삭제 = "왼끝(왼쪽 최대) or 오끝(오른쪽 최소)"로 갈아끼우기 → BST 조건 유지',
      svgCaption: '두 자식 노드(8) 삭제: 오른쪽 서브트리 최솟값(9) 또는 왼쪽 최댓값(7)으로 대체',
      svg:
        '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<line x1="200" y1="38" x2="120" y2="95" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="200" y1="38" x2="290" y2="95" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="120" y1="95" x2="160" y2="150" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<line x1="290" y1="95" x2="250" y2="150" stroke="var(--text-faint)" stroke-width="2"/>' +
        '<circle cx="200" cy="38" r="20" fill="var(--danger)" stroke="var(--border-strong)"/>' +
        '<text x="200" y="44" text-anchor="middle" font-size="14" fill="var(--accent-text)">8</text>' +
        '<text x="200" y="20" text-anchor="middle" font-size="11" fill="var(--danger)">삭제 대상</text>' +
        '<circle cx="120" cy="95" r="18" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="120" y="100" text-anchor="middle" font-size="13" fill="var(--text)">3</text>' +
        '<circle cx="290" cy="95" r="18" fill="var(--bg-elev)" stroke="var(--text-faint)"/>' +
        '<text x="290" y="100" text-anchor="middle" font-size="13" fill="var(--text)">12</text>' +
        '<circle cx="160" cy="150" r="18" fill="var(--ok)" stroke="var(--border-strong)"/>' +
        '<text x="160" y="155" text-anchor="middle" font-size="13" fill="var(--accent-text)">7</text>' +
        '<text x="160" y="186" text-anchor="middle" font-size="10" fill="var(--ok)">왼쪽 최대=전임자</text>' +
        '<circle cx="250" cy="150" r="18" fill="var(--ok)" stroke="var(--border-strong)"/>' +
        '<text x="250" y="155" text-anchor="middle" font-size="13" fill="var(--accent-text)">9</text>' +
        '<text x="250" y="186" text-anchor="middle" font-size="10" fill="var(--ok)">오른쪽 최소=후임자</text>' +
        '<text x="410" y="95" text-anchor="middle" font-size="11" fill="var(--text-soft)">둘 중</text>' +
        '<text x="410" y="111" text-anchor="middle" font-size="11" fill="var(--text-soft)">하나로</text>' +
        '<text x="410" y="127" text-anchor="middle" font-size="11" fill="var(--text-soft)">대체</text>' +
        '</svg>',
    },
  ],
}
