## 25. 複数のSuspenseを組み合わせる

+ `$ touch src/components/{AlbumList.tsx,TodoList.tsx,Sidebar.tsx}`を実行<br>

+ `src/components/AlbumList.tsx`を編集<br>

```tsx:AlbumList.tsx
export const AlbumList = () => {
  return (
    <div>
      <h2>アルバム</h2>
    </div>
  );
};
```

+ `src/components/TodoList.tsx`を編集<br>

```tsx:TodoList.tsx
export const TodoList = () => {
  return (
    <div>
      <h2>Todo</h2>
    </div>
  );
};
```

+ `src/components/Sidebar.tsx`を編集<br>

```tsx:Sidebar.tsx
export const Sidebar = () => {
  return (
    <div>
      <a href="dummy">TOP</a>
    </div>
  );
};
```

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlbumList } from "./AlbumList"; // 追加
import { Sidebar } from "./Sidebar"; // 追加
import { TodoList } from "./TodoList"; // 追加

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
  // const { data } = useQuery<Album[]>(["albums"], fetchAlbums);

  return (
    <div>
      {/* <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)} */}
      <Sidebar /> // 追加
      <AlbumList /> // 追加
      <TodoList /> // 追加
    </div>
  );
};
```

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlbumList } from "./AlbumList";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";

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
  // const { data } = useQuery<Album[]>(["albums"], fetchAlbums);

  return (
    <div style={{ display: "flex", padding: "16px" }}> // 追加
      {/* <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)} */}
      <Sidebar />
      <div style={{ flexGrow: 1 }}> // 追加
        <AlbumList />
        <TodoList />
      </div> // 追加
    </div> // 追加
  );
};
```

+ `src/components/Sidebar.tsx`を編集<br>

```tsx:Sidebar.tsx
export const Sidebar = () => {
  return (
    // 編集
    <div style={{ width: "400px", border: "2px solid gray" }}>
      <a href="dummy">TOP</a>
      <br />
      <br />
      <a href="dummy">マイページ</a>
      <br />
      <br />
      <a href="dummy">利用規約</a>
    </div>
    // ここまで
  );
};
```

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlbumList } from "./AlbumList";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";

// ここから切り取り
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
// ここまで切り取り

export const ReactQuery = () => {
  // const { data } = useQuery<Album[]>(["albums"], fetchAlbums); AlbumList.tsxに持っていく

  return (
    <div style={{ display: "flex", padding: "16px" }}>
      // ここからAlbumList.tsxに持っていく
      {/* <p>React Query</p>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)} */}
      // ここまで
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <AlbumList />
        <TodoList />
      </div>
    </div>
  );
};
```

+ `src/components/AlbumList.tsx`を編集<br>

```tsx:AlbumList.tsx
import { useQuery } from "@tanstack/react-query"; // 追加
import axios from "axios"; // 追加

// 追加
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
// ここmで

export const AlbumList = () => {
  const { data } = useQuery<Album[]>(["albums"], fetchAlbums); // 追加

  return (
    <div style={{ height: '300px', border: '2px solid gray', background: 'cornsilk', overflowY: 'scroll' }}> // 編集
      <h2>アルバム</h2>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)} // 追加
    </div>
  );
};
```

+ https://jsonplaceholder.typicode.com/todos を使う<br>

+ `src/components/TodoList.tsx`を編集<br>

```tsx:TodoList.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const fetchTodos = async () => {
  const result = await axios.get<Todo[]>(
    "https://jsonplaceholder.typicode.com/todos"
  );
  return result.data;
};

export const TodoList = () => {
  const { data } = useQuery<Todo[]>(["todos"], fetchTodos);

  return (
    <div style={{ height: '300px', border: '2px solid gray', background: 'mistyrose', overflowY: 'scroll' }}>
      <h2>Todo</h2>
      {data?.map((todo) => (
        <p key={todo.id}>{todo.title}</p>
      ))}
    </div>
  );
};
```

+ localhost:3000で確認してみる<br>

このままだとSidebarもアルバムもTodoも全てローディング中だよ〜が表示されてしまう。<br>

なので、Suspenseを改善する<br>

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { Suspense } from "react"; // 追加
import { ErrorBoundary } from "react-error-boundary"; // 追加
import { AlbumList } from "./AlbumList";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";

export const ReactQuery = () => {
  return (
    <div style={{ display: "flex", padding: "16px" }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        // 編集
        <ErrorBoundary fallback={<p>Listエラーです！</p>}>
          <Suspense fallback={<p>Listローディング中だよ〜</p>}>
            <AlbumList />
            <TodoList />
          </Suspense>
        </ErrorBoundary>
        // ここまで
      </div>
    </div>
  );
};
```

+ `src/App.tsx`を編集<br>

```tsx:App.tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
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
      <ErrorBoundary fallback={<p>全体エラーです！</p>}> // 編集
        <Suspense fallback={<p>全体ローディング中だよ〜</p>}> // 編集
          <ReactQuery />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

+ localhost:3000 を確認してみる<br>

結果 ネストが深い List関係のSupenseとErrorBoundaryが優先されるようになる<br>

+ AlbumListコンポーネントの方を模擬的に重たい実装にしてみる<br>

+ `src/components/AlbumList.tsx`を編集<br>

```tsx:AlbumList.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 追加
// 模擬的に何秒待たせたいとかに使うJavaScriptの実装
const sleep = (ms: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
// ここまで

type Album = {
  userId: number;
  id: number;
  title: string;
};

const fetchAlbums = async () => {
  const result = await axios.get<Album[]>(
    "https://jsonplaceholder.typicode.com/albums"
  )
  .then(await sleep(5000)); // 追加
  return result.data;
};

export const AlbumList = () => {
  const { data } = useQuery<Album[]>(["albums"], fetchAlbums);

  return (
    <div style={{ height: '300px', border: '2px solid gray', background: 'cornsilk', overflowY: 'scroll' }}>
      <h2>アルバム</h2>
      {data?.map((album) => <p key={album.id}>{album.title}</p>)}
    </div>
  );
};
```

+ localhost:3000 を確認してみる<br>

＊ AlbumListコンポーネントだけ重くしてあるが今のままだとTodoListコンポーネントの方も同じ影響を受けてしまっている(TodosListはAlbumListよりも早くデータ取得されているはず)<br>

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AlbumList } from "./AlbumList";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";

export const ReactQuery = () => {
  return (
    <div style={{ display: "flex", padding: "16px" }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        // 編集
        <ErrorBoundary fallback={<p>AlbumListエラーです！</p>}>
          <Suspense fallback={<p>AlbumListローディング中だよ〜</p>}>
            <AlbumList />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallback={<p>TodoListエラーです！</p>}>
          <Suspense fallback={<p>TodoListローディング中だよ〜</p>}>
            <TodoList />
          </Suspense>
        </ErrorBoundary>
        // ここまで
      </div>
    </div>
  );
};
```

+ localhost:3000 を確認してみる<br>

結果: TodoListコンポーネントはAlbumListコンポーネントより早く表示されるようになる<br>
