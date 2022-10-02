# セクション2: React18の破壊的変更

参考ドキュメント [React 18](https://ja.reactjs.org/blog/2022/03/29/react-v18.html) <br>

## 7. React18のプロジェクト作成

+ `$ yarn create react-app react18-explanation-react18 --template typescript`を実行<br>

+ `$ cd react18-explanation-react18`を実行<br>

+ `$ yarn start`を実行<br>

## 7. React17のプロジェクト作成

+ `$ yarn create react-app react18-explanation-react17 --template typescript`<br>

+ `cd react18-explanation-react17`を実行<br>

## React18をReact17にダウングレード

+ `react18-explanation-react17`で `$ yarn add react@17.02 react-dom@17.02`を実行<br>

+ `react18-explanation-react17/src/index.tsx`を編集<br>

```tsx:index.tsx
import React from 'react';
import ReactDOM from 'react-dom'; // 編集
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 編集
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
, document.getElementById('root'));
// ここまで

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

+ `yarn start`を実行<br>

## 8. Reactアプリケーションのルートを作成する新たなメソッド

+ `react18-explanation-react17/src/index.tsx`をコピーして`react18-explanation-react18/src/index.tsx`にそのまま写し変えてみる<br>

+ 確認後は戻しておく<br>

+ `react18-explanation-react18/src/index.tsx`<br>

```tsx:index.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

+ `$ yarn start`を実行(エラーなく起動させることができるがしかし、React18の各機能が使えなくなっている状態になる)<br>

+ ブラウザの検証コンソールには下記のようにWarningが出る<br>

```:console
Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17.
```