export interface Unit {
  id: string;
  name: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  unitName: string;
}

// specific to users; no foreign key added though,
// users will only see their own fridge contents
export interface FridgeEntry {
  id: string;
  ingredient: Ingredient;
  quantity: number;
  info?: string;
}

export interface IngredientAmountDTO {
  amount: number;
  ingredient: string; // ingredient name
  ingredientId: string;
}

export interface Recipe {
  id: string;
  user: string;
  title: string;
  content: string;  // TODO check if long content can be stored on a string
  cookMinutes?: number;
  imageUrl?: string;
  ingredients: IngredientAmountDTO[];
}

// TODO model this properly, this is ugly af
export interface RecipeDTO {
  id?: string;
  user: string;
  title: string;
  content: string;
  cookMinutes?: number;
  imageUrl?: string;
  ingredients: {
    amount: number;
    ingredient: string; // is
  }[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}