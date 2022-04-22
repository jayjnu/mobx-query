import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import {Button, ButtonProps, classNames} from "ui";
import css from './TodoButtonEdit.module.css';

type TodoButtonEditProps = {
  on: boolean;
  onClick: ButtonProps['onClick'];
}

export default observer<TodoButtonEditProps>(function TodoButtonEdit({on, onClick}) {
  const className = useMemo(() => {
    return classNames([[css.button, true], [css.on, on]])
  }, [on]);
  
  return <Button onClick={onClick} className={className}>{on ? 'apply' : 'edit'}</Button>
});