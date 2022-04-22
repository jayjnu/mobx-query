import {observer} from "mobx-react-lite";
import {MouseEventHandler} from "react";
import {Button} from "ui";

export type TodoButtonRemoveProps = {
  onClick?: MouseEventHandler;
};

export default observer<TodoButtonRemoveProps>(function TodoButtonRemove({onClick}) {
  return <Button onClick={onClick} type="button">X</Button>;
});
