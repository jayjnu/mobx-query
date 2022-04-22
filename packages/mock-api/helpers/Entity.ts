import faker from "@faker-js/faker";

export default abstract class Entity<Props extends Record<string, any>> {
  readonly _id = 'id' in this.props ? this.props.id : faker.datatype.uuid();
  constructor(protected props: Props) {}

  update(key: keyof Props, value: any) {
    const validation = this.validateEach(key, value);
    if (validation === true) {
      this.props[key] = value;
    } else {
      return validation
    }
  }

  validate(): true | Error[] {
    const validations = Object.entries(this.props)
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => this.validateEach(key, value))
      .reduce((stats, validation) => {
        return validation === true ? stats : stats.concat(validation);
      }, [] as Error[]);

      return validations.length > 0 ? validations : true;
  }

  abstract validateEach<T>(key: keyof Props, value: T): true | Error;
  abstract serialize(): Props;
}