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

## 09. StrictModeの挙動

+ [Strict モードの新たな挙動](https://ja.reactjs.org/blog/2022/03/29/react-v18.html) <br>

+ `react18-explanation-react17/src/App.tsx`を編集<br>

```tsx:App.tsx
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  console.log('Appがレンダリングされた！！') // 追加
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

+ 開発ツールを確認する<br>

```:console
Appがレンダリングされた！！
```

+ `react18-explanation-react18/src/App.tsx`を編集<br>

```tsx:App.tsx
import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  console.log("Appがレンダリングされた！！"); // 追加
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

+ 開発ツールを確認する<br>

```:console
Appがレンダリングされた！！
Appがレンダリングされた！！
// 一度破棄してもう一度レンダリングされる仕組み
```

+ `react18-explanation-react17/src/App.tsx`を編集(最初の一回のレンダリングをuseEffectで表示)<br>

```tsx:App.tsx
import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  // 追加
  useEffect(() => {
    console.log("useEffect！！");
  }, []); // から配列にすると最初の一回のみ実行される
  // ここまで

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

+ 開発ツールを確認する<br>

```:console
useEffect！！
```

+ `react18-explanation-react18/src/App.tsx`を編集(useEffectで表示 一回レンダリングされたのを一度破棄されて再表示)<br>

```tsx:App.tsx
import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  // 追加
  useEffect(() => {
    console.log("useEffect！！");
  }, []);
  // ここまで

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

+ 開発ツールを確認する<br>

```:console
useEffect！！
useEffect！！
```

+ 上記のReact18の挙動は`StrictMode`を採用してる時のみに起きる挙動である。<br>


+ `react18-explanation-react18/src/index.tsx`を編集 (確認後戻す)<br>

```tsx:index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode> // コメントアウト
    <App />
  // </React.StrictMode> // コメントアウト
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

+ 開発ツールを確認する<br>

```:console
useEffect！！
// 一度のみのレンダリングになる
```

* StrictModeでもbuildを行って本番環境では一度のみのレンダリングになる<br>

# セクション3: Automatic Batching

[新機能：自動バッチング React18](https://ja.reactjs.org/blog/2022/03/29/react-v18.html) <br>

## 11. React17までのバッチ処理の確認

+ `$mkdir react18-explanation-react17/src/components && touch $_/AutoBatchEventHandler.tsx`を実行<br>

+ `react-explanation-react17/src/components/AutoBatchEventHandler.tsx`を編集<br>

```tsx:AutoBatchEventHandler.tsx
export const AutoBatchEventHandler = () => {
  return (
    <div>
      <p>Auto Batching確認用(イベントハンドラ)</p>
    </div>
  );
};
```

+ `react18-explanation-react17/src/App.tsx`を編集<br>

```tsx:App.tsx
import "./App.css";
import { AutoBatchEventHandler } from "./components/AutoBatchEventHandler";

function App() {
  return (
    <div className="App">
      <AutoBatchEventHandler />
    </div>
  );
}

export default App;
```

+ `react18-explanation-react17/src/components/AutoBatchEventHandler.tsx`を編集<br>

```tsx:AutoBatchEventHandler.tsx
import { useState } from "react";

export const AutoBatchEventHandler = () => {
  const [state1, setState1] = useState<number>(0);
  const [state2, setState2] = useState<number>(0);

  const onClickUpdateButton = () => {
    // (state1 + 1)でも同じ挙動を示すが ((state1) => state + 1)とした方が今現在のstate1を更新するのでこれのが安全である
    setState1(state1 => state1 + 1);
    setState2(state2 => state2 + 1);
  };

  return (
    <div>
      <p>Auto Batching確認用(イベントハンドラ)</p>
      <button onClick={onClickUpdateButton}>State更新！</button>
      <p>
        State1: {state1}
      </p>
      <p>
        State2: {state2}
      </p>
    </div>
  );
};
```

+ `react18-explanation-react17/src/components/AutoBatchEventHandler.tsx`を編集<br>

```tsx:AutoBatchEventHandler.tsx
import { useState } from "react";

export const AutoBatchEventHandler = () => {
  console.log('AutoBatchEventHandler')

  const [state1, setState1] = useState<number>(0);
  const [state2, setState2] = useState<number>(0);

  const onClickUpdateButton = () => {
    // イベントハンドラ内のset関数になる
    console.log(state1) // 追加
    setState1(state1 => state1 + 1);
    console.log(state1) // 追加
    setState2(state2 => state2 + 1);
  };

  return (
    <div>
      <p>Auto Batching確認用(イベントハンドラ)</p>
      <button onClick={onClickUpdateButton}>State更新！</button>
      <p>
        State1: {state1}
      </p>
      <p>
        State2: {state2}
      </p>
    </div>
  );
};
```

+ コンソールを確認して挙動を見てみる<br>

```:console
AutoBatchEventHandler
0
0
AutoBatchEventHandler
1
1
AutoBatchEventHandler
2
2
AutoBatchEventHandler
3
3
AutoBatchEventHandler
4
4
AutoBatchEventHandler
```

+ $touch react18-explanation-react17/src/components/AutoBatchOther.tsx`を実行<br>

+ `react18-explanation-react17/src/components/AutoBatchOther.tsx`を編集<br>

```tsx:AutoBatchOther.tsx
export const AutoBatchOther = () => {
  return (
    <div>
      <p>Automatic Batching確認用（その他）</p>
    </div>
  );
};
```

+ `react18-explanation-react17/src/App.tsx`を編集<br>

```tsx:App.tsx
import "./App.css";
import { AutoBatchEventHandler } from "./components/AutoBatchEventHandler";
import { AutoBatchOther } from "./components/AutoBatchOther"; // 追加

function App() {
  return (
    <div className="App">
      <AutoBatchEventHandler />
      <AutoBatchOther /> // 追加
    </div>
  );
}

export default App;
```

+ [Json place holder](https://jsonplaceholder.typicode.com/todos) を使ってみる<br>

+ `react18-explanation-react17/src/components/AutoBatchOther.tsx`を編集<br>

```tsx:AutoBatchOther.tsx
import { useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const AutoBatchOther = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isFinishApi, setIsFinishApi] = useState<boolean>(false);

  const onClickExecuteApi = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(res => res.json())
      .then(data => {
        // この場合バッチ処理されていない
        setTodos(data);
        setIsFinishApi(true);
      });
  };

  return (
    <div>
      <p>Automatic Batching確認用（その他）</p>
      <button onClick={onClickExecuteApi}>API実行！</button>
      <p>isFinishApi: {isFinishApi ? 'true' : 'false'}</p>
      {todos?.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  );
};
```

+ `API実行！`ボタンをクリックして確認してみる<br>

+ `react18-explanation-react17/src/components/AutoBatchOther.tsx`を編集(バッチ処理されていない確認)<br>

```tsx:AutoBatchOther.tsx
import { useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const AutoBatchOther = () => {
  console.log('AutoBatchOter'); // 追加

  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isFinishApi, setIsFinishApi] = useState<boolean>(false);

  const onClickExecuteApi = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(res => res.json())
      .then(data => {
        // 以下はイベントハンドラ外のset関数になる
        setTodos(data);
        setIsFinishApi(true);
      });
  };

  return (
    <div>
      <p>Automatic Batching確認用（その他）</p>
      <button onClick={onClickExecuteApi}>API実行！</button>
      <p>isFinishApi: {isFinishApi ? 'true' : 'false'}</p>
      {todos?.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  );
};
```

+ `API実行！`ボタンをクリックして(コンソール)確認してみる<br>

```:console
AutoBatchOter
AutoBatchOter
```

```
結果: AutoBatchEventHandlerコンポーネントの方はイベントハンドラの中であり自動バッチ処理されていて再レンダリングは一度のみだが、
     AutoBatchOterコンポーネントの方はイベントハンドラ以外で複数set関数を呼んでいるため自動バッチ処理されていないので再レンダリングが2度(set関数を呼んだ分だけ再レンダリング)されてしまっている。
```

+ 試しに `react18-explanation-react17/src/components/AutoBatchOther.tsx`<br>

```tsx:AutoBatchOther.tsx
import { useState } from "react";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const AutoBatchOther = () => {
  console.log('AutoBatchOter');

  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isFinishApi, setIsFinishApi] = useState<boolean>(false);
  const [, setState3] = useState<string>(''); // 追加

  const onClickExecuteApi = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setIsFinishApi(true);
        setState3('updated'); // 追加
      });
  };

  return (
    <div>
      <p>Automatic Batching確認用（その他）</p>
      <button onClick={onClickExecuteApi}>API実行！</button>
      <p>isFinishApi: {isFinishApi ? 'true' : 'false'}</p>
      {todos?.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  );
};
```

+ 挙動を確認してみる(やはり3回再レンダリングされている)<br>

```:console
AutoBatchOter
AutoBatchOter
AutoBatchOter
```

+ 以上がReact17の自動バッチ処理の挙動であり、イベントハンドラ外での関数処理は再レンダリングが定義した分だけされてしまう。<br>

+ React18ではこれが改善されている<br>
