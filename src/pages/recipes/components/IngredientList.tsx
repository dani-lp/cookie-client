import * as React from 'react';

import { SearchBar } from './SearchBar';
import { Ingredient } from '../../../types';


interface IngredientListProps {
  ingredients: Ingredient[];
  selectedIngredient: Ingredient | null;
  setSelectedIngredient: (ingredient: Ingredient | null) => void;
  className?: string;
}

export const IngredientList = ({ ingredients, selectedIngredient, setSelectedIngredient, className }: IngredientListProps) => {
  const [search, setSearch] = React.useState('');

  const handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearch(event.currentTarget.value);
  };

  // TODO show full name (ingredient + unit)
  // TODO evaluate performance
  const sortedIngredients = () => {
    const filteredIngredients = search.length > 0
      ? ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(search.toLowerCase()))
      : ingredients;
    const copy = filteredIngredients.slice();
    copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  };

  return (
    <div className={className}>
      <SearchBar
        value={search}
        changeHandler={handleSearchChange}
        placeholder="Ingredient..."
        className='my-1 mb-1.5'
      />
      <div className='mt-1'>
        <ul className='border-2 border-gray-300 w-full overflow-y-auto h-32 rounded-lg shadow-sm divide-y-2 divide-gray-200'>
          {ingredients.length > 0
            ? (sortedIngredients().map(ingredient => (
              <li
                key={ingredient.id}
                className={`px-4 py-2 ${selectedIngredient?.id === ingredient.id ? 'bg-violet-500 text-white font-semibold' : 'hover:bg-violet-200 cursor-pointer'}`}
                onClick={() => setSelectedIngredient(ingredient)}
              >
                {`${ingredient.name} ${ingredient.unitName !== 'Unit' ? `(${ingredient.unitName})` : ''}`}
              </li>
            )))
            : (
              <span className='flex items-center justify-center h-full text-lg'>
                There are no ingredients!
              </span>
            )}
        </ul>
      </div>
    </div>
  );
};