// 정렬 알고리즘별 단계(프레임) 생성기.
// 프레임: { arr, ids, comparing:[..idx], swapping:[..idx], sorted:[..idx], pivot, note }
// ids[i] = 위치 i에 있는 "원소의 고유 식별자". 교환/이동 시 ids도 함께 옮겨 원소가
// 위치를 슬라이드 이동하는 애니메이션을 가능하게 한다. (도수 정렬은 재구성이라 id=인덱스 고정)

const mk = (arr, ids, opts = {}) => ({
  arr: [...arr],
  ids: [...ids],
  comparing: [],
  swapping: [],
  sorted: [],
  pivot: null,
  note: '',
  ...opts,
})

const allIdx = (n) => Array.from({ length: n }, (_, i) => i)
const idOrder = (n) => Array.from({ length: n }, (_, i) => i)

function bubble(input) {
  const arr = [...input]
  const ids = idOrder(arr.length)
  const n = arr.length
  const f = [mk(arr, ids, { note: '버블 정렬 시작 — 인접한 두 원소를 비교합니다.' })]
  const done = []
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      f.push(mk(arr, ids, { comparing: [j, j + 1], sorted: [...done], note: `비교: arr[${j}]=${arr[j]} vs arr[${j + 1}]=${arr[j + 1]}` }))
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        ;[ids[j], ids[j + 1]] = [ids[j + 1], ids[j]]
        swapped = true
        f.push(mk(arr, ids, { swapping: [j, j + 1], sorted: [...done], note: `arr[${j}] > arr[${j + 1}] → 자리 교환` }))
      }
    }
    done.push(n - 1 - i)
    if (!swapped) break
  }
  f.push(mk(arr, ids, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

function selection(input) {
  const arr = [...input]
  const ids = idOrder(arr.length)
  const n = arr.length
  const f = [mk(arr, ids, { note: '선택 정렬 시작 — 남은 구간의 최솟값을 찾아 맨 앞으로 보냅니다.' })]
  const done = []
  for (let i = 0; i < n - 1; i++) {
    let min = i
    f.push(mk(arr, ids, { comparing: [i], pivot: min, sorted: [...done], note: `i=${i}: 최솟값 후보 = arr[${min}]=${arr[min]}` }))
    for (let j = i + 1; j < n; j++) {
      f.push(mk(arr, ids, { comparing: [j], pivot: min, sorted: [...done], note: `비교: arr[${j}]=${arr[j]} vs 최솟값 arr[${min}]=${arr[min]}` }))
      if (arr[j] < arr[min]) {
        min = j
        f.push(mk(arr, ids, { pivot: min, sorted: [...done], note: `새 최솟값 = arr[${min}]=${arr[min]}` }))
      }
    }
    if (min !== i) {
      ;[arr[i], arr[min]] = [arr[min], arr[i]]
      ;[ids[i], ids[min]] = [ids[min], ids[i]]
      f.push(mk(arr, ids, { swapping: [i, min], sorted: [...done], note: `arr[${i}] ↔ arr[${min}] 자리 교환` }))
    }
    done.push(i)
  }
  f.push(mk(arr, ids, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

function insertion(input) {
  const arr = [...input]
  const ids = idOrder(arr.length)
  const n = arr.length
  const f = [mk(arr, ids, { note: '삽입 정렬 시작 — 앞쪽 정렬된 구간에 새 원소를 끼워 넣습니다.' })]
  for (let i = 1; i < n; i++) {
    const key = arr[i]
    const keyId = ids[i]
    let j = i - 1
    f.push(mk(arr, ids, { comparing: [i], sorted: allIdx(i), note: `key = arr[${i}] = ${key} 선택` }))
    while (j >= 0 && arr[j] > key) {
      f.push(mk(arr, ids, { comparing: [j], sorted: allIdx(i), note: `arr[${j}]=${arr[j]} > key=${key} → 오른쪽으로 한 칸 이동` }))
      arr[j + 1] = arr[j]
      ids[j + 1] = ids[j]
      ids[j] = keyId // 떠 있는 key 원소의 id를 빈 슬롯에 둠 (id 중복 방지)
      j--
      f.push(mk(arr, ids, { swapping: [j + 1, j + 2], sorted: allIdx(i), note: `이동 후` }))
    }
    arr[j + 1] = key
    ids[j + 1] = keyId
    f.push(mk(arr, ids, { swapping: [j + 1], sorted: allIdx(i + 1), note: `key=${key} 를 위치 ${j + 1}에 삽입` }))
  }
  f.push(mk(arr, ids, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

function shell(input) {
  const arr = [...input]
  const ids = idOrder(arr.length)
  const n = arr.length
  const f = [mk(arr, ids, { note: '쉘 정렬 시작 — gap 간격으로 떨어진 원소들을 삽입 정렬합니다.' })]
  for (let gap = Math.floor(n / 2); gap >= 1; gap = Math.floor(gap / 2)) {
    f.push(mk(arr, ids, { note: `gap = ${gap}` }))
    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      const tempId = ids[i]
      let j = i
      f.push(mk(arr, ids, { comparing: [i], note: `temp = arr[${i}] = ${temp} (gap=${gap})` }))
      while (j >= gap && arr[j - gap] > temp) {
        f.push(mk(arr, ids, { comparing: [j - gap, j], note: `arr[${j - gap}]=${arr[j - gap]} > ${temp} → ${gap}칸 이동` }))
        arr[j] = arr[j - gap]
        ids[j] = ids[j - gap]
        ids[j - gap] = tempId // 떠 있는 temp 원소의 id를 빈 슬롯에 둠 (id 중복 방지)
        j -= gap
        f.push(mk(arr, ids, { swapping: [j, j + gap], note: '이동 후' }))
      }
      arr[j] = temp
      ids[j] = tempId
      f.push(mk(arr, ids, { swapping: [j], note: `temp=${temp} 를 위치 ${j}에 삽입` }))
    }
  }
  f.push(mk(arr, ids, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

function quick(input) {
  const arr = [...input]
  const ids = idOrder(arr.length)
  const n = arr.length
  const f = [mk(arr, ids, { note: '퀵 정렬 시작 — pivot 기준으로 작은 값/큰 값을 분할합니다.' })]
  const done = new Set()

  function partition(lo, hi) {
    const pivot = arr[hi]
    f.push(mk(arr, ids, { pivot: hi, sorted: [...done], note: `구간 [${lo}..${hi}] — pivot = arr[${hi}] = ${pivot}` }))
    let i = lo
    for (let j = lo; j < hi; j++) {
      f.push(mk(arr, ids, { comparing: [j], pivot: hi, sorted: [...done], note: `비교: arr[${j}]=${arr[j]} vs pivot=${pivot}` }))
      if (arr[j] < pivot) {
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          ;[ids[i], ids[j]] = [ids[j], ids[i]]
          f.push(mk(arr, ids, { swapping: [i, j], pivot: hi, sorted: [...done], note: `${arr[i]} < pivot → arr[${i}] ↔ arr[${j}]` }))
        }
        i++
      }
    }
    ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
    ;[ids[i], ids[hi]] = [ids[hi], ids[i]]
    f.push(mk(arr, ids, { swapping: [i, hi], sorted: [...done], note: `pivot을 제자리 ${i}로 이동` }))
    done.add(i)
    f.push(mk(arr, ids, { sorted: [...done], note: `위치 ${i} 확정 (${arr[i]})` }))
    return i
  }
  function qs(lo, hi) {
    if (lo > hi) return
    if (lo === hi) { done.add(lo); return }
    const p = partition(lo, hi)
    qs(lo, p - 1)
    qs(p + 1, hi)
  }
  qs(0, n - 1)
  f.push(mk(arr, ids, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

function merge(input) {
  const arr = [...input]
  const ids = idOrder(arr.length)
  const n = arr.length
  const f = [mk(arr, ids, { note: '병합 정렬 시작 — 반으로 나눈 뒤 정렬된 두 부분을 병합합니다.' })]

  function ms(lo, hi) {
    if (lo >= hi) return
    const mid = Math.floor((lo + hi) / 2)
    ms(lo, mid)
    ms(mid + 1, hi)
    const temp = []
    const tempIds = []
    let i = lo
    let j = mid + 1
    f.push(mk(arr, ids, { comparing: range(lo, hi), note: `병합: [${lo}..${mid}] + [${mid + 1}..${hi}]` }))
    while (i <= mid && j <= hi) {
      if (arr[i] <= arr[j]) { temp.push(arr[i]); tempIds.push(ids[i]); i++ }
      else { temp.push(arr[j]); tempIds.push(ids[j]); j++ }
    }
    while (i <= mid) { temp.push(arr[i]); tempIds.push(ids[i]); i++ }
    while (j <= hi) { temp.push(arr[j]); tempIds.push(ids[j]); j++ }
    // 전체 되쓰기 후 한 프레임만 push (중간 id 중복 방지 + 원소들이 병합 위치로 한 번에 슬라이드)
    for (let k = 0; k < temp.length; k++) {
      arr[lo + k] = temp[k]
      ids[lo + k] = tempIds[k]
    }
    f.push(mk(arr, ids, { swapping: range(lo, hi), note: `병합 결과: [${lo}..${hi}] = ${temp.join(', ')}` }))
  }
  function range(a, b) { return Array.from({ length: b - a + 1 }, (_, k) => a + k) }
  ms(0, n - 1)
  f.push(mk(arr, ids, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

function heap(input) {
  const arr = [...input]
  const ids = idOrder(arr.length)
  const n = arr.length
  const f = [mk(arr, ids, { note: '힙 정렬 시작 — 최대 힙을 만든 뒤 루트를 맨 뒤로 보냅니다.' })]

  function siftDown(start, end, note) {
    let root = start
    while (2 * root + 1 <= end) {
      let child = 2 * root + 1
      if (child + 1 <= end) {
        f.push(mk(arr, ids, { comparing: [child, child + 1], note: '두 자식 비교' }))
        if (arr[child] < arr[child + 1]) child++
      }
      f.push(mk(arr, ids, { comparing: [root, child], note: `부모 arr[${root}]=${arr[root]} vs 자식 arr[${child}]=${arr[child]}` }))
      if (arr[root] < arr[child]) {
        ;[arr[root], arr[child]] = [arr[child], arr[root]]
        ;[ids[root], ids[child]] = [ids[child], ids[root]]
        f.push(mk(arr, ids, { swapping: [root, child], note: `${note}: arr[${root}] ↔ arr[${child}]` }))
        root = child
      } else break
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n - 1, '힙 구성')
  f.push(mk(arr, ids, { note: '최대 힙 완성 — 이제 루트(최댓값)를 뒤로 보냅니다.' }))
  const done = []
  for (let end = n - 1; end > 0; end--) {
    ;[arr[0], arr[end]] = [arr[end], arr[0]]
    ;[ids[0], ids[end]] = [ids[end], ids[0]]
    f.push(mk(arr, ids, { swapping: [0, end], sorted: [...done, ...range(end, n - 1)], note: `루트(최댓값) → 위치 ${end} 확정` }))
    siftDown(0, end - 1, '재정렬')
  }
  function range(a, b) { return Array.from({ length: b - a + 1 }, (_, k) => a + k) }
  f.push(mk(arr, ids, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

function counting(input) {
  const arr = [...input]
  const n = arr.length
  const fixedIds = idOrder(n) // 도수 정렬은 재구성이라 위치 고정(높이 전환)
  const max = Math.max(...arr, 0)
  const f = [mk(arr, fixedIds, { note: `도수 정렬 시작 — 값의 범위 0..${max} 만큼 도수를 셉니다.` })]
  const count = new Array(max + 1).fill(0)
  for (let i = 0; i < n; i++) {
    count[arr[i]]++
    f.push(mk(arr, fixedIds, { comparing: [i], countArr: [...count], highlightCount: arr[i], note: `count[${arr[i]}] += 1` }))
  }
  f.push(mk(arr, fixedIds, { countArr: [...count], note: '도수 배열 완성 — 작은 값부터 차례로 다시 채웁니다.' }))
  const out = [...arr]
  let pos = 0
  for (let v = 0; v <= max; v++) {
    for (let c = 0; c < count[v]; c++) {
      out[pos] = v
      f.push(mk(out, fixedIds, { swapping: [pos], countArr: [...count], highlightCount: v, sorted: range(0, pos), note: `위치 ${pos} ← ${v}` }))
      pos++
    }
  }
  function range(a, b) { return b < a ? [] : Array.from({ length: b - a + 1 }, (_, k) => a + k) }
  f.push(mk(out, fixedIds, { sorted: allIdx(n), note: '정렬 완료 ✓' }))
  return f
}

export const SORTERS = {
  bubble: { label: '버블 정렬', fn: bubble },
  selection: { label: '선택 정렬', fn: selection },
  insertion: { label: '삽입 정렬', fn: insertion },
  shell: { label: '쉘 정렬', fn: shell },
  quick: { label: '퀵 정렬', fn: quick },
  merge: { label: '병합 정렬', fn: merge },
  heap: { label: '힙 정렬', fn: heap },
  counting: { label: '도수 정렬', fn: counting },
}
