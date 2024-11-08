# セクション6: Suspense - その2(本質編)

## 28. Suspenseはただローディングを表示させるためだけのものか。否！

### Suspenseを使うと

+ API実行時のローディング状態の記述がより宣言的にできる<br>
+ Suspenseを適切に分割することでUXの向上を狙える<br>

[Suspenseはただのローディングを表示させるためだけのものか?]はそれは否！である。<br>

* Suspenseの本質を理解するために必要な前提知識は以下の３つ

1. サーバーサイドレンダリング(SSR)<br>

2. ストリーミング Streaming(HTML)<br>

3. ハイドレーション(Hydration)<br>

## 29. CSR と SSR

+ CSR (Client Side Rendering : クライアント再度レンダリング) <br>

+ SSR (Server Side Rendering : サーバーサイドレンダリング) <br>

`*` CSR

1〜５を往復するようなイメージ<br>

1. URLをサーバーに問い合わせ<br>

2. 必要なJS/CSS/HTMLを返却<br>

3. データリクエスト<br>

4. データレスポンス<br>

5. 取得データを基にレンダリング<br>

まとめると : 画面が表示されてからデータのリクエスト->レスポンス->レンダリングを実行するのでその間ユーザーにはローディングアイコン等が表示される<br>

`*` SSR

1〜5を往復するようなイメージ

1. URLをサーバーに問い合わせ<br>

2. データリクエスト<br>

3. データレスポンス<br>

4. 取得データを基にHTMLを構築<br>

5 HTMLを返却<br>


まとめると : 真っ白な画面や遷移前の画面が表示され続ける(サーバー側でデータ取得やHTMLの構築を実行中)<br>
SSR対象のページを表示するには「データの取得」「HTMLの構築」がサーバー側で必要なのですべてが慣用するまで何も表示されない。<br>

### これまでのSSR

画面内にある全てのコンポーネントの「データ取得」「HTML構築」の完了を待つ必要があった<br>

=> この問題を解決してくるのが`Suspense`である。<br>

## 30. Streaming HTML

`*` SSRのメリット

+ サーバー側で各処理を実行するのでユーザーのマシンスペックに依存しない<br>

+ 最初に全てのJSを読み込む必要がなくなるので初回起動が速くなる<br>

+ 動的なOGPの設定等も可能になる<br>

`＊`SSRのデメリット

+ リクエスト毎にサーバー側で「データ取得」「HTMLの構築->返却」が行われるので画面遷移した際など、コンテンツの表示が遅くなる<br>

↓ (画面遷移)<br>

真っ白な表示や遷移前の画面が表示されたままだと、ユーザーに何が起きるのか全くわからない。<br>
興味ないコンテンツがあろうが全ての完成を待たなければいけない。<br>

理想はSSRであってもデータ取得中はフォールバックコンテンツを表示したい。<br>

同じ画面でもデータの取得が不要な箇所やデータ取得やレンダリングに時間がかかる箇所が存在する。<br>

任意の範囲毎にSSR出来たら最高<br>

これらを改善できたのが `Suspense`である。<br>

`＊` Suspenseと使うことによって

データ取得が必要ない要素はすぐにSSRでコンテンツを返却<br>

データ取得が必要な箇所はまずフォールバックコンテンツをSSRで返却<br>

`*` 下記がまさに`Streaming HTML`である<br>

データ取得とHTMLの構築が出来次第、Suspense単位でHTML要素を返却<br>

SSRなのに特定の範囲毎にHTMLの変更が行われる<br>

## 31. Selective Hydration

### Hydration (ハイドレーション)とは

+ サーバー側で生成されたHTMLにJSの各ロジックを接続していくこと<br>

`Client` => `SSR` => `JSの読み込み` => `ハイドレーション`<br>

Suspenseを用いることでこの流れを複数並行で進めるようになる<br>

`例`

```jsx:Sample.jsx
<div>
  <Sidebar />
  <Suspense>
    <AlbumList />
  </Suspense>
  <Suspense>
    <TodoList />
  </Suspense>
</div>
```

Suspense単位毎にデフォルトでは上から順にハイドレーションされる<br>

### Selective Hydration とは

+ 特定のハイドレーション処理を一時中断、別の箇所のハイドレーション処理を優先的に進められる機能<br>

AlbumListのハイドレーション中にユーザーがTodoListのコンテンツエリアをクリックした場合（ユーザーが興味あるのはTodoList）<br>

ReactはAlbumListのハイドレーションを一時中断し、TodoListのハイドレーションを先に行う。<br>
ユーザーが興味あるコンテンツを最速でインタラクティブな状態にできる。<br>


## 32. Suspenseまとめ

```
データ取得中のローディングを宣言的に記述できる

Suspense単位でストリーミングされたり、ハイドレーションされるので「どの範囲をSuspenseで囲むか」という設計が重要

今後Reactはコンポーネント毎にSSRできるようになるので、Suspenseへの理解は必須になる
```

# セクション7: [おまけ] React18で その他 新しく追加されたHooks

## 34. React v18 で追加されたHooks

[React v18 新たなフック](https://ja.reactjs.org/blog/2022/03/29/react-v18.html#new-suspense-features) <br>

+ `useId`<br>

+ `useTransition`<br>

+ `useDeferredValue`<br>

+ `useSyncExternalStore`(ほとんど使う機会はない)<br>

+ `useInsertionEffect`(ほとんど使う機会はない)<br>
