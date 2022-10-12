import { Suspense, useState, useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AlbumList } from "./AlbumList";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";

type Tabs = "todo" | "album";

export const ReactQuery = () => {
  const [selectedTab, setSelectedTab] = useState<Tabs>("todo");
  const [isPending, startTransition] = useTransition();

  const buttonStyle = {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    opacity: isPending ? 0.5 : 1
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

  const onClickButton = (tab: Tabs) => {
    startTransition(() => {
      setSelectedTab(tab);
    });
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
