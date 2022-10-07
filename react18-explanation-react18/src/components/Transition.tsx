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
