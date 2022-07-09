export interface Unit {
  id: string;
  unit: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
}

// specific to users; no foreign key added though,
// users will only see their own fridge contents
export interface FridgeEntry {
  id: string;
  ingredient: Ingredient;
  quantity: number;
  info?: string;
}

export interface Recipe {
  id: string;
  user: User;
  ingredients: Ingredient[];
  title: string;
  content: string;  // TODO check if long content can be stored on a string
  cookMinutes?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}