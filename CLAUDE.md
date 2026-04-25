# Card Game プロジェクトルール

## 命名規則

- **変数・引数・パラメータの省略禁止**: `s`, `m`, `v`, `e`, `p`, `b`, `a` などの1〜2文字の省略形を使わない
  - ❌ `const s = addLog(s, ...)` → ✅ `const state = addLog(state, ...)`
  - ❌ `function foo(e: Enemy)` → ✅ `function foo(enemy: Enemy)`
  - ❌ `.map((e, i) => ...)` → ✅ `.map((enemyState, index) => ...)`
  - 例外: ループカウンタの `i`, `j` は許容する
