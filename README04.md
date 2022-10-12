# セクション5: Suspense - その1(文法編)

[従来のSuspenseに関するリンク](https://reactjs.org/blog/2018/10/23/react-v-16-6.html) <br>

## 21. これまでのSuspense、これからのSuspense

[サスペンスの新機能](https://ja.reactjs.org/blog/2022/03/29/react-v18.html#new-suspense-features) <br>

https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md <br>

## 22. Suspenseを学ぶ前準備

+ `react18-explanation-react18/src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { useState } from "react";
import { Avatar } from "./Avatar";
import { TaskList } from "./TaskList";

export type Task = {
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
  const [isShowList, setIsShowList] = useState<boolean>(false); // 追加

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
          isSelected={selectedAssignee === member.a}
          onClick={onClickAssignee}
        >
          {member.a}
        </Avatar>
        <Avatar
          isSelected={selectedAssignee === member.b}
          onClick={onClickAssignee}
        >
          {member.b}
        </Avatar>
        <Avatar
          isSelected={selectedAssignee === member.c}
          onClick={onClickAssignee}
        >
          {member.c}
        </Avatar>
      </div>
      <br />
      <button onClick={() => onClickAssignee("")}>リセット</button>
      // 追加
      <br />
      <br />
      <button onClick={() => setIsShowList(!isShowList)}>表示/非表示</button>
      {isShowList && <TaskList taskList={taskList} />}
      // ここまで
    </div>
  );
};
```

＊ (Suspenseを実装しないパターン) <br>

+ Suspenseと使うときは下記の二つのどちらかを使う<br>

1. [TanStack Query(react query)](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/) (今回はこちらを使う)<br>

2. [SWR](https://swr.vercel.app/ja) <br>

+ `$ yarn add @tanstack/react-query axios`を実行<br>

+ `src/index.tsx`を編集<br>

```tsx:index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // 追加

const queryClient = new QueryClient(); // 追加

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> // 追加
      <App />
    </QueryClientProvider>
  </React.StrictMode> // 追加
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

+ `$ touch src/components/ReactQuery.tsx`を実行<br>

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
export const ReactQuery = () => {
  return (
    <div>
      <p>React Query</p>
    </div>
  );
};
```

+ `src/App.tsx`を編集<br>

```tsx:App.tsx
import "./App.css";
import { AutoBatchEventHandler } from "./components/AutoBatchEventHandler";
import { AutoBatchOther } from "./components/AutoBatchOther";
import { ReactQuery } from "./components/ReactQuery"; // 追加
import { Transition } from "./components/Transition";

function App() {
  return (
    <div className="App">
      <AutoBatchEventHandler />
      <AutoBatchOther />
      <hr />
      <Transition />
      // 追加
      <hr />
      <ReactQuery />
      // ここまで
    </div>
  );
}

export default App;
```

[JSONPlaceholder](https://jsonplaceholder.typicode.com/albums) <br>

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query"; // 追加
import axios from "axios"; // 追加

// 追加
type Album = {
  userId: number;
  id: number;
  title: string;
};
// ここまで

// 追加
const fetchAlbums = async () => {
  const result = await axios.get<Album[]>(
    "https://jsonplaceholder.typicode.com/albums"
  );
  return result.data;
};
// ここまで

export const ReactQuery = () => {
  const { isLoading, error, data } = useQuery<Album[]>(["albums"], fetchAlbums); // 追加

  if (error) return <p>エラーです！</p> // 追加
  if (isLoading) return <p>ローディング中だよ〜</p> // 追加

  return (
    <div>
      <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)} // 追加
    </div>
  );
};
```

+ localhost:3000 で確認してみる<br>

## 23. 基本的なSuspenseの実装

+ `src/App.tsx`を編集<br>

```tsx:App.tsx
import { Suspense } from "react"; // 追加
import "./App.css";
import { AutoBatchEventHandler } from "./components/AutoBatchEventHandler";
import { AutoBatchOther } from "./components/AutoBatchOther";
import { ReactQuery } from "./components/ReactQuery";
import { Transition } from "./components/Transition";

function App() {
  return (
    <div className="App">
      <AutoBatchEventHandler />
      <AutoBatchOther />
      <hr />
      <Transition />
      <hr />
      <Suspense fallback={<p>ローディング中だよ〜</p>}> // 追加
        <ReactQuery />
      </Suspense> // 追加
    </div>
  );
}

export default App;
```

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Album = {
  userId: number;
  id: number;
  title: string;
};

const fetchAlbums = async () => {
  const result = await axios.get<Album[]>(
    "https://jsonplaceholder.typicode.com/albums"
  );
  return result.data;
};

export const ReactQuery = () => {
  const { isLoading, error, data } = useQuery<Album[]>(["albums"], fetchAlbums);

  // if (error) return <p>エラーです！</p> コメントアウト
  // if (isLoading) return <p>ローディング中だよ〜</p> コメントアウト

  return (
    <div>
      <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)}
    </div>
  );
};
```

+ localhost:3000 で試してみる (今の状態だとローディング表示されない)<br>

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Album = {
  userId: number;
  id: number;
  title: string;
};

const fetchAlbums = async () => {
  const result = await axios.get<Album[]>(
    "https://jsonplaceholder.typicode.com/albums"
  );
  return result.data;
};

export const ReactQuery = () => {
  const { isLoading, error, data } = useQuery<Album[]>(["albums"], fetchAlbums, {suspense: true}); // 編集

  // if (error) return <p>エラーです！</p>
  // if (isLoading) return <p>ローディング中だよ〜</p>

  return (
    <div>
      <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)}
    </div>
  );
};
```

+ localhost:3000 で試してみる (ローディングが表示されるようになった)<br>

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Album = {
  userId: number;
  id: number;
  title: string;
};

const fetchAlbums = async () => {
  const result = await axios.get<Album[]>(
    "https://jsonplaceholder.typicode.com/albums"
  );
  return result.data;
};

export const ReactQuery = () => {
  const { isLoading, error, data } = useQuery<Album[]>(["albums"], fetchAlbums); // 編集

  // if (error) return <p>エラーです！</p>
  // if (isLoading) return <p>ローディング中だよ〜</p>

  return (
    <div>
      <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)}
    </div>
  );
};
```

+ `src/index.tsx`を編集<br>

```tsx:index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 編集
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true
    }
  }
});
// ここまで

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

+ localhost:3000 で確認してみる (ローディング表示される)<br>

## 24. ErrorBoundaryの使用

+ `$ yarn add react-error-boundary`を実行<br>

+ `react18-explanation-react18/src/App.tsx`を編集<br>

```tsx:App.tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"; // 追加
import "./App.css";
import { AutoBatchEventHandler } from "./components/AutoBatchEventHandler";
import { AutoBatchOther } from "./components/AutoBatchOther";
import { ReactQuery } from "./components/ReactQuery";
import { Transition } from "./components/Transition";

function App() {
  return (
    <div className="App">
      <AutoBatchEventHandler />
      <AutoBatchOther />
      <hr />
      <Transition />
      <hr />
      <ErrorBoundary fallback={<p>エラーです！</p>}> // 追加
        <Suspense fallback={<p>ローディング中だよ〜</p>}>
          <ReactQuery />
        </Suspense>
      </ErrorBoundary> // 追加
    </div>
  );
}

export default App;
```

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Album = {
  userId: number;
  id: number;
  title: string;
};

const fetchAlbums = async () => {
  const result = await axios.get<Album[]>(
    "https://jsonplaceholder.typicode.com/albumsxxx" // エラー表示が確認できたら戻す
  );
  return result.data;
};

export const ReactQuery = () => {
  const { data } = useQuery<Album[]>(["albums"], fetchAlbums); // 編集

  // 削除
    // ...
  // ここまで

  return (
    <div>
      <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)}
    </div>
  );
};
```

+ localhost:3000 にアクセスしてエラー表示が確認できるかテストしてみる<br>
