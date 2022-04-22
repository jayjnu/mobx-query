import Entity from "../../helpers/Entity";

export type TodoEntityProps = {
  id: string;
  title: string;
  status: string;
};

export default class TodoEntity extends Entity<TodoEntityProps> {
  private mutablePropeties = new Map<string, {validate: (val: any) => boolean; error: string}>([
    [
      'title', 
      {
        validate: (value: unknown) => typeof value === 'string' && value.length > 5,
        error: 'title should have at least five length'
      },
    ],
    [
      'status',
      {
        validate: (value: unknown) => ['todo', 'progress', 'done'].includes(value as string),
        error: `status should be one of 'todo', 'progress', 'done'`
      }
    ]
  ]);

  validateEach<T>(key: keyof TodoEntityProps, value: T): true | Error {
    const validation = this.mutablePropeties.get(key);
    if (!validation) {
      return new Error(`${key} is not property of Todo Object`);
    }
    const {validate, error} = validation;

    return validate(value) || new Error(error);
  }

  serialize(): TodoEntityProps {
    return {
      id: this._id,
      title: this.props.title,
      status: this.props.status
    };
  }
}