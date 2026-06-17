// Ch08 리스트 — 시험대비 요약노트(핵심 요약 + 개념별 정리)
// 원본 문제: src/data/ch08-list.js

export const meta = {
  cheatsheet: [
    { type: 'h3', text: 'Ch08 리스트 — 시험 직전 핵심' },
    {
      type: 'p',
      html:
        '리스트는 <b>순서</b>가 있는 선형 자료구조. 구현은 둘 — <b>배열 리스트</b>(연속 메모리, 인덱스) vs <b>연결 리스트</b>(노드+포인터). ' +
        '시험은 <b>"어느 연산이 빠른가"</b>와 <b>"연결 리스트 종류 구분"</b>에서 갈린다.',
    },

    { type: 'h4', text: '배열 vs 연결 리스트 — 복잡도 한 표' },
    {
      type: 'table',
      headers: ['연산', '배열 리스트', '연결 리스트'],
      rows: [
        ['인덱스 접근(임의 접근)', '<b>O(1)</b> 빠름', '<b>O(n)</b> 느림'],
        ['앞/중간 삽입·삭제', 'O(n) 데이터 밀기', '<b>O(1)</b> 링크만 변경(위치 알 때)'],
        ['데이터 탐색(검색)', '순차/이진(정렬 시)', '순차 탐색 <b>O(n)</b>'],
        ['메모리', '연속 공간', '노드마다 포인터 추가'],
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html:
        '암기: <b>배열=빠른 접근/느린 삽삭</b>, <b>연결=느린 접근/빠른 삽삭</b>. ' +
        '"배접연삽" — 배열은 접근, 연결은 삽입·삭제가 강점.',
    },

    { type: 'h4', text: '노드와 포인터 용어 (단골 출제)' },
    {
      type: 'table',
      headers: ['용어', '의미'],
      rows: [
        ['노드(node)', '<code>데이터</code> + 다음 노드 주소 <code>next</code>'],
        ['head', '리스트의 <b>첫 노드</b>를 가리킴 (빈 리스트면 <code>None</code>)'],
        ['tail', '마지막 노드. 단순 리스트는 <code>tail.next = None</code>'],
        ['current', '지금 <b>주목·처리 중</b>인 노드를 가리킴'],
        ['predecessor', '현재 노드 <b>바로 앞</b> 노드 (선행)'],
        ['successor', '현재 노드 <b>바로 뒤</b> 노드 (후속)'],
      ],
    },
    {
      type: 'callout',
      tone: 'warn',
      html:
        '함정: 단순 리스트의 <code>tail.next</code>는 <b>자기 자신이 아니라 None</b>! ' +
        '자기 자신/head를 가리키는 건 <b>원형</b> 리스트다.',
    },

    { type: 'h4', text: '삭제 연산 비용 비교' },
    {
      type: 'table',
      headers: ['연산', '동작', '비용'],
      rows: [
        ['remove_first()', 'head를 head.next로 변경', '<b>O(1)</b>'],
        ['remove_last() (단순)', 'tail 직전 노드 찾으려 head부터 순차 탐색', '<b>O(n)</b>'],
        ['remove_last() (이중)', 'prev로 직전 노드 바로 접근', 'O(1)'],
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html: '암기: <b>앞 빼기는 공짜, 뒤 빼기는 (단순이면) 다 훑어야 함</b>.',
    },

    { type: 'h4', text: '연결 리스트 4종 + 커서 구분 (핵심)' },
    {
      type: 'table',
      headers: ['종류', '노드 링크', '특징 / 끝 처리'],
      rows: [
        ['단순', '<code>next</code>만', 'tail.next = None, 한 방향'],
        ['이중', '<code>prev</code> + <code>next</code>', '양방향 탐색 가능'],
        ['원형', '<code>next</code>만', 'tail.next = head (끝↔처음 연결)'],
        ['원형 이중', 'prev+next+원형', '더미 노드로 경계 처리 단순화'],
        ['커서', '배열 <b>인덱스</b>', '포인터 대신 인덱스, free list로 빈칸 재사용'],
      ],
    },
    {
      type: 'callout',
      tone: 'tip',
      html:
        '암기 비유: <b>단순=한 줄</b>, <b>이중=양손잡이</b>, <b>원형=뱅글뱅글</b>, ' +
        '<b>커서=배열로 흉내</b>, <b>더미=경비실</b>(경계 조건 대신 막아줌).',
    },

    { type: 'h4', text: '커서 연결 리스트 & free list' },
    {
      type: 'list',
      items: [
        '포인터가 없는 환경에서 <b>배열 인덱스</b>로 next를 표현.',
        '삭제된 칸은 버리지 않고 <b>free list</b>에 모아 <b>재사용</b>.',
        '함정: 삭제만 반복하고 재사용 안 하면 <b>빈 레코드가 계속 증가</b>.',
      ],
    },
  ],

  groups: [
    {
      title: '배열 리스트',
      tags: ['배열 리스트'],
      gist:
        '연속 메모리에 데이터를 담아 인덱스로 O(1) 접근. 대신 중간 삽입·삭제는 뒤 데이터를 밀어야 해 O(n).',
      mnemonic: '"인덱스로 콕 집어 빠름, 끼워넣기는 다 밀어야 해 느림" — 배열은 접근이 강점.',
      svg:
        '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<text x="10" y="24" fill="var(--text)" font-size="14" font-weight="bold">배열 리스트 — 인덱스 접근 O(1)</text>' +
        '<g font-size="13">' +
        '<rect x="20" y="50" width="56" height="44" fill="var(--viz-bar)" stroke="var(--border-strong)"/>' +
        '<rect x="76" y="50" width="56" height="44" fill="var(--viz-bar)" stroke="var(--border-strong)"/>' +
        '<rect x="132" y="50" width="56" height="44" fill="var(--viz-bar)" stroke="var(--border-strong)"/>' +
        '<rect x="188" y="50" width="56" height="44" fill="var(--viz-bar)" stroke="var(--border-strong)"/>' +
        '<rect x="244" y="50" width="56" height="44" fill="var(--viz-bar)" stroke="var(--border-strong)"/>' +
        '<text x="48" y="78" fill="var(--accent-text)" text-anchor="middle">A</text>' +
        '<text x="104" y="78" fill="var(--accent-text)" text-anchor="middle">B</text>' +
        '<text x="160" y="78" fill="var(--accent-text)" text-anchor="middle">C</text>' +
        '<text x="216" y="78" fill="var(--accent-text)" text-anchor="middle">D</text>' +
        '<text x="272" y="78" fill="var(--accent-text)" text-anchor="middle">E</text>' +
        '<text x="48" y="112" fill="var(--text-faint)" text-anchor="middle" font-size="11">[0]</text>' +
        '<text x="104" y="112" fill="var(--text-faint)" text-anchor="middle" font-size="11">[1]</text>' +
        '<text x="160" y="112" fill="var(--text-faint)" text-anchor="middle" font-size="11">[2]</text>' +
        '<text x="216" y="112" fill="var(--text-faint)" text-anchor="middle" font-size="11">[3]</text>' +
        '<text x="272" y="112" fill="var(--text-faint)" text-anchor="middle" font-size="11">[4]</text>' +
        '</g>' +
        '<path d="M160 150 L160 96" stroke="var(--ok)" stroke-width="2" marker-end="url(#a8ar)"/>' +
        '<text x="160" y="166" fill="var(--ok)" font-size="12" text-anchor="middle">a[2] 바로 접근 → O(1)</text>' +
        '<text x="20" y="190" fill="var(--danger)" font-size="12">중간 삽입: 뒤 칸 모두 →→ 밀기 (O(n))</text>' +
        '<defs><marker id="a8ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--ok)"/></marker></defs>' +
        '</svg>',
      svgCaption: '인덱스로 임의 위치를 O(1)에 접근. 중간 삽입·삭제는 뒤 데이터를 밀어야 해 O(n).',
    },

    {
      title: '단순 연결 리스트',
      tags: [
        '단순 연결 리스트',
        '노드 구조',
        '순차 탐색',
        '삽입/삭제 연산',
        '포인터 변수',
        'predecessor/successor',
        '연결 리스트',
      ],
      gist:
        '각 노드는 [데이터|next]. head부터 한 방향으로만 따라가는 순차 탐색. tail.next = None.',
      mnemonic:
        '"한 줄 기차" — next로만 이어진 한쪽 통행. 앞 노드(predecessor)를 보려면 head부터 다시 출발.',
      svg:
        '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<text x="10" y="24" fill="var(--text)" font-size="14" font-weight="bold">단순 연결 리스트 — next만, 한 방향</text>' +
        '<text x="14" y="58" fill="var(--text-soft)" font-size="12">head</text>' +
        '<path d="M22 64 L44 80" stroke="var(--accent)" stroke-width="2" marker-end="url(#l8ar)"/>' +
        '<g font-size="12">' +
        '<rect x="44" y="80" width="80" height="40" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<line x1="94" y1="80" x2="94" y2="120" stroke="var(--border-strong)"/>' +
        '<text x="69" y="105" fill="var(--text)" text-anchor="middle">A</text>' +
        '<text x="109" y="104" fill="var(--text-faint)" text-anchor="middle" font-size="10">next</text>' +
        '<rect x="174" y="80" width="80" height="40" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<line x1="224" y1="80" x2="224" y2="120" stroke="var(--border-strong)"/>' +
        '<text x="199" y="105" fill="var(--text)" text-anchor="middle">B</text>' +
        '<text x="239" y="104" fill="var(--text-faint)" text-anchor="middle" font-size="10">next</text>' +
        '<rect x="304" y="80" width="80" height="40" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<line x1="354" y1="80" x2="354" y2="120" stroke="var(--border-strong)"/>' +
        '<text x="329" y="105" fill="var(--text)" text-anchor="middle">C</text>' +
        '<text x="369" y="104" fill="var(--text-faint)" text-anchor="middle" font-size="10">next</text>' +
        '</g>' +
        '<path d="M124 100 L174 100" stroke="var(--accent)" stroke-width="2" marker-end="url(#l8ar)"/>' +
        '<path d="M254 100 L304 100" stroke="var(--accent)" stroke-width="2" marker-end="url(#l8ar)"/>' +
        '<path d="M384 100 L420 100" stroke="var(--text-soft)" stroke-width="2" marker-end="url(#l8ar)"/>' +
        '<text x="424" y="104" fill="var(--text-soft)" font-size="12">None</text>' +
        '<text x="44" y="156" fill="var(--text-soft)" font-size="11">predecessor(앞) ← current → successor(뒤)</text>' +
        '<text x="44" y="180" fill="var(--danger)" font-size="11">remove_last: 앞 노드 찾으려 head부터 순차 탐색 O(n)</text>' +
        '<defs><marker id="l8ar" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="var(--accent)"/></marker></defs>' +
        '</svg>',
      svgCaption: '[데이터|next] 노드가 한 방향으로 연결. 마지막 노드의 next는 None.',
    },

    {
      title: '이중 연결 리스트',
      tags: ['이중 연결 리스트'],
      gist:
        '각 노드가 prev와 next를 모두 보유. 앞뒤 양방향 탐색 가능, 직전 노드 접근이 O(1)이라 remove_last도 빠름.',
      mnemonic: '"양손잡이" — 앞손(prev) 뒷손(next) 둘 다. 단점은 포인터 하나 더 → 메모리 증가.',
      svg:
        '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<text x="10" y="24" fill="var(--text)" font-size="14" font-weight="bold">이중 연결 리스트 — prev ↔ next 양방향</text>' +
        '<g font-size="12">' +
        '<rect x="40" y="80" width="100" height="44" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<line x1="73" y1="80" x2="73" y2="124" stroke="var(--border-strong)"/>' +
        '<line x1="107" y1="80" x2="107" y2="124" stroke="var(--border-strong)"/>' +
        '<text x="56" y="107" fill="var(--text-faint)" text-anchor="middle" font-size="9">prev</text>' +
        '<text x="90" y="107" fill="var(--text)" text-anchor="middle">A</text>' +
        '<text x="124" y="107" fill="var(--text-faint)" text-anchor="middle" font-size="9">next</text>' +
        '<rect x="190" y="80" width="100" height="44" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<line x1="223" y1="80" x2="223" y2="124" stroke="var(--border-strong)"/>' +
        '<line x1="257" y1="80" x2="257" y2="124" stroke="var(--border-strong)"/>' +
        '<text x="206" y="107" fill="var(--text-faint)" text-anchor="middle" font-size="9">prev</text>' +
        '<text x="240" y="107" fill="var(--text)" text-anchor="middle">B</text>' +
        '<text x="274" y="107" fill="var(--text-faint)" text-anchor="middle" font-size="9">next</text>' +
        '<rect x="340" y="80" width="100" height="44" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<line x1="373" y1="80" x2="373" y2="124" stroke="var(--border-strong)"/>' +
        '<line x1="407" y1="80" x2="407" y2="124" stroke="var(--border-strong)"/>' +
        '<text x="356" y="107" fill="var(--text-faint)" text-anchor="middle" font-size="9">prev</text>' +
        '<text x="390" y="107" fill="var(--text)" text-anchor="middle">C</text>' +
        '<text x="424" y="107" fill="var(--text-faint)" text-anchor="middle" font-size="9">next</text>' +
        '</g>' +
        '<path d="M140 94 L190 94" stroke="var(--accent)" stroke-width="2" marker-end="url(#d8r)"/>' +
        '<path d="M190 112 L140 112" stroke="var(--viz-compare)" stroke-width="2" marker-end="url(#d8l)"/>' +
        '<path d="M290 94 L340 94" stroke="var(--accent)" stroke-width="2" marker-end="url(#d8r)"/>' +
        '<path d="M340 112 L290 112" stroke="var(--viz-compare)" stroke-width="2" marker-end="url(#d8l)"/>' +
        '<text x="40" y="158" fill="var(--accent)" font-size="11">next → 뒤로 이동</text>' +
        '<text x="40" y="178" fill="var(--viz-compare)" font-size="11">← prev (직전 노드 O(1) 접근)</text>' +
        '<defs>' +
        '<marker id="d8r" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="var(--accent)"/></marker>' +
        '<marker id="d8l" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="var(--viz-compare)"/></marker>' +
        '</defs>' +
        '</svg>',
      svgCaption: '각 노드가 prev·next 둘 다 가져 양방향 이동. 직전 노드 접근이 O(1).',
    },

    {
      title: '원형·원형이중 연결 리스트',
      tags: ['원형 연결 리스트', '원형 이중 연결 리스트', '더미 노드'],
      gist:
        '마지막 노드의 next가 head를 가리켜 끝과 처음이 이어짐(원형). 원형+이중에 더미 노드를 두면 경계 조건이 줄어 삽입·삭제가 단순해진다.',
      mnemonic:
        '"뱅글뱅글 + 경비실" — tail.next=head로 빙글빙글, 더미(경비실) 하나가 "비었나/끝인가" 예외처리를 막아줌.',
      svg:
        '<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<text x="10" y="24" fill="var(--text)" font-size="14" font-weight="bold">원형 — tail.next = head (끝↔처음 연결)</text>' +
        '<text x="40" y="62" fill="var(--text-soft)" font-size="11">head</text>' +
        '<g font-size="12">' +
        '<rect x="60" y="70" width="70" height="40" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="95" y="95" fill="var(--text)" text-anchor="middle">A</text>' +
        '<rect x="205" y="70" width="70" height="40" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="240" y="95" fill="var(--text)" text-anchor="middle">B</text>' +
        '<rect x="350" y="70" width="80" height="40" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<text x="390" y="95" fill="var(--text)" text-anchor="middle">C(tail)</text>' +
        '</g>' +
        '<path d="M130 90 L205 90" stroke="var(--accent)" stroke-width="2" marker-end="url(#c8r)"/>' +
        '<path d="M275 90 L350 90" stroke="var(--accent)" stroke-width="2" marker-end="url(#c8r)"/>' +
        '<path d="M390 110 L390 150 L95 150 L95 110" fill="none" stroke="var(--warn)" stroke-width="2" marker-end="url(#c8w)"/>' +
        '<text x="242" y="145" fill="var(--warn)" font-size="11" text-anchor="middle">tail.next → head</text>' +
        '<text x="14" y="190" fill="var(--text-soft)" font-size="11">원형 이중: prev+next+원형, 더미 노드로 경계조건(빈 리스트·끝 처리) 제거</text>' +
        '<defs>' +
        '<marker id="c8r" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="var(--accent)"/></marker>' +
        '<marker id="c8w" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="var(--warn)"/></marker>' +
        '</defs>' +
        '</svg>',
      svgCaption: '마지막 노드가 head로 되돌아가 원형을 이룸. 더미 노드는 삽입·삭제의 경계 처리를 단순화.',
    },

    {
      title: '커서 연결 리스트',
      tags: ['커서 연결 리스트', 'free list'],
      gist:
        '포인터 대신 배열 인덱스로 next를 표현. 삭제된 칸은 버리지 않고 free list에 모아 재사용한다.',
      mnemonic:
        '"배열로 흉내 + 재활용함" — 인덱스가 곧 포인터. 빈칸은 free list(재활용함)에 넣어 두고 다시 씀. 안 쓰면 빈 레코드만 쌓임.',
      svg:
        '<svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<text x="10" y="24" fill="var(--text)" font-size="14" font-weight="bold">커서 리스트 — next가 배열 인덱스</text>' +
        '<g font-size="11">' +
        '<text x="18" y="80" fill="var(--text-faint)">idx</text>' +
        '<text x="18" y="100" fill="var(--text-faint)">data</text>' +
        '<text x="18" y="120" fill="var(--text-faint)">next</text>' +
        '<rect x="70" y="62" width="58" height="56" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<rect x="128" y="62" width="58" height="56" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<rect x="186" y="62" width="58" height="56" fill="var(--viz-sorted)" stroke="var(--border-strong)"/>' +
        '<rect x="244" y="62" width="58" height="56" fill="var(--bg-elev)" stroke="var(--border-strong)"/>' +
        '<rect x="302" y="62" width="58" height="56" fill="var(--viz-sorted)" stroke="var(--border-strong)"/>' +
        '<g text-anchor="middle">' +
        '<text x="99" y="56" fill="var(--text-soft)">0</text>' +
        '<text x="157" y="56" fill="var(--text-soft)">1</text>' +
        '<text x="215" y="56" fill="var(--text-soft)">2</text>' +
        '<text x="273" y="56" fill="var(--text-soft)">3</text>' +
        '<text x="331" y="56" fill="var(--text-soft)">4</text>' +
        '<text x="99" y="92" fill="var(--text)">A</text>' +
        '<text x="157" y="92" fill="var(--text)">B</text>' +
        '<text x="215" y="92" fill="var(--text-faint)">·</text>' +
        '<text x="273" y="92" fill="var(--text)">C</text>' +
        '<text x="331" y="92" fill="var(--text-faint)">·</text>' +
        '<text x="99" y="112" fill="var(--accent)">1</text>' +
        '<text x="157" y="112" fill="var(--accent)">3</text>' +
        '<text x="215" y="112" fill="var(--warn)">4</text>' +
        '<text x="273" y="112" fill="var(--accent)">-1</text>' +
        '<text x="331" y="112" fill="var(--warn)">-1</text>' +
        '</g>' +
        '</g>' +
        '<text x="20" y="150" fill="var(--accent)" font-size="11">데이터 연결: 0(A) → 1(B) → 3(C) → 끝(-1)</text>' +
        '<text x="20" y="172" fill="var(--warn)" font-size="11">free list(빈칸 재사용): 2 → 4 → -1</text>' +
        '<text x="20" y="194" fill="var(--danger)" font-size="11">삭제만 반복하고 재사용 안 하면 빈 레코드 증가</text>' +
        '</svg>',
      svgCaption: 'next를 배열 인덱스로 표현. 삭제된 빈칸(2,4)은 free list로 묶어 재사용한다.',
    },
  ],
}
