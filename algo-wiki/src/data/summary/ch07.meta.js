// Ch07 문자열 검색 — 시험대비 요약노트(cheatsheet + 개념별 정리)
export const meta = {
  cheatsheet: [
    { type: 'h3', text: '한 줄 정의' },
    {
      type: 'p',
      html:
        '문자열 검색 = 긴 <b>텍스트(text, 길이 n)</b> 안에서 짧은 <b>패턴(pattern, 길이 m)</b>이 ' +
        '나오는 위치를 찾는 것. 세 알고리즘의 차이는 단 하나 — <b>불일치가 났을 때 패턴을 얼마나 똑똑하게 미는가</b>.',
    },

    { type: 'h4', text: '세 알고리즘 비교표 (시험 핵심)' },
    {
      type: 'table',
      headers: ['알고리즘', '비교 방향', '불일치 시 이동', '시간복잡도', '한 줄 특징'],
      rows: [
        ['브루트 포스', '앞 →', '딱 <b>한 칸</b>', '<code>O(nm)</code>', '제일 단순, 정보 버림'],
        ['KMP', '앞 →', '<b>skip table</b>만큼', '<code>O(n+m)</code>', '비교 정보 <b>재사용</b>'],
        ['보이어-무어', '<b>뒤 ←</b>', '<b>여러 칸</b> 점프', 'O(nm) ~ O(n/m)', '실제로 <b>제일 빠름</b>'],
      ],
    },

    {
      type: 'callout',
      tone: 'tip',
      html:
        '<b>형광펜</b> — 비교 방향만 외워도 절반은 맞힌다. ' +
        '브루트·KMP는 <b>앞부터</b>, 보이어-무어만 <b>뒤(끝 문자)부터</b>. ' +
        '"보이어-무어 = 뒤에서 거꾸로, 한 번에 멀리"로 기억.',
    },

    { type: 'h4', text: '암기 표어' },
    {
      type: 'list',
      items: [
        '<b>"무한칸 · 캄선형 · 보뒤점"</b> → 브루트=한칸씩 / KMP(캄)=선형 O(n+m) / 보이어무어=뒤에서·점프.',
        '<b>skip table = KMP 전용</b>. 표 보고 "skip table" 나오면 무조건 KMP.',
        '<b>O(n+m) = KMP만</b>. 보기에 O(n+m) 있으면 KMP 정답 신호.',
        '<b>패턴 = 찾는 것</b>, <b>텍스트 = 찾아지는(대상) 것</b>. (헷갈리면 "패턴을 텍스트 안에서 찾는다")',
      ],
    },

    {
      type: 'callout',
      tone: 'warn',
      html:
        '<b>함정 주의</b> — ① "찾으려는 문자열 = 텍스트"는 <b>X</b>(→ 패턴). ' +
        '② 보이어-무어는 "앞 문자부터" <b>X</b>(→ 끝 문자부터). ' +
        '③ KMP는 불일치 시 "항상 처음부터" <b>X</b>(→ skip만큼 건너뜀). ' +
        '④ <b>이진 검색·병합 정렬</b>은 문자열 검색 알고리즘 <b>아님</b>. ' +
        '⑤ 문자열 검색에 정렬은 <b>필요 없음</b>.',
    },

    { type: 'h4', text: '브루트 포스가 느린 이유 / KMP가 빠른 이유' },
    {
      type: 'list',
      items: [
        '<b>브루트 포스</b>: 이미 일치했던 비교 정보를 <b>전부 버리고</b> 한 칸 밀어 처음부터 다시 → 같은 비교 반복.',
        '<b>KMP</b>: 패턴 내부의 <b>접두사·접미사 겹침</b>을 미리 계산(skip table) → 텍스트 포인터는 <b>뒤로 안 감</b>.',
        '<b>보이어-무어</b>: 불일치 문자가 패턴에 <b>아예 없으면 패턴 길이만큼</b> 점프 → 글자를 통째로 건너뜀.',
      ],
    },
  ],

  groups: [
    {
      title: '문자열 검색 기초',
      tags: ['문자열 검색 기초', '텍스트와 패턴'],
      gist:
        '긴 <b>텍스트(n)</b> 속에서 짧은 <b>패턴(m)</b>의 위치(또는 존재 여부)를 찾는 문제. 정렬은 필요 없다.',
      mnemonic:
        '"패턴을 텍스트 안에서 찾는다" — 찾는 게 패턴, 찾아지는 대상이 텍스트. 이진검색·병합정렬은 문자열 검색이 아니다.',
      svg:
        '<svg viewBox="0 0 480 170" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        '<text x="20" y="34" font-size="13" fill="var(--text-soft)">텍스트 (길이 n)</text>' +
        // text cells
        '<g font-size="15" text-anchor="middle">' +
        '<rect x="20"  y="44" width="34" height="34" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="37"  y="66" fill="var(--text)">A</text>' +
        '<rect x="54"  y="44" width="34" height="34" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="71"  y="66" fill="var(--text)">B</text>' +
        '<rect x="88"  y="44" width="34" height="34" rx="4" fill="var(--viz-sorted)" stroke="var(--border-strong)"/><text x="105" y="66" fill="var(--accent-text)">C</text>' +
        '<rect x="122" y="44" width="34" height="34" rx="4" fill="var(--viz-sorted)" stroke="var(--border-strong)"/><text x="139" y="66" fill="var(--accent-text)">A</text>' +
        '<rect x="156" y="44" width="34" height="34" rx="4" fill="var(--viz-sorted)" stroke="var(--border-strong)"/><text x="173" y="66" fill="var(--accent-text)">B</text>' +
        '<rect x="190" y="44" width="34" height="34" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="207" y="66" fill="var(--text)">D</text>' +
        '<rect x="224" y="44" width="34" height="34" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="241" y="66" fill="var(--text)">A</text>' +
        '<rect x="258" y="44" width="34" height="34" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="275" y="66" fill="var(--text)">B</text>' +
        '</g>' +
        // pattern
        '<text x="88" y="112" font-size="13" fill="var(--text-soft)">패턴 (길이 m) — 텍스트 안의 이 부분과 일치</text>' +
        '<g font-size="15" text-anchor="middle">' +
        '<rect x="88"  y="120" width="34" height="34" rx="4" fill="var(--accent)" stroke="var(--border-strong)"/><text x="105" y="142" fill="var(--accent-text)">C</text>' +
        '<rect x="122" y="120" width="34" height="34" rx="4" fill="var(--accent)" stroke="var(--border-strong)"/><text x="139" y="142" fill="var(--accent-text)">A</text>' +
        '<rect x="156" y="120" width="34" height="34" rx="4" fill="var(--accent)" stroke="var(--border-strong)"/><text x="173" y="142" fill="var(--accent-text)">B</text>' +
        '</g>' +
        '<path d="M139 118 L139 80" stroke="var(--ok)" stroke-width="2" marker-end="url(#a07)"/>' +
        '<defs><marker id="a07" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--ok)"/></marker></defs>' +
        '</svg>',
      svgCaption:
        '텍스트(위) 안에서 패턴 "CAB"(아래)이 등장하는 위치를 찾는 것이 문자열 검색. 일치 구간이 초록으로 표시된다.',
    },

    {
      title: '브루트 포스법',
      tags: ['브루트 포스법'],
      gist:
        '모든 시작 위치에 패턴을 맞춰 <b>앞에서부터</b> 한 글자씩 비교, 불일치하면 <b>딱 한 칸</b> 밀어 처음부터 다시. 최악 <code>O(nm)</code>.',
      mnemonic:
        '"한 칸씩 미끄럼틀" — 안 맞으면 한 칸 오른쪽, 비교 정보는 미련 없이 버린다. 가장 단순 = 가장 느림.',
      svg:
        '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        // text row
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="40"  y="20" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="55"  y="40" fill="var(--text)">A</text>' +
        '<rect x="70"  y="20" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="85"  y="40" fill="var(--text)">B</text>' +
        '<rect x="100" y="20" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="115" y="40" fill="var(--text)">C</text>' +
        '<rect x="130" y="20" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="145" y="40" fill="var(--text)">A</text>' +
        '<rect x="160" y="20" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="175" y="40" fill="var(--text)">B</text>' +
        '<rect x="190" y="20" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="205" y="40" fill="var(--text)">C</text>' +
        '</g>' +
        '<text x="245" y="40" font-size="12" fill="var(--text-faint)">텍스트</text>' +
        // attempt 1: pattern AB at pos0 -> A=A ok, B=B ok? text "AB.." pattern "AC" mismatch at 2nd
        '<text x="0" y="86" font-size="11" fill="var(--text-soft)">1회</text>' +
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="40"  y="72" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="55"  y="92" fill="var(--accent-text)">A</text>' +
        '<rect x="70"  y="72" width="30" height="30" rx="4" fill="var(--danger)" stroke="var(--border-strong)"/><text x="85"  y="92" fill="var(--accent-text)">C</text>' +
        '</g>' +
        '<text x="118" y="92" font-size="11" fill="var(--danger)">불일치 → 한 칸 →</text>' +
        // attempt 2: shift one
        '<text x="0" y="132" font-size="11" fill="var(--text-soft)">2회</text>' +
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="70"  y="118" width="30" height="30" rx="4" fill="var(--danger)" stroke="var(--border-strong)"/><text x="85"  y="138" fill="var(--accent-text)">A</text>' +
        '<rect x="100" y="118" width="30" height="30" rx="4" fill="var(--text-faint)" stroke="var(--border-strong)"/><text x="115" y="138" fill="var(--accent-text)">C</text>' +
        '</g>' +
        '<text x="148" y="138" font-size="11" fill="var(--danger)">불일치 → 한 칸 →</text>' +
        // attempt 3: match
        '<text x="0" y="178" font-size="11" fill="var(--text-soft)">3회</text>' +
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="100" y="164" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="115" y="184" fill="var(--accent-text)">C</text>' +
        '<rect x="130" y="164" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="145" y="184" fill="var(--accent-text)">A</text>' +
        '<rect x="160" y="164" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="175" y="184" fill="var(--accent-text)">B</text>' +
        '</g>' +
        '<text x="208" y="184" font-size="11" fill="var(--ok)">일치 (CAB)</text>' +
        '</svg>',
      svgCaption:
        '패턴이 안 맞으면 오른쪽으로 한 칸씩 미끄러지며 매번 처음부터 다시 비교한다. 초록=일치, 빨강=불일치.',
    },

    {
      title: 'KMP법',
      tags: ['KMP법', 'skip table'],
      gist:
        '패턴 내부의 <b>접두사·접미사 겹침</b>을 미리 계산한 <code>skip table</code>로, 불일치해도 이미 맞은 만큼은 건너뛴다. 텍스트 포인터는 뒤로 안 가 <code>O(n+m)</code>.',
      mnemonic:
        '"안 맞아도 처음부터 안 한다" — skip table 보고 점프. KMP·skip table·O(n+m)은 한 세트로 외운다.',
      svg:
        '<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        // text row
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="40"  y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="55"  y="44" fill="var(--text)">A</text>' +
        '<rect x="70"  y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="85"  y="44" fill="var(--text)">B</text>' +
        '<rect x="100" y="24" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="115" y="44" fill="var(--accent-text)">A</text>' +
        '<rect x="130" y="24" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="145" y="44" fill="var(--accent-text)">B</text>' +
        '<rect x="160" y="24" width="30" height="30" rx="4" fill="var(--danger)" stroke="var(--border-strong)"/><text x="175" y="44" fill="var(--accent-text)">X</text>' +
        '<rect x="190" y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="205" y="44" fill="var(--text)">C</text>' +
        '</g>' +
        '<text x="245" y="44" font-size="12" fill="var(--text-faint)">텍스트</text>' +
        // pattern attempt 1: matched AB, fail at X
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="100" y="70" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="115" y="90" fill="var(--accent-text)">A</text>' +
        '<rect x="130" y="70" width="30" height="30" rx="4" fill="var(--ok)" stroke="var(--border-strong)"/><text x="145" y="90" fill="var(--accent-text)">B</text>' +
        '<rect x="160" y="70" width="30" height="30" rx="4" fill="var(--danger)" stroke="var(--border-strong)"/><text x="175" y="90" fill="var(--accent-text)">Y</text>' +
        '<rect x="190" y="70" width="30" height="30" rx="4" fill="var(--accent)" stroke="var(--border-strong)"/><text x="205" y="90" fill="var(--accent-text)">Z</text>' +
        '</g>' +
        '<text x="238" y="90" font-size="11" fill="var(--danger)">불일치!</text>' +
        // skip jump label
        '<text x="240" y="128" font-size="12" fill="var(--accent)">skip table 참조 → 텍스트 포인터는</text>' +
        '<text x="240" y="146" font-size="12" fill="var(--accent)">뒤로 안 가고 패턴만 점프</text>' +
        '<path d="M175 102 C 175 120, 240 120, 280 118" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#k07)"/>' +
        '<defs><marker id="k07" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--accent)"/></marker></defs>' +
        // skip table mini
        '<text x="40" y="146" font-size="11" fill="var(--text-soft)">skip table (실패 함수)</text>' +
        '<g font-size="12" text-anchor="middle">' +
        '<rect x="40"  y="156" width="34" height="26" rx="3" fill="var(--bg-elev)" stroke="var(--border-strong)"/><text x="57"  y="173" fill="var(--text-soft)">A</text>' +
        '<rect x="74"  y="156" width="34" height="26" rx="3" fill="var(--bg-elev)" stroke="var(--border-strong)"/><text x="91"  y="173" fill="var(--text-soft)">B</text>' +
        '<rect x="108" y="156" width="34" height="26" rx="3" fill="var(--bg-elev)" stroke="var(--border-strong)"/><text x="125" y="173" fill="var(--text-soft)">Y</text>' +
        '<rect x="40"  y="182" width="34" height="14" rx="3" fill="var(--viz-pivot)" stroke="var(--border-strong)"/><text x="57"  y="193" fill="var(--accent-text)">0</text>' +
        '<rect x="74"  y="182" width="34" height="14" rx="3" fill="var(--viz-pivot)" stroke="var(--border-strong)"/><text x="91"  y="193" fill="var(--accent-text)">0</text>' +
        '<rect x="108" y="182" width="34" height="14" rx="3" fill="var(--viz-pivot)" stroke="var(--border-strong)"/><text x="125" y="193" fill="var(--accent-text)">1</text>' +
        '</g>' +
        '</svg>',
      svgCaption:
        'AB까지 맞고 Y에서 불일치. KMP는 미리 만든 skip table을 보고 패턴만 건너뛰며, 텍스트 포인터는 뒤로 돌아가지 않는다.',
    },

    {
      title: '보이어-무어법',
      tags: ['보이어-무어법'],
      gist:
        '패턴을 <b>뒤(끝 문자)부터</b> 비교한다. 불일치 문자가 패턴에 <b>아예 없으면 패턴 길이만큼 한 번에 점프</b> → 실제 검색에서 가장 빠른 편.',
      mnemonic:
        '"뒤에서 거꾸로, 없는 글자면 통째로 건너뛴다" — 보이어-무어 = 뒤·점프·실전 최강. 단, 최악은 여전히 O(nm).',
      svg:
        '<svg viewBox="0 0 480 190" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">' +
        // text row
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="40"  y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="55"  y="44" fill="var(--text)">X</text>' +
        '<rect x="70"  y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="85"  y="44" fill="var(--text)">Y</text>' +
        '<rect x="100" y="24" width="30" height="30" rx="4" fill="var(--danger)" stroke="var(--border-strong)"/><text x="115" y="44" fill="var(--accent-text)">Q</text>' +
        '<rect x="130" y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="145" y="44" fill="var(--text)">A</text>' +
        '<rect x="160" y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="175" y="44" fill="var(--text)">B</text>' +
        '<rect x="190" y="24" width="30" height="30" rx="4" fill="var(--viz-bar)" stroke="var(--border-strong)"/><text x="205" y="44" fill="var(--text)">C</text>' +
        '</g>' +
        '<text x="245" y="44" font-size="12" fill="var(--text-faint)">텍스트</text>' +
        // pattern aligned at 0..2, compare from the END (rightmost) -> hits Q (not in pattern)
        '<g font-size="14" text-anchor="middle">' +
        '<rect x="40"  y="76" width="30" height="30" rx="4" fill="var(--accent)" stroke="var(--border-strong)"/><text x="55"  y="96" fill="var(--accent-text)">A</text>' +
        '<rect x="70"  y="76" width="30" height="30" rx="4" fill="var(--accent)" stroke="var(--border-strong)"/><text x="85"  y="96" fill="var(--accent-text)">B</text>' +
        '<rect x="100" y="76" width="30" height="30" rx="4" fill="var(--danger)" stroke="var(--border-strong)"/><text x="115" y="96" fill="var(--accent-text)">C</text>' +
        '</g>' +
        // start-here marker at end char
        '<text x="115" y="124" font-size="11" text-anchor="middle" fill="var(--warn)">여기부터 비교</text>' +
        '<path d="M115 118 L115 108" stroke="var(--warn)" stroke-width="2" marker-end="url(#bm07a)"/>' +
        '<text x="200" y="96" font-size="11" fill="var(--danger)">텍스트 Q는 패턴에 없음</text>' +
        // big jump arrow
        '<text x="40" y="152" font-size="12" fill="var(--ok)">→ 패턴 길이만큼 한 번에 점프</text>' +
        '<path d="M55 162 C 110 178, 180 178, 220 164" fill="none" stroke="var(--ok)" stroke-width="2.5" marker-end="url(#bm07b)"/>' +
        '<defs>' +
        '<marker id="bm07a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--warn)"/></marker>' +
        '<marker id="bm07b" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="var(--ok)"/></marker>' +
        '</defs>' +
        '</svg>',
      svgCaption:
        '패턴 끝 문자(C)부터 비교를 시작한다. 부딪힌 텍스트 문자(Q)가 패턴에 없으면 패턴 길이만큼 한 번에 건너뛴다.',
    },
  ],
}
