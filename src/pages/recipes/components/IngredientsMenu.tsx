import * as React from 'react';
import shallow from 'zustand/shallow';

import { Button } from '../../../components/Elements/Button';
import { InputField } from '../../../components/Form';
import { SlideOver } from '../../../components/Overlay';
import { UnitSelector } from './UnitSelector';
import { axios } from '../../../lib/axios';
import { useStore } from '../../../store/useStore';
import { Ingredient } from '../../../types';

interface IngredientsMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface IngredientResponse {
  data: Ingredient;
}

// TODO check if the logic can be extracted into a custom hook
export const IngredientsMenu = ({ open, setOpen }: IngredientsMenuProps) => {
  const { units, ingredients, addIngredient } = useStore((state) => ({
    units: state.units,
    ingredients: state.ingredients,
    addIngredient: state.addIngredient,
  }), shallow);
  const [ingredientName, setIngredientName] = React.useState('');
  const [error, setError] = React.useState('');
  const [selectedUnit, setSelectedUnit] = React.useState(units.length > 0 ? units[0].id : '');
  const [loading, setLoading] = React.useState(false);

  const ingredientHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setIngredientName(event.currentTarget.value);
  };

  const createHandler = async (event: React.MouseEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!ingredientName) {
      setError('Please add an ingredient name!');
      setLoading(false);
      return;
    }

    const newIngredient = {
      name: ingredientName,
      unit: selectedUnit,
    };

    axios.post('/ingredients', newIngredient)
      .then((result: IngredientResponse) => {
        addIngredient(result.data);
      }).catch(error => {
        console.error(error);
        // TODO set error types
        setError('Unknown error! Sorry...');
      }).finally(() => {
        setLoading(false);
      });
  };

  // TODO evaluate performance
  const sortedIngredients = () => {
    const copy = ingredients.slice();
    copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  };

  return (
    <SlideOver open={open} setOpen={setOpen} title="Ingredients and units">
      <h3 className='mb-2'>Create ingredient</h3>
      <InputField
        value={ingredientName}
        onChange={ingredientHandler}
        placeholder="Ingredient name..."
        className={error ? 'mb-0' : 'mb-3'}
      >
        {error && <span className='w-full'>{error}</span>}
      </InputField>
      <h4 className='text-sm'>Measurement unit</h4>
      <UnitSelector
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
      />
      <Button
        className='w-full mt-4'
        onClick={createHandler}
        disabled={loading}
      >
        Add ingredient
      </Button>

      <h3 className='mt-12'>Ingredient list</h3>
      <div className='mt-1'>
        <ul className='border-2 border-gray-300 w-full overflow-y-auto h-44 rounded-lg shadow-sm divide-y-2 divide-gray-200'>
          {ingredients.length > 0
            ? (sortedIngredients().map(ingredient => (
              <li
                key={ingredient.id}
                className="px-4 py-2"
              >
                {ingredient.name}
              </li>
            )))
            : (
              <span className='flex items-center justify-center h-full text-lg'>
                There are no ingredients!
              </span>
            )
          }
        </ul>
      </div>
    </SlideOver>
  );
};