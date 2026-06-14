// Ch07 문자열 검색 — 세부 학습 페이지 (브루트 포스 / KMP / 보이어-무어)
// 형식: { slug, title, summary, conceptTags, blocks }

export const subtopics = [
  // ─────────────────────────────────────────────────────────────
  // 1) 브루트 포스법
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'brute',
    title: '브루트 포스법',
    summary:
      '브루트 포스법(brute force, 단순법 또는 직접법)은 텍스트의 가능한 모든 시작 위치에 패턴을 ' +
      '맞춰 놓고 앞에서부터 한 글자씩 차례로 비교하는 가장 단순한 문자열 검색 알고리즘이다. ' +
      '불일치가 발생하면 패턴을 오른쪽으로 딱 한 칸만 옮겨 처음부터 다시 비교한다. 이미 일치했던 ' +
      '비교 정보를 전혀 활용하지 않고 버리기 때문에 같은 문자를 여러 번 다시 비교할 수 있고, ' +
      '그래서 최악의 경우 O(nm)의 시간이 걸린다.',
    conceptTags: ['브루트 포스법'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어' },
      {
        type: 'p',
        html:
          '텍스트의 길이를 <code>n</code>, 패턴의 길이를 <code>m</code>이라 하자. 브루트 포스법은 ' +
          '패턴이 시작될 수 있는 모든 위치 <code>i = 0, 1, 2, …, n-m</code>에 대해 패턴을 그 자리에 ' +
          '겹쳐 놓고, 패턴의 첫 글자부터 끝 글자까지 텍스트와 한 글자씩 대조한다. 모두 일치하면 ' +
          '패턴을 찾은 것이고, 도중에 한 글자라도 어긋나면 그 위치는 포기하고 패턴을 <b>오른쪽으로 ' +
          '한 칸</b> 밀어 다음 시작 위치에서 다시 처음부터 비교를 시작한다.',
      },
      {
        type: 'p',
        html:
          '이 방법의 가장 큰 특징은 <b>비교 정보를 버린다</b>는 점이다. 예를 들어 패턴의 앞 5글자가 ' +
          '일치하고 6번째에서 불일치가 났더라도, 그렇게 얻은 "앞 5글자가 어떻게 생겼는지"에 대한 ' +
          '정보를 전혀 활용하지 않고 단순히 한 칸만 이동한 뒤 다시 패턴의 첫 글자부터 비교한다. ' +
          '이 때문에 텍스트 포인터가 뒤로 되돌아가는(backtracking) 비효율이 발생한다.',
      },
      { type: 'h3', text: '동작 과정' },
      {
        type: 'list',
        items: [
          '<b>1. 정렬 맞추기</b> — 텍스트 포인터 <code>i</code>와 패턴 포인터 <code>j</code>를 둔다. 현재 비교 시작 위치에서 패턴의 첫 글자(<code>j=0</code>)를 텍스트의 <code>i</code>번째 글자에 맞춘다.',
          '<b>2. 앞에서부터 비교</b> — <code>text[i+j]</code>와 <code>pattern[j]</code>를 비교한다. 일치하면 <code>j</code>를 1 늘려 다음 글자를 본다.',
          '<b>3-a. 전부 일치</b> — <code>j</code>가 패턴 길이 <code>m</code>에 도달하면 시작 위치 <code>i</code>에서 패턴을 찾은 것이다.',
          '<b>3-b. 불일치 발생</b> — 도중에 어긋나면 그 위치를 포기한다. 시작 위치를 <code>i+1</code>로 한 칸 옮기고 <code>j</code>를 0으로 되돌려 처음부터 다시 비교한다.',
          '<b>4. 반복</b> — 시작 위치 <code>i</code>가 <code>n-m</code>을 넘어가면 더 맞춰 볼 곳이 없으므로 검색을 끝낸다.',
        ],
      },
      {
        type: 'p',
        html:
          '예를 들어 텍스트 <code>"ABABCABABA"</code>에서 패턴 <code>"ABABA"</code>를 찾는다고 하자. ' +
          '위치 0에서 <code>ABAB</code>까지 일치하다가 다섯 번째 글자 <code>C</code>≠<code>A</code>에서 ' +
          '어긋난다. 브루트 포스법은 여기서 얻은 "<code>ABAB</code>가 일치했다"는 정보를 버리고 ' +
          '패턴을 한 칸만 옮겨 위치 1부터 다시 첫 글자 비교를 시작한다.',
      },
      { type: 'h3', text: '참조 구현 (파이썬)' },
      {
        type: 'code',
        code:
          'def brute_force_search(text, pattern):\n' +
          '    """텍스트에서 패턴이 처음 나타나는 시작 인덱스를 반환. 없으면 -1."""\n' +
          '    n = len(text)\n' +
          '    m = len(pattern)\n' +
          '\n' +
          '    # 패턴이 시작될 수 있는 모든 위치 i를 시도\n' +
          '    for i in range(n - m + 1):\n' +
          '        j = 0\n' +
          '        # 패턴을 앞에서부터 한 글자씩 대조\n' +
          '        while j < m and text[i + j] == pattern[j]:\n' +
          '            j += 1\n' +
          '        if j == m:          # 끝까지 모두 일치하면 발견\n' +
          '            return i\n' +
          '        # 불일치: 시작 위치를 한 칸만 오른쪽으로 이동 (for문이 i를 i+1로)\n' +
          '    return -1               # 끝까지 못 찾음\n' +
          '\n' +
          '\n' +
          'if __name__ == "__main__":\n' +
          '    print(brute_force_search("ABABCABABA", "ABABA"))  # 5\n' +
          '    print(brute_force_search("HELLO WORLD", "WORLD"))  # 6\n' +
          '    print(brute_force_search("AAAAAB", "AAAB"))        # 2\n',
        caption:
          '브루트 포스 문자열 검색 — 모든 시작 위치에 패턴을 맞춰 앞에서부터 비교하고, 불일치 시 한 칸 이동한다.',
      },
      { type: 'h3', text: '시간복잡도와 특성' },
      {
        type: 'table',
        headers: ['항목', '값', '설명'],
        rows: [
          ['최선 시간복잡도', 'O(n)', '매 시작 위치에서 첫 글자부터 어긋나면 위치마다 비교 1회씩.'],
          ['평균 시간복잡도', 'O(n)에 가까움', '일반적인 텍스트에서는 보통 몇 글자 안에 불일치가 난다.'],
          ['최악 시간복잡도', 'O(nm)', '예: 텍스트 "AAAA…A", 패턴 "AAA…B"처럼 끝에서만 어긋나는 경우.'],
          ['추가 공간', 'O(1)', '전처리 표가 없어 부가 메모리를 거의 쓰지 않는다.'],
          ['전처리', '없음', 'KMP의 skip table 같은 사전 계산 단계가 없다.'],
          ['비교 정보 재사용', '안 함', '일치했던 부분 정보를 버리고 한 칸씩만 이동한다.'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '<b>장점</b> — 구현이 매우 단순하고 직관적이며, 전처리가 없어 짧은 텍스트나 일회성 검색에 ' +
          '충분하다. 실제로 평균적인 입력에서는 O(n)에 가깝게 빠르게 동작하는 경우가 많다.',
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '<b>함정</b> — 패턴과 텍스트가 비슷한 문자를 많이 공유할 때(예: <code>"AAAAAB"</code> 안에서 ' +
          '<code>"AAAB"</code> 찾기) 같은 위치를 반복해서 다시 비교하므로 최악 <code>O(nm)</code>로 ' +
          '느려진다. 이 "비교 정보를 버린다"는 약점을 보완한 것이 바로 KMP법이다.',
      },
      {
        type: 'viz',
        component: 'StringSearchVisualizer',
        props: { algo: 'brute', lock: true },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2) KMP법
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'kmp',
    title: 'KMP법',
    summary:
      'KMP법(Knuth–Morris–Pratt)은 불일치가 났을 때 패턴 내부의 "접두사이면서 동시에 접미사인 부분"의 ' +
      '길이를 미리 계산해 둔 skip table(LPS, 실패 함수)을 이용해, 이미 일치했던 만큼은 다시 비교하지 ' +
      '않고 패턴만 적절히 건너뛴다. 핵심은 텍스트 포인터가 절대 뒤로 후퇴하지 않는다는 점이며, ' +
      '덕분에 전처리 O(m)와 검색 O(n)을 합쳐 전체 O(n+m)의 선형 시간에 검색을 끝낸다.',
    conceptTags: ['KMP법', 'skip table'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어' },
      {
        type: 'p',
        html:
          '브루트 포스법의 약점은 불일치가 났을 때 이미 일치시켰던 정보를 버리고 한 칸만 이동한다는 ' +
          '것이었다. KMP법은 이 정보를 활용한다. 패턴의 앞부분 일부가 텍스트와 일치한 상태에서 ' +
          '불일치가 났다면, "이미 일치한 그 부분"의 내부 구조를 이용해 패턴을 한 번에 여러 칸 밀 수 ' +
          '있다. 이때 핵심 도구가 <b>접두사이면서 동시에 접미사인 가장 긴 부분(LPS, Longest Proper ' +
          'Prefix which is also Suffix)</b>의 길이를 패턴 위치마다 미리 적어 둔 <code>skip table</code>이다.',
      },
      {
        type: 'p',
        html:
          '직관적으로, 패턴의 어떤 접두사가 그 자신의 접미사와 겹친다면, 불일치가 났을 때 패턴을 그 ' +
          '겹치는 길이만큼만 남기고 앞으로 끌어당겨 다시 맞춰도 된다. 그래서 <b>이미 일치한 만큼을 ' +
          '건너뛰되, 텍스트 포인터는 뒤로 되돌리지 않는다</b>. 이것이 KMP가 선형 시간을 보장하는 비결이다.',
      },
      { type: 'h3', text: 'skip table(LPS, 실패 함수)이란' },
      {
        type: 'p',
        html:
          '<code>lps[k]</code>는 "패턴의 처음부터 <code>k</code>번째 글자까지(<code>pattern[0..k]</code>) ' +
          '중에서, 자기 자신 전체가 아닌 진부분 가운데 접두사이면서 동시에 접미사인 가장 긴 문자열의 ' +
          '길이"를 뜻한다. 불일치가 패턴 위치 <code>j</code>에서 났을 때 다음 비교는 패턴의 ' +
          '<code>lps[j-1]</code> 위치부터 이어 간다 — 즉 앞의 <code>lps[j-1]</code> 글자는 이미 ' +
          '맞았다고 보고 건너뛰는 것이다.',
      },
      {
        type: 'table',
        headers: ['index', '0', '1', '2', '3', '4', '5', '6'],
        rows: [
          ['pattern', 'A', 'B', 'A', 'B', 'A', 'C', 'A'],
          ['lps', '0', '0', '1', '2', '3', '0', '1'],
        ],
      },
      {
        type: 'p',
        html:
          '위 표에서 <code>lps[4]=3</code>은 <code>"ABABA"</code>의 접두사 <code>"ABA"</code>와 접미사 ' +
          '<code>"ABA"</code>가 길이 3으로 겹침을 뜻한다. 따라서 패턴 위치 5에서 불일치가 나면 ' +
          '텍스트 포인터는 그대로 두고 패턴 포인터만 <code>lps[4]=3</code>으로 되돌려, 앞의 ' +
          '<code>"ABA"</code>는 다시 비교하지 않고 곧장 이어서 검사한다.',
      },
      { type: 'h3', text: '동작 과정' },
      {
        type: 'list',
        items: [
          '<b>1. 전처리</b> — 패턴만 보고 <code>lps</code> 배열(skip table)을 O(m)에 만든다.',
          '<b>2. 검색 시작</b> — 텍스트 포인터 <code>i</code>와 패턴 포인터 <code>j</code>를 0에서 시작한다.',
          '<b>3. 일치</b> — <code>text[i] == pattern[j]</code>이면 <code>i</code>와 <code>j</code>를 함께 1씩 늘린다.',
          '<b>4. 패턴 완성</b> — <code>j == m</code>이 되면 시작 위치 <code>i-m</code>에서 패턴을 찾은 것이다. (계속 찾으려면 <code>j = lps[j-1]</code>로 이어 간다.)',
          '<b>5. 불일치</b> — 어긋났을 때 <code>j&gt;0</code>이면 텍스트 포인터 <code>i</code>는 그대로 두고 <code>j = lps[j-1]</code>로 점프한다. <code>j==0</code>이면 <code>i</code>만 1 늘린다.',
          '<b>6. 비후퇴</b> — 어떤 경우에도 <code>i</code>(텍스트 포인터)는 결코 감소하지 않는다. 이 점이 O(n+m)을 보장한다.',
        ],
      },
      { type: 'h3', text: '참조 구현 (파이썬)' },
      {
        type: 'code',
        code:
          'def build_lps(pattern):\n' +
          '    """skip table(LPS) 생성: lps[k] = pattern[0..k]의 접두사=접미사 최대 길이."""\n' +
          '    m = len(pattern)\n' +
          '    lps = [0] * m\n' +
          '    length = 0          # 직전까지의 접두사=접미사 길이\n' +
          '    i = 1\n' +
          '    while i < m:\n' +
          '        if pattern[i] == pattern[length]:\n' +
          '            length += 1\n' +
          '            lps[i] = length\n' +
          '            i += 1\n' +
          '        elif length > 0:\n' +
          '            length = lps[length - 1]   # 더 짧은 경계로 후퇴 (i는 그대로)\n' +
          '        else:\n' +
          '            lps[i] = 0\n' +
          '            i += 1\n' +
          '    return lps\n' +
          '\n' +
          '\n' +
          'def kmp_search(text, pattern):\n' +
          '    """텍스트에서 패턴이 처음 나타나는 시작 인덱스를 반환. 없으면 -1."""\n' +
          '    n, m = len(text), len(pattern)\n' +
          '    if m == 0:\n' +
          '        return 0\n' +
          '    lps = build_lps(pattern)\n' +
          '\n' +
          '    i = j = 0           # i: 텍스트 포인터(비후퇴), j: 패턴 포인터\n' +
          '    while i < n:\n' +
          '        if text[i] == pattern[j]:\n' +
          '            i += 1\n' +
          '            j += 1\n' +
          '            if j == m:                 # 패턴 전부 일치\n' +
          '                return i - m\n' +
          '        elif j > 0:\n' +
          '            j = lps[j - 1]             # 일치한 만큼 건너뜀 (i는 후퇴 안 함)\n' +
          '        else:\n' +
          '            i += 1                     # 첫 글자부터 불일치\n' +
          '    return -1\n' +
          '\n' +
          '\n' +
          'if __name__ == "__main__":\n' +
          '    print(build_lps("ABABACA"))            # [0, 0, 1, 2, 3, 0, 1]\n' +
          '    print(kmp_search("ABABDABACDABABCABAB", "ABABCABAB"))  # 10\n' +
          '    print(kmp_search("AAAAAB", "AAAB"))     # 2\n',
        caption: 'KMP법 — skip table(LPS)을 먼저 만든 뒤, 텍스트 포인터를 후퇴시키지 않고 O(n+m)에 검색한다.',
      },
      { type: 'h3', text: '시간복잡도와 특성' },
      {
        type: 'table',
        headers: ['항목', '값', '설명'],
        rows: [
          ['전처리(skip table)', 'O(m)', 'lps 배열을 패턴 길이만큼 한 번 훑어 만든다.'],
          ['검색', 'O(n)', '텍스트 포인터 i가 후퇴하지 않아 텍스트를 사실상 한 번만 훑는다.'],
          ['전체 시간복잡도', 'O(n + m)', '최악에도 선형 시간을 보장한다.'],
          ['추가 공간', 'O(m)', 'skip table(lps 배열)을 위한 패턴 길이만큼의 공간.'],
          ['텍스트 포인터', '비후퇴', '불일치 시에도 i는 줄지 않는다 — 스트리밍 입력에도 적합.'],
          ['비교 정보 재사용', '함', '이미 일치한 접두사 정보를 lps로 재활용한다.'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '<b>장점</b> — 최악에도 <code>O(n+m)</code> 선형 시간을 보장하고, 텍스트 포인터가 뒤로 가지 ' +
          '않아 한 번 흘러가는 입력 스트림에서도 쓸 수 있다. 패턴 안에 반복 구조가 많을수록(예: ' +
          '<code>"AAAB"</code>, <code>"ABABAB"</code>) 브루트 포스 대비 이득이 크다.',
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '<b>함정</b> — <code>lps[j-1]</code>의 인덱스 처리를 헷갈리기 쉽다. 불일치 시 점프 대상은 ' +
          '<code>lps[j]</code>가 아니라 <code>lps[j-1]</code>(직전까지 일치한 길이 기준)이다. 또한 ' +
          'skip table 생성 시 <code>length = lps[length-1]</code>로 후퇴할 때 포인터 <code>i</code>는 ' +
          '증가시키지 않아야 한다. 이 두 곳이 가장 흔한 구현 버그다.',
      },
      {
        type: 'viz',
        component: 'StringSearchVisualizer',
        props: { algo: 'kmp', lock: true },
      },
      {
        type: 'viz',
        component: 'BFvsKMPViz',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3) 보이어-무어법
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'boyer',
    title: '보이어-무어법',
    summary:
      '보이어-무어법(Boyer–Moore)은 패턴을 텍스트에 맞춰 놓되, 비교를 패턴의 맨 끝 글자에서부터 ' +
      '앞쪽으로 거꾸로 진행한다. 불일치가 나면 "나쁜 문자(bad character) 규칙"으로 텍스트의 어긋난 ' +
      '문자가 패턴에 등장하는 위치를 보고 한 번에 큰 폭으로 패턴을 점프시킨다. 어긋난 문자가 패턴에 ' +
      '아예 없으면 패턴 길이만큼 통째로 건너뛸 수 있어, 평균적으로 텍스트의 많은 글자를 아예 보지 ' +
      '않고 지나가므로 실전에서 매우 빠르다.',
    conceptTags: ['보이어-무어법'],
    blocks: [
      { type: 'h3', text: '핵심 아이디어' },
      {
        type: 'p',
        html:
          '보이어-무어법의 두 가지 독특함은 <b>(1) 비교를 패턴의 끝에서부터 거꾸로 한다</b>는 것과, ' +
          '<b>(2) 불일치 시 한 칸이 아니라 여러 칸을 건너뛴다</b>는 것이다. 패턴을 텍스트 위치 ' +
          '<code>i</code>에 정렬했다면, 패턴의 마지막 글자 <code>pattern[m-1]</code>를 텍스트의 ' +
          '<code>text[i+m-1]</code>과 먼저 비교하고, 일치하면 그 앞 글자로 한 칸씩 거슬러 올라간다.',
      },
      {
        type: 'p',
        html:
          '거꾸로 비교하기 때문에, 어긋나는 순간 텍스트 쪽의 그 문자(나쁜 문자)가 무엇인지 바로 알 수 ' +
          '있다. 이 문자가 패턴 안에 어디 있는지(또는 없는지)를 미리 만들어 둔 <b>나쁜 문자 표(bad ' +
          'character table)</b>에서 찾아, 그 문자가 패턴의 해당 위치에 오도록 패턴을 한 번에 끌어당긴다.',
      },
      { type: 'h3', text: '나쁜 문자(bad character) 규칙' },
      {
        type: 'p',
        html:
          '텍스트의 어긋난 문자를 <code>c</code>, 그 불일치가 패턴 위치 <code>j</code>에서 났다고 하자. ' +
          '나쁜 문자 규칙은 패턴 안에서 <code>c</code>가 마지막으로 등장하는 위치 <code>last[c]</code>를 ' +
          '본다.',
      },
      {
        type: 'list',
        items: [
          '<b>c가 패턴에 있고 j 왼쪽에 등장</b> — 그 등장 위치가 <code>c</code>와 맞도록 패턴을 오른쪽으로 <code>j - last[c]</code>칸 민다.',
          '<b>c가 패턴에 아예 없음</b> — <code>c</code>를 포함하는 정렬은 절대 일치할 수 없으므로, 패턴 전체를 <code>c</code> 뒤로 보낸다. 즉 패턴 길이만큼 크게 점프한다.',
          '<b>이동량 보정</b> — 계산한 이동량이 음수나 0이 되면(나쁜 문자가 j 오른쪽에만 있는 경우) 최소 한 칸은 이동하도록 보정한다.',
        ],
      },
      {
        type: 'p',
        html:
          '나쁜 문자 표는 패턴을 한 번 훑어 각 문자가 패턴에서 <b>마지막으로 나타난 인덱스</b>를 ' +
          '기록해 만든다(없는 문자는 -1로 본다). 알파벳 크기를 <code>σ</code>라 하면 표 생성은 ' +
          '<code>O(m + σ)</code>이다. 참고로 완전한 보이어-무어법은 여기에 "착한 접미사(good suffix) ' +
          '규칙"을 더해 둘 중 더 큰 이동량을 택하지만, 핵심 직관은 나쁜 문자 규칙에 있다.',
      },
      { type: 'h3', text: '동작 과정' },
      {
        type: 'list',
        items: [
          '<b>1. 전처리</b> — 패턴으로 나쁜 문자 표 <code>last[c]</code>를 만든다.',
          '<b>2. 정렬</b> — 패턴을 텍스트 시작 위치 <code>i</code>에 맞춘다.',
          '<b>3. 끝에서부터 비교</b> — <code>j = m-1</code>부터 줄여 가며 <code>text[i+j]</code>와 <code>pattern[j]</code>를 비교한다.',
          '<b>4-a. 전부 일치</b> — <code>j</code>가 0 아래로 내려가면 위치 <code>i</code>에서 패턴을 찾은 것이다.',
          '<b>4-b. 불일치</b> — 어긋난 텍스트 문자 <code>c = text[i+j]</code>를 보고 나쁜 문자 규칙으로 이동량을 계산해 <code>i</code>를 그만큼 늘린다.',
          '<b>5. 반복</b> — <code>i</code>가 <code>n-m</code>을 넘으면 검색을 끝낸다.',
        ],
      },
      { type: 'h3', text: '참조 구현 — 의사코드 (나쁜 문자 규칙)' },
      {
        type: 'code',
        code:
          'def build_bad_char(pattern):\n' +
          '    """나쁜 문자 표: last[c] = 패턴에서 문자 c가 마지막으로 등장한 인덱스 (없으면 -1)."""\n' +
          '    last = {}\n' +
          '    for j, ch in enumerate(pattern):\n' +
          '        last[ch] = j            # 같은 문자는 더 오른쪽 인덱스로 덮어써짐\n' +
          '    return last\n' +
          '\n' +
          '\n' +
          'def boyer_moore_search(text, pattern):\n' +
          '    """나쁜 문자 규칙만 사용한 보이어-무어 검색. 처음 발견 인덱스 반환, 없으면 -1."""\n' +
          '    n, m = len(text), len(pattern)\n' +
          '    if m == 0:\n' +
          '        return 0\n' +
          '    last = build_bad_char(pattern)\n' +
          '\n' +
          '    i = 0                       # 패턴을 맞춘 텍스트 시작 위치\n' +
          '    while i <= n - m:\n' +
          '        j = m - 1               # 패턴의 끝에서부터 거꾸로 비교\n' +
          '        while j >= 0 and text[i + j] == pattern[j]:\n' +
          '            j -= 1\n' +
          '        if j < 0:\n' +
          '            return i            # 전부 일치 — 발견\n' +
          '        # 나쁜 문자 c = text[i+j], 패턴 내 마지막 위치로 점프량 계산\n' +
          '        c = text[i + j]\n' +
          '        shift = j - last.get(c, -1)\n' +
          '        i += max(1, shift)      # 최소 한 칸은 전진(보정)\n' +
          '    return -1\n' +
          '\n' +
          '\n' +
          'if __name__ == "__main__":\n' +
          '    print(boyer_moore_search("HERE IS A SIMPLE EXAMPLE", "EXAMPLE"))  # 17\n' +
          '    print(boyer_moore_search("ABAAABCD", "ABC"))                      # 4\n',
        caption: '보이어-무어법(나쁜 문자 규칙) — 패턴 끝에서부터 비교하고, 불일치 시 나쁜 문자 표로 크게 점프한다.',
      },
      { type: 'h3', text: '시간복잡도와 특성' },
      {
        type: 'table',
        headers: ['항목', '값', '설명'],
        rows: [
          ['전처리(나쁜 문자 표)', 'O(m + σ)', 'σ는 알파벳 크기. 패턴을 한 번 훑어 마지막 등장 위치 기록.'],
          ['평균 시간복잡도', '매우 빠름(O(n/m)에 근접)', '문자를 건너뛰며 텍스트의 많은 글자를 보지 않고 지나간다.'],
          ['최악 시간복잡도', 'O(nm)', '나쁜 문자 규칙만 쓰면 최악 입력에서 느려질 수 있다.'],
          ['최악 보장', 'O(n) (Galil 규칙 등 보강 시)', '착한 접미사 규칙과 함께 쓰면 선형 보장 가능.'],
          ['추가 공간', 'O(σ) 또는 O(m+σ)', '나쁜 문자 표(및 착한 접미사 표) 저장.'],
          ['비교 방향', '뒤(끝)에서 앞으로', '다른 두 알고리즘과 반대로 패턴 끝부터 비교.'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        html:
          '<b>장점</b> — 패턴이 길고 알파벳이 클수록(자연어 텍스트 등) 한 번에 건너뛰는 폭이 커져 ' +
          '실전에서 가장 빠른 축에 든다. 텍스트 편집기의 찾기 기능 등 실제 검색 구현에 널리 쓰인다.',
      },
      {
        type: 'callout',
        tone: 'warn',
        html:
          '<b>함정</b> — 나쁜 문자 규칙만으로는 이동량이 0 이하가 될 수 있어(나쁜 문자가 패턴의 ' +
          '오른쪽에만 있는 경우) 반드시 <code>max(1, shift)</code>로 최소 한 칸 전진을 보정해야 한다. ' +
          '또 나쁜 문자 규칙만 쓰면 최악이 <code>O(nm)</code>이므로, 선형 최악 보장이 필요하면 ' +
          '착한 접미사 규칙을 함께 구현해야 한다.',
      },
      {
        type: 'viz',
        component: 'BoyerMooreViz',
      },
    ],
  },
]
