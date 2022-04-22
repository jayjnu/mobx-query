import {observer} from "mobx-react-lite";
import TodoStore from "../../domain/stores/TodoStore";
import TodoListItem from "./TodoListItem";

export type TodoListProps = {
  store: TodoStore;
};

export default observer<TodoListProps>(function TodoList({store}) {
  return (
    <>
      {store.todos.map((todo) => <TodoListItem todo={todo} key={todo.id}/>)}
    </>
  );
});
