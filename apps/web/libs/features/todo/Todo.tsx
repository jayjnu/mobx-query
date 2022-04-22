import {observer} from "mobx-react-lite";
import TodoList from "./TodoList";
import {useTodo} from "./TodoProvider";

function Todolist() {
  const todo = useTodo();

  return (
    <>
      <TodoList store={todo}/>
    </>
  );
}

export default observer(Todolist);