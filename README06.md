## 26. SuspenseとTransition

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AlbumList } from "./AlbumList";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";

type Tabs = "todo" | "album";

export const ReactQuery = () => {
  const [selectedTab, setSelectedTab] = useState<Tabs>("todo");

  const buttonStyle = {
    padding: "12px",
    fontSize: "16px",
    border: "none"
  };

  const onClickButton = (tab: Tabs) => {
    setSelectedTab(tab);
  };

  const albumButtonStyle = {
    ...buttonStyle,
    backgroundColor: selectedTab === "album" ? "royalblue" : "white",
    color: selectedTab === "album" ? "white" : "black"
  };

  const todouttonStyle = {
    ...buttonStyle,
    backgroundColor: selectedTab === "todo" ? "royalblue" : "white",
    color: selectedTab === "todo" ? "white" : "black"
  };

  return (
    <div style={{ display: "flex", padding: "16px" }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <button style={todoButtonStyle} onClick={() => onClickButton("todo")}>
          Todo
        </button>
        <button style={albumButtonStyle} onClick={() => onClickButton("album")}>
          Album
        </button>

        <ErrorBoundary fallback={<p>Todo or AlbumListエラーです！</p>}>
          <Suspense fallback={<p>Todo or AlbumListローディング中だよ〜</p>}>
            {selectedTab === "todo" ? <TodoList /> : <AlbumList />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};
```

+ localhost:3000 を確認してみる<br>

+ `src/components/ReactQuery.tsx`を編集<br>

```tsx:ReactQuery.tsx
import { Suspense, useState, useTransition } from "react"; // 編集
import { ErrorBoundary } from "react-error-boundary";
import { AlbumList } from "./AlbumList";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";

type Tabs = "todo" | "album";

export const ReactQuery = () => {
  const [selectedTab, setSelectedTab] = useState<Tabs>("todo");
  const [isPending, startTransition] = useTransition(); // 追加

  const buttonStyle = {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    opacity: isPending ? 0.5 : 1 // 追加
  };

  const albumButtonStyle = {
    ...buttonStyle,
    backgroundColor: selectedTab === "album" ? "royalblue" : "white",
    color: selectedTab === "album" ? "white" : "black"
  };

  const todoButtonStyle = {
    ...buttonStyle,
    backgroundColor: selectedTab === "todo" ? "royalblue" : "white",
    color: selectedTab === "todo" ? "white" : "black"
  };

  // 編集
  const onClickButton = (tab: Tabs) => {
    startTransition(() => {
      setSelectedTab(tab);
    });
  };
  // ここまで

  return (
    <div style={{ display: "flex", padding: "16px" }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }}>
        <button style={todoButtonStyle} onClick={() => onClickButton("todo")}>
          Todo
        </button>
        <button style={albumButtonStyle} onClick={() => onClickButton("album")}>
          Album
        </button>

        <ErrorBoundary fallback={<p>Todo or AlbumListエラーです！</p>}>
          <Suspense fallback={<p>Todo or AlbumListローディング中だよ〜</p>}>
            {selectedTab === "todo" ? <TodoList /> : <AlbumList />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};
```

+ localhost:3000 を確認してみる<br>

* 結果: Albumタブクリック時のデータ取得が完了するまではTodoタブデータを表示していてAlbumデータ取得が完了した時点でAlbumタブに切り替わる<br>
