import {observer} from "mobx-react-lite";
import {useCallback, useRef, useState} from "react";
import TodoButtonEdit from "./TodoButtonEdit";
import css from './TodoTitleEditable.module.css';

export type TodoTitleEditable = {
  title: string;
  onChange?: (title: string) => void;
};

export default observer<TodoTitleEditable>(function TodoTitleEditable({title, onChange}) {
  const [isEditMode, setEditMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEditModeChange = useCallback(() => {
    if (!contentRef.current) {
      return;
    }
    const title = contentRef.current.innerText;

    setEditMode(!isEditMode);
    onChange?.(title);

  }, [isEditMode, onChange])

  return (
    <div className={css.root}>
      <div ref={contentRef} contentEditable={isEditMode} className={css.content}>{title}</div>
      <TodoButtonEdit on={isEditMode} onClick={handleEditModeChange}/>
    </div>
  );
});
