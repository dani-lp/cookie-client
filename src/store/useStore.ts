import create, { StateCreator } from 'zustand';
import { Ingredient, Recipe, Unit, User } from '../types';

interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
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
  addIngredient: (ingredient: Ingredient) => void;
}
const createIngredientSlice: StateCreator<IngredientSlice, [], []> = (set) => ({
  ingredients: [
    {
      id: '1',
      name: 'Eggs',
      unit: ''
    },
    {
      id: '2',
      name: 'Tacos',
      unit: ''
    },
    {
      id: '3',
      name: 'Salt',
      unit: ''
    },
  ],
  loadIngredients: (ingredients) => set(() => ({ ingredients })),
  addIngredient: (ingredient) => set((state) => ({ ingredients: state.ingredients.concat(ingredient) })),
});

interface RecipeSlice {
  recipes: Recipe[];
  loadRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
}
const createRecipeSlice: StateCreator<RecipeSlice, [], []> = (set) => ({
  recipes: [],
  loadRecipes: (recipes) => set(() => ({ recipes })),
  addRecipe: (recipe) => set((state) => (
    state.recipes.some(r => r.id === recipe.id)
      ? state
      : ({ recipes: state.recipes.concat(recipe) })
  )),
});

export const useStore = create<UserSlice & UnitSlice & IngredientSlice & RecipeSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createUnitSlice(...a),
  ...createIngredientSlice(...a),
  ...createRecipeSlice(...a),
}));