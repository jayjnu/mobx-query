import { faker } from '@faker-js/faker';
import type {TodoEntityProps} from './Todo';

const data = new Map<string, TodoEntityProps>([
  createItem(),
  createItem(),
]);

function createItem(): [string, TodoEntityProps] {
  const id = faker.datatype.uuid();
  
  return [id, {
    id,
    title: faker.commerce.product()
  }]
}


export default data;
