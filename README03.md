## 16. Transitionが解決する問題 / startTransition

+ `chrome` => `検証ツール` => `Peformance insights` => `No throtting` => `CPU` => `6 x slowdown` => `Disable cache` => `チェック外す` (これで擬似的にPC性能を下げる)<br>

+ この状態でフィルタリング処理を行なってみる `A`をクリックしてみる `B`をクリックしてみる `C`をクリックしてみる(相当に遅くなる)<br>

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { useState, startTransition } from "react"; // 編集
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
    // 編集
    startTransition(() => {
      setTaskList(filteringAssignee(assignee)); // 緊急性の高くない方を入れる
    });
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
      <button onClick={() => onClickAssignee('') }>リセット</button>
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

+ `この状態で試してみると ボタンの反映(A, B, c (setSelectedAssingee))は優先して速くなる(Task(setTaskList)は優先度低くしているので遅い)`

+ この状態だとTaskListがフィルタリング表示されるまでユーザーが分からない状態なのでそこをなんとかしたい<br>


## 17. useTransition

+ `src/components/Transition.tsx`を編集<br>

```tsx:Transition.tsx
import { useState, useTransition } from "react"; // 編集
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
  const [isPending, startTransition] = useTransition(); // 追加

  const [selectedAssignee, setSelectedAssignee] = useState<string>(""); // 押された担当者
  const [taskList, setTaskList] = useState<Task[]>(tasks); // Taskの型の配列になる

  const onClickAssignee = (assignee: string) => {
    // alert(assignee);
    setSelectedAssignee(assignee);
    startTransition(() => {
      setTaskList(filteringAssignee(assignee)); // 緊急性の高くない方を入れる
    });
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
      {taskList.map(task =>
        <div
          key={task.id}
          style={{ width: "300px", margin: "auto", background: "lavender", opacity: isPending ? 0.5 : 1 }} // 編集
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