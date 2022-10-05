## 12. Automatic Batchingを使ってみる(React 18)

+ `$ mkdir react18-explanation-react18/src/components && touch $_/{AutoBatchEventHandler.tsx,AutoBatchOther.tsx}`を実行<br>

+ `react18-explanation-react18/src/components/AutoBatchEventHandler.tsx`を編集<br>

```tsx:AutoBatchEventHandler.tsx
import { useState } from "react";

export const AutoBatchEventHandler = () => {
  console.log('AutoBatchEventHandler')

  const [state1, setState1] = useState<number>(0);
  const [state2, setState2] = useState<number>(0);

  const onClickUpdateButton = () => {
    console.log(state1)
    setState1(state1 => state1 + 1);
    console.log(state1)
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

+ `react18-explanation-react18/src/App.tsx`を編集<br>

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

+ `react18-explanation-react18/src/index.tsx`を編集(このレクチャーだけ一旦StrictModeを解除しておく)<br>

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
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

+ レンダリングを確認してみる(イベントハンドラ内は当然バッチ処理されている)<br>

```:console
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

+ `react18-explanation-react18/src/components/AutoBatchOter.tsx`を編集<br>

```tsx:AutoBatchOter.tsx
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
  const [, setState3] = useState<string>('');

  const onClickExecuteApi = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setIsFinishApi(true);
        setState3('updated');
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

+ `react18-explanation-react18/src/App.tsx`を編集<br>

```tsx:App.tsx
import "./App.css";
import { AutoBatchEventHandler } from "./components/AutoBatchEventHandler";
import { AutoBatchOther } from "./components/AutoBatchOther";

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

+ `API実行`ボタンをクリックしてみて挙動を確認してみる<br>

```:console
AutoBatchOter
```

+ React18の場合、イベントハンドラ外の複数関数があっても再レンダリングが一度のみになっていて自動バッチ処理が施されている<br>
