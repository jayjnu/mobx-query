export const defineSafeContextHook = <T>(name: string, factory: () => T | null): () => T | never => {

  return () => {
    const contextValue = factory();

    if (contextValue === null) {
      throw new Error(`${name} hook should be called inside ${name}Provider`);
    }

    return contextValue;
  };
};