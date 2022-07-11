export interface Unit {
  id: string;
  name: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
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

export interface User {
  id: string;
  username: string;
  email: string;
}