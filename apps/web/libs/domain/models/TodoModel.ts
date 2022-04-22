import { makeAutoObservable } from 'mobx';
import {Todo, TodoStatus} from '../services/TodoService';

type TodoModelEvents = {
  onStatusChange?: (todo: TodoModel, nextStatus: TodoStatus) => void;
  onTitleChange?: (todo: TodoModel, nextTitle: string) => void;
  onRemove: (todo: TodoModel) => void;
};

export default class TodoModel {
  id = this.props.id
  status = this.props.status;;
  title = this.props.title;

  constructor(private readonly props: Todo, private readonly events?: TodoModelEvents) {
    makeAutoObservable(this);
  }

  setStatus(status: TodoStatus) {
    this.events?.onStatusChange?.(this, status);
  }

  remove() {
    this.events?.onRemove(this);
  }

  setTitle(title: string) {
    this.events?.onTitleChange?.(this, title);
  }
}