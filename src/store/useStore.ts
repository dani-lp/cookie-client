import create, { StateCreator } from 'zustand';
import { Ingredient, Recipe, Unit, User } from '../types';

interface UserSlice {
  user: User | null;
  setUser: (user: User) => void;
}
const createUserSlice: StateCreator<UserSlice, [], []> = (set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
});

interface UnitSlice {
  units: Unit[];
  loadUnits: (units: Unit[]) => void;
  addUnit: (unit: Unit) => void;
  removeUnit: (unitId: string) => void;
}
const createUnitSlice: StateCreator<UnitSlice, [], []> = (set) => ({
  units: [],
  loadUnits: (units) => set(() => ({ units })),
  addUnit: (unit) => set((state) => ({ units: state.units.concat(unit) })),
  removeUnit: (unitId) => set((state) => ({ units: state.units.filter(unit => unit.id !== unitId) }))
});

interface IngredientSlice {
  ingredients: Ingredient[];
  loadIngredients: (ingredients: Ingredient[]) => void;
}
const createIngredientSlice: StateCreator<IngredientSlice, [], []> = (set) => ({
  ingredients: [],
  loadIngredients: (ingredients) => set(() => ({ ingredients })),
});

interface RecipeSlice {
  recipes: Recipe[];
  loadRecipes: (recipes: Recipe[]) => void;
}
const createRecipeSlice: StateCreator<RecipeSlice, [], []> = (set) => ({
  recipes: [],
  loadRecipes: (recipes) => set(() => ({ recipes })),
});

export const useStore = create<UserSlice & UnitSlice & IngredientSlice & RecipeSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createUnitSlice(...a),
  ...createIngredientSlice(...a),
  ...createRecipeSlice(...a),
}));