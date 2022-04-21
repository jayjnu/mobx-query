import {observer} from "mobx-react-lite";
import {useTodo} from "./TodoProvider";

function Todolist() {
  const todo = useTodo();

  return (
    <>
    </>
  )
}

export default observer(Todolist);