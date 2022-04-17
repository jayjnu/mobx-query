import Entity from "../../helpers/Entity";

export type TodoEntityProps = {
  id: string;
  title: string;
};

export default class TodoEntity extends Entity<TodoEntityProps> {
  private mutablePropeties = new Map<string, {validate: (val: any) => boolean; error: string}>([
    [
      'title', 
      {
        validate: (value: unknown) => typeof value === 'string' && value.length > 5,
        error: 'title should have at least five length'
      },
    ]
  ]);

  validateEach<T>(key: keyof TodoEntityProps, value: T): true | Error {
    const validation = this.mutablePropeties.get(key);
    if (!validation) {
      return new Error(`${key} is not property of Todo Object`);
    }
    const {validate, error} = validation;

    return validate(key) || new Error(error);
  }

  serialize(): TodoEntityProps {
    return {
      id: this._id,
      title: this.props.title
    };
  }
}