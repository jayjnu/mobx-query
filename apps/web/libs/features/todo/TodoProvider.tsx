import {FC} from "react";
import {createContext, useContext} from "react";
import TodoStore from "../../domain/stores/TodoStore";
import {defineSafeContextHook} from "../../utils/hooks/defineSafeContextHook";

export const TodoContext = createContext<TodoStore | null>(null);

export const useTodo = defineSafeContextHook<TodoStore>('Todo', () => {
  return useContext(TodoContext);
});


export type TodoProviderProps = {
  store: TodoStore;
};

export const TodoProvider: FC<TodoProviderProps> = ({
  store,
  children
}) => {
  return (
    <TodoContext.Provider value={store}>
      {children}
    </TodoContext.Provider>
  );
}