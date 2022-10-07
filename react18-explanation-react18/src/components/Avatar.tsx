import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isSelected?: boolean; // ?は必ずしもPropsとして渡さなくてもエラーにならない
  onClick: (assignee: string) => void;
};

export const Avatar = ({ children, isSelected = false, onClick }: Props) => {
  const border = isSelected ? "3px solid orange" : "1px solid gray";

  return (
    <div
      style={{
        width: "30px",
        height: "30px",
        border, // プロパティ名と変数名が同じなので border: borderとしなくてもよい
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
