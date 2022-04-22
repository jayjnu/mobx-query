import {observer} from "mobx-react-lite";
import {useCallback} from "react";
import TodoModel from '../../domain/models/TodoModel';
import TodoButtonRemove from "./TodoButtonRemove";
import TodoStatusIcon from "./TodoStatusIcon";
import TodoTitleEditable from "./TodoTitleEditable";



export type TodoItemProps = {
  todo: TodoModel
  onStatusChange?: (item: TodoModel) => void;
}

export default observer<TodoItemProps>(function TodoListItem({
  todo
}) {
  const handleClick = useCallback(() => {
    todo.remove();
  }, [todo]);
  const handleTitleChange = useCallback((title) => {
    todo.setTitle(title);
  }, [todo]);

  return (
    <div>
      <TodoStatusIcon status={todo.status}/>
      <TodoTitleEditable title={todo.title} onChange={handleTitleChange}/>
      <TodoButtonRemove onClick={handleClick}/>
    </div>
  );
});
