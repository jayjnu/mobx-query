# mobx-query

## What does mobx-query offer?

- Abstractions of complex api request caching burdens
- Declarative async data stream in mobx language

### Declarative Http Request with Reactive Observable Stream

`mobx-query` helps you write codes in declarative style.

Imagine you are developing a web page where user can type a keyword to search for matching movies.


**Store**

```typescript
import {queryKey} from "@jayjnu/mobx-query";
import MovieModel from './MovieModel';

export default class MovieStore {
  // 1. define observable state that triggers http request
  keyword = '';

  // 2. define queryKey that reacts to reference observable changes
  private keywordQueryKey = queryKey('keyword', () => this.keyword);

  // 3. create an http request observable with queryKey
  private movieListQuery = this.movieRepository.useMovieListQuery(this.keywordQueryKey);


  // 4. map observable data to service model
  get movieList() {
    return this.movieListQuery.data.map((item) => new MovieModel(item));
  }

  // 5. expos request status
  get isLoading() {
    return this.movieListQuery.isLoading;
  }

  get isSuccess() {
    return this.movieListQuery.isSuccess;
  }

  get isError() {
    return this.movieListQuery.isError;
  }

  constructor(private movieRepository: MovieRepository) {
    makeAutoObservable(this);
  }

  // 6. define an action to update source observable: keyword
  searchByKeyword(keyword: string) {
    this.keyword = keyword;
  }
}
```

**Repository**

```typescript
import {QueryClient, QueryKey} from '@jayjnu/mobx-query';

export default class MovieRepository {
  constructor(private queryClient: QueryClient) {}

  useMovieListQuery(keywordQueryKey: QueryKey<string>) {
    return this.queryClient.createQuery({
      name: 'movieList',
      fetch: async ({queryKey}) => {
        const [keyword] = queryKey;

        const res = await fetch(`/api/movies?keyword=${keyword}`);
        const json = await res.json();
        
        return json;
      },
      queryKey: [keywordQueryKey],
      initialData: []
    });
  }
}
```

**App**

```tsx
import {observer} from 'mobx-react-lite';
import {QueryClient} from '@jayjnu/mobx-query';
import MovieStore from './MovieStore';
import MovieRepository from './MovieRepository';
import {KeywordInput} from '~your-awesome-input';

const App = observer(() => {
  // 1.initialize queryClient and store
  const [queryClient] = useState(() => new QueryClient());
  const [store] = useState(() => new MovieStore(new MovieRepository(queryClient)));

  return (
    <div>
      <div>
        <KeywordInput
          // map state to component
          value={store.keyword}
          onSubmit={(nextKeyword) => {

            // dispatch action to store
            store.searchByKeyword(nextKeyword);
          }}
        />
      </div>
      <div>
        {/* map state to ui */}
        {store.movieList.map((model) => {
          return (
            <div key={model.id}>
              <strong>{model.title}</strong>
            </div>
          );
        })}
        {store.isLoading && <div>loading...</div>}
      </div>
    </div>
  )
})
```

That's it! You can notice that there is neither manual assignment of api data to store observable like below,

```typescript
class Store {
  someState = [];
  async fetchSomething() {
    const data = await this.repository.getSomeData();
    // manual state assignment
    runInAction(() => {
      this.someState = data.map(this.createModelFromApiData);
    })
  }
}
```

nor manual data request from component like below.

```typescript
const Component = observer(() => {
  const store = useStore();

  // manual data request
  useEffect(() => {
    store.fetchSomething();
  }, [store]);

  return <>...</>;
})
```

with `mobx-query`, you don't assign values to properties, but you map observable data using the powerful built-in `computed` function. 

You don't worry about when data fetching occurs because it starts right and only when ui needs it.

## Motivation

Current web frontend development has evolved into not managing api responses (aka. Server States) in application. Libraries like react-query, swr, redux-toolkit query provide api caching, so that app developers don't need to worry about implementing complex stuff like api data normalization or cache oneself. 

However, using these libraries in mobx project somewhat feels not right because We, mobx lovers, 
- do not want our application logic belong to a specific library (e.g. React)
- want to keep consistent dependency direction `model -> store -> repository`

For example, here are some typical web project codes for following requirements
- users can see a list of movies
- users can select multiple items of movies, and each selected one should be highlighted
- states of selected movies can be used across application

**`types.ts`**

```typescript
export interface Movie {
  movieId: string;
  title: string;
}
export interface MovieRepository {
  getMovieList(): Promise<Movie[]>;
}
```

**`MovieModel.ts`**

```typescript
import {Movie} from './types';
import {makeAutoObservable} from 'mobx';

export default class MovieModel {
  selected = false;
  constructor(private props: Movie) {
    makeAutoObservable(this);
  }

  select() {
    this.selected = true;
  }

  unselect() {
    this.selected = false;
  }

  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.images[0];
  }
}
```

**`MovieStore.ts`**

```typescript
import {makeAutoObservable} from 'mobx';
import MovieModel from './MovieModel';
import {Movie, MovieRepository} from './types';

export default class MovieStore implements MoviePosterController {
  posters: MoviePosterModel[] = [];
  constructor(private movieRepository: MovieRepository) {
    makeAutoObservable(this);
  }

  async getMovieList() {
    this.posters = this.movieRepository
      .getMovieList()
      .then((posters) => new MovieModel(posters, this));
  }
}
```

**`MovieRepositoryImpl.ts`**

```typescript
import {MovieRepository} from './types';

export default class KoreanMovieRepository implements MovieRepository {
  async getMovieList() {
    return fetch('/api/movies/posters');
  }
}
```

**`MovieListAdmin.tsx`**

```tsx
import {MovieListAdminUI} from '~your-awesome-ui';

const MovieListAdmin = () => {
  const movieStore = useMovieStore();

  useEffect(() => {
    movieStore.getMovieList();
  }, [])

  return <MovieListAdminUI 
    movieList={movieStore.movieList}
    onClickImage={(movie) => movie.selected ? movie.unselect() : movie.select()}
  />
}
```

There, what we are missing is this senario; "what if another ui needs to fetch a movie list?".

To avoid unnecessary network request, we choose to use caching library, here we use react-query.

**`useMovieList.ts`**

```ts
import {useQuery} from 'react-query';

export default function useMovieList() {
  const movieStore = useMovieStore();
  
  const {isLoading, ...} = useQuery('movieList', async () => {
    return movieStore.getMovieList();
  }, []);

  return {
    isLoding,
    data: movieStore.list
  };
}
```

After defining our new query hook, we need to use it in two ui components.

```tsx
import {MovieListAdminUI, MovieListUI} from '~your-awesome-ui';

const MovieListAdmin = observer(() => {
  //
  const {isLoading, data} = useMovieList();

  return <MovieListAdminUI 
    movieList={data}
    onClickImage={(movie) => movie.selected ? movie.unselect() : movie.select()}
  />
});

const MovieList = observer(() => {
  //
  const {isLoading, data} = useMovieList();

  return <MovieListUI 
    movieList={movieList}
    onClickImage={(movie) => movie.selected ? movie.unselect() : movie.select()}
  />
});
```

It feels like we solved all the problems, but here comes new problems.

to be continued...


## Core Concepts

### Query
to be continued...

### Mutation
to be continued...
