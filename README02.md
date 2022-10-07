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

## 13. flushSync(バッチ処理を拒否する)

+ `react18-explanation-react18/src/components/AutoBatchEventHandler.tsx`を編集<br>

```tsx:AutoBatchEventHandler.tsx
import { useState } from "react";
import { flushSync } from "react-dom"; // 追加

export const AutoBatchEventHandler = () => {
  console.log("AutoBatchEventHandler");

  const [state1, setState1] = useState<number>(0);
  const [state2, setState2] = useState<number>(0);

  const onClickUpdateButton = () => {
    console.log(state1);
    // 編集
    flushSync(() => {
      setState1(state1 => state1 + 1); // バッチ処理しなくない対象の関数を記述
    });
    // ここまで
    console.log(state1);
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

+ 再レンダリングの挙動を確認する(state1は毎回再レンダリングされるようになる)<br>

```:console
0
AutoBatchEventHandler
0
AutoBatchEventHandler
1
AutoBatchEventHandler
1
AutoBatchEventHandler
2
AutoBatchEventHandler
2
AutoBatchEventHandler
3
AutoBatchEventHandler
3
AutoBatchEventHandler
```

+ `react18-explanation-react18/src/components/AutoBatchOter.tsx`を編集<br>

```tsx:AutoBatchOter.tsx
import { useState } from "react";
import { flushSync } from "react-dom"; // 追加

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
        // 編集
        flushSync(() => {
          setTodos(data); // バッチ処理したくない関数
        })
        // ここまで
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

+ 挙動を確認<br>

```:console
AutoBatchOter
AutoBatchOther.tsx:12 AutoBatchOter
// 2回レンダリングされる(flushSyncしたsetTodos関数の分)
```

+ 確認後 StrictModeは戻しておく<br>

# セクション4: Transition

## 15. サンプルアプリの作成

＊ 移行はReact18でやっていく<br>

+ [新機能：トランジション](https://ja.reactjs.org/blog/2022/03/29/react-v18.html) <br>

+ `$ touch src/components/Transition.tsx`を実行<br>

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
export const Transition = () => {
  return (
    <div>
      <p>Transition</p>
    </div>
  )
}
```

+ `src/App.tsx`を編集<br>

```tsx:App.tsx
import "./App.css";
import { AutoBatchEventHandler } from "./components/AutoBatchEventHandler";
import { AutoBatchOther } from "./components/AutoBatchOther";
import { Transition } from "./components/Transition";

function App() {
  return (
    <div className="App">
      <AutoBatchEventHandler />
      <AutoBatchOther />
      // 追加
      <hr />
      <Transition />
      // ここまで
    </div>
  );
}

export default App;
```

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
// 追加
type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
console.log(tasks);
// ここまで

export const Transition = () => {
  return (
    <div>
      <p>Transition</p>
    </div>
  );
};
```

+ consoleを確認してみる<br>

```:console
Array(10000)
[0 … 99]
[100 … 199]
[200 … 299]
[300 … 399]
[400 … 499]
[500 … 599]
[600 … 699]
[700 … 799]
[800 … 899]
[900 … 999]
[1000 … 1099]
[1100 … 1199]
[1200 … 1299]
[1300 … 1399]
[1400 … 1499]
[1500 … 1599]
[1600 … 1699]
[1700 … 1799]
[1800 … 1899]
[1900 … 1999]
[2000 … 2099]
[2100 … 2199]
[2200 … 2299]
[2300 … 2399]
[2400 … 2499]
[2500 … 2599]
[2600 … 2699]
[2700 … 2799]
[2800 … 2899]
[2900 … 2999]
[3000 … 3099]
[3100 … 3199]
[3200 … 3299]
[3300 … 3399]
[3400 … 3499]
[3500 … 3599]
[3600 … 3699]
[3700 … 3799]
[3800 … 3899]
[3900 … 3999]
[4000 … 4099]
[4100 … 4199]
[4200 … 4299]
[4300 … 4399]
[4400 … 4499]
[4500 … 4599]
[4600 … 4699]
[4700 … 4799]
[4800 … 4899]
[4900 … 4999]
[5000 … 5099]
[5100 … 5199]
[5200 … 5299]
[5300 … 5399]
[5400 … 5499]
[5500 … 5599]
[5600 … 5699]
[5700 … 5799]
[5800 … 5899]
[5900 … 5999]
[6000 … 6099]
[6100 … 6199]
[6200 … 6299]
[6300 … 6399]
[6400 … 6499]
[6500 … 6599]
[6600 … 6699]
[6700 … 6799]
[6800 … 6899]
[6900 … 6999]
[7000 … 7099]
[7100 … 7199]
[7200 … 7299]
[7300 … 7399]
[7400 … 7499]
[7500 … 7599]
[7600 … 7699]
[7700 … 7799]
[7800 … 7899]
[7900 … 7999]
[8000 … 8099]
[8100 … 8199]
[8200 … 8299]
[8300 … 8399]
[8400 … 8499]
[8500 … 8599]
[8600 … 8699]
[8700 … 8799]
[8800 … 8899]
[8900 … 8999]
[9000 … 9099]
[9100 … 9199]
[9200 … 9299]
[9300 … 9399]
[9400 … 9499]
[9500 … 9599]
[9600 … 9699]
[9700 … 9799]
[9800 … 9899]
[9900 … 9999]
length
: 10000
```

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
// console.log(tasks);

export const Transition = () => {
  return (
    <div>
      <p>Transition</p>
      // 追加
      {tasks.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender" }}
        >
          <p>
            タイトル: {task.title}
          </p>
          <p>
            担当: {task.assignee}
          </p>
        </div>
      )}
      // ここまで
    </div>
  );
};
```

+ localhost:3000にアクセスしてみる<br>

+ `$ touch src/components/Avatar.tsx`を実行<br>

+ `src/components/Avatar.tsx`を編集<br>

```tsx:Avatar.tsx
export const Avatar = () => {
  return (
    <div
      style={{
        width: "30px",
        height: "30px",
        border: "1px solid gray",
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "30px",
        userSelect: "none"
      }}
    >
      {"A"}
    </div>
  );
};
```

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { Avatar } from "./Avatar"; // 追加

type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
// console.log(tasks);

export const Transition = () => {
  return (
    <div>
      <p>Transition</p>
      // 追加
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar />
        <Avatar />
        <Avatar />
      </div>
      // ここまで
      {tasks.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender" }}
        >
          <p>
            タイトル: {task.title}
          </p>
          <p>
            担当: {task.assignee}
          </p>
        </div>
      )}
    </div>
  );
};
```

+ `src/components/Avatar.tsx`を編集<br>

```tsx:Avatar.tsx
import { ReactNode } from "react"; // 追加

// 追加
type Props = {
  children: ReactNode;
};
// ここまで

export const Avatar = ({ children }: Props) => { // 編集
  return (
    <div
      style={{
        width: "30px",
        height: "30px",
        border: "1px solid gray",
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "30px",
        userSelect: "none"
      }}
    >
      {children}
    </div>
  );
};
```

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { Avatar } from "./Avatar";

type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
// console.log(tasks);

export const Transition = () => {
  return (
    <div>
      <p>Transition</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar>{member.a}</Avatar>
        <Avatar>{member.b}</Avatar>
        <Avatar>{member.c}</Avatar>

      </div>
      {tasks.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender" }}
        >
          <p>
            タイトル: {task.title}
          </p>
          <p>
            担当: {task.assignee}
          </p>
        </div>
      )}
    </div>
  );
};
```

+ localhost:3000 確認してみる<br>

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { useState } from "react"; // 追加
import { Avatar } from "./Avatar";

type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
// console.log(tasks);

export const Transition = () => {
  const [selectedAssignee, setSelectedAssignee] = useState<string>(""); // 追加 押された担当者
  const [taskList, setTaskList] = useState<Task[]>(tasks); // 追加 Taskの型の配列になる

  return (
    <div>
      <p>Transition</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar>
          {member.a}
        </Avatar>
        <Avatar>
          {member.b}
        </Avatar>
        <Avatar>
          {member.c}
        </Avatar>
      </div>
      // 編集 taskListに変更する
      {taskList.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender" }}
        >
          <p>
            タイトル: {task.title}
          </p>
          <p>
            担当: {task.assignee}
          </p>
        </div>
      )}
    </div>
  );
};
```

+ `src/components/Avatar.jsx`を編集<br>

```jsx:Avatar.jsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: (assignee: string) => void; // 追加
};

export const Avatar = ({ children, onClick }: Props) => { // propsにonClickを追加
  return (
    <div
      style={{
        width: "30px",
        height: "30px",
        border: "1px solid gray",
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "30px",
        userSelect: "none"
      }}
      onClick={() => onClick(`${children}`)} // 追加
    >
      {children}
    </div>
  );
};
```

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { useState } from "react";
import { Avatar } from "./Avatar";

type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
// console.log(tasks);

export const Transition = () => {
  const [selectedAssignee, setSelectedAssignee] = useState<string>(""); // 押された担当者
  const [taskList, setTaskList] = useState<Task[]>(tasks); // Taskの型の配列になる

  // 追加
  const onClickAssignee = (assignee: string) => {
    alert(assignee);
  };
  // ここまで

  return (
    <div>
      <p>Transition</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar onClick={onClickAssignee}> // 編集
          {member.a}
        </Avatar>
        <Avatar onClick={onClickAssignee}> // 編集
          {member.b}
        </Avatar>
        <Avatar onClick={onClickAssignee}> // 編集
          {member.c}
        </Avatar>
      </div>
      {taskList.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender" }}
        >
          <p>
            タイトル: {task.title}
          </p>
          <p>
            担当: {task.assignee}
          </p>
        </div>
      )}
    </div>
  );
};
```

+ localhost:3000 でalertが表示されるか確認してみる<br>

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { useState } from "react";
import { Avatar } from "./Avatar";

type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
// console.log(tasks);

// 追加 担当者で絞り込む関数
const filteringAssignee = (assignee: string) => {
  if (assignee === "") return tasks; // 担当者がからの場合はtasksを返す
  return tasks.filter(task => task.assignee === assignee); // 引数で渡ってきた担当者と全体の担当者の中のそれと一致するように絞り込む
};
// ここまで

export const Transition = () => {
  const [selectedAssignee, setSelectedAssignee] = useState<string>(""); // 追加 押された担当者
  const [taskList, setTaskList] = useState<Task[]>(tasks); // 追加 Taskの型の配列になる

  const onClickAssignee = (assignee: string) => {
    // alert(assignee);
    setSelectedAssignee(assignee); // 追加
    setTaskList(filteringAssignee(assignee)); // 追加
  };

  return (
    <div>
      <p>Transition</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar onClick={onClickAssignee}>
          {member.a}
        </Avatar>
        <Avatar onClick={onClickAssignee}>
          {member.b}
        </Avatar>
        <Avatar onClick={onClickAssignee}>
          {member.c}
        </Avatar>
      </div>
      {taskList.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender" }}
        >
          <p>
            タイトル: {task.title}
          </p>
          <p>
            担当: {task.assignee}
          </p>
        </div>
      )}
    </div>
  );
};
```

+ localhost:3000 で担当者ごとのクリックをしてみて絞り込まれればOK<br>

+ `src/components/Avatar.tsx`を編集<br>

```tsx:Avatar.tsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isSelected?: boolean; // ?は必ずしもPropsとして渡さなくてもエラーにならない
  onClick: (assignee: string) => void;
};

export const Avatar = ({ children, isSelected = false, onClick }: Props) => { // 編集 isSelected = falseを追加
  const border = isSelected ? "3px solid orange" : "1px solid gray"; // 追加

  return (
    <div
      style={{
        width: "30px",
        height: "30px",
        border, // 編集 プロパティ名と変数名が同じなので border: borderとしなくてもよい
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "30px",
        userSelect: "none"
      }}
      onClick={() => onClick(`${children}`)}
    >
      {children}
    </div>
  );
};
```

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { useState } from "react";
import { Avatar } from "./Avatar";

type Task = {
  id: number;
  title: string;
  assignee: string;
};

const member = {
  a: "A",
  b: "B",
  c: "C"
};

const generateDummuTasks = (): Task[] => {
  return Array(10000).fill("").map((_, index) => {
    const addedIndex = index + 1;
    return {
      id: addedIndex,
      title: `タスク${addedIndex}`,
      assignee:
        addedIndex % 3 === 0
          ? member.a
          : addedIndex % 2 === 0 ? member.b : member.c
    };
  });
};

const tasks = generateDummuTasks();
// console.log(tasks);

// 担当者で絞り込む関数
const filteringAssignee = (assignee: string) => {
  if (assignee === "") return tasks; // 担当者がからの場合はtasksを返す
  return tasks.filter(task => task.assignee === assignee); // 引数で渡ってきた担当者と全体の担当者の中のそれと一致するように絞り込む
};

export const Transition = () => {
  const [selectedAssignee, setSelectedAssignee] = useState<string>(""); // 押された担当者
  const [taskList, setTaskList] = useState<Task[]>(tasks); // Taskの型の配列になる

  const onClickAssignee = (assignee: string) => {
    // alert(assignee);
    setSelectedAssignee(assignee);
    setTaskList(filteringAssignee(assignee));
  };

  return (
    <div>
      <p>Transition</p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          isSelected={selectedAssignee === member.a} // 追加
          onClick={onClickAssignee} // 追加
        >
          {member.a}
        </Avatar>
        <Avatar
          isSelected={selectedAssignee === member.b} // 追加
          onClick={onClickAssignee} // 追加
        >
          {member.b}
        </Avatar>
        <Avatar
          isSelected={selectedAssignee === member.c} // 追加
          onClick={onClickAssignee} // 追加
        >
          {member.c}
        </Avatar>
      </div>
      // 追加
      <br />
      <button onClick={() => onClickAssignee('') }>リセット</button>
      // ここまで
      {taskList.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender" }}
        >
          <p>
            タイトル: {task.title}
          </p>
          <p>
            担当: {task.assignee}
          </p>
        </div>
      )}
    </div>
  );
};
```

+ これでサンプルアプリケーションは完成<br>
