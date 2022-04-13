import QueryKey, {QueryExpression} from './lib/QueryKey';

export default function queryKey<T>(name: string, expression: QueryExpression<T>) {
  return new QueryKey<T>(name, expression);
}