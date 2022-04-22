import {observer} from "mobx-react-lite";
import {TodoStatus} from "../../domain/services/TodoService";

export type TodoStatusIconProps = {
  status: TodoStatus;
}

export default observer<TodoStatusIconProps>(function TodoStatusIcon({status}) {
  return (
    <span>
      {status}
    </span>
  );
});
