import create from 'zustand';

interface SearchState {
  recipeSearch: string;
  setRecipeSearch: (recipeSearch: string) => void;
  unitSearch: string;
  setUnitSearch: (unitSearch: string) => void;
}

export const useSearch = create<SearchState>((set) => ({
  recipeSearch: '',
  setRecipeSearch: (recipeSearch) => set(() => ({ recipeSearch })),
  unitSearch: '',
  setUnitSearch: (unitSearch) => set(() => ({ unitSearch })),
}));