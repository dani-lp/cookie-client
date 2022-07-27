import * as React from 'react';
import shallow from 'zustand/shallow';

import { Button } from '../../../components/Elements/Button';
import { InputField } from '../../../components/Form';
import { SlideOver } from '../../../components/Overlay';
import { UnitSelector } from './UnitSelector';
import { axios } from '../../../lib/axios';
import { useStore } from '../../../store/useStore';
import { Ingredient } from '../../../types';
import { useFetch } from '../../../hooks/useFetch';
import { Spinner } from '../../../components/Elements/Spinner';


// TODO move functionality into IngredientList.tsx
const IngredientList = () => {
  const { ingredients, loadIngredients } = useStore((state) => ({
    ingredients: state.ingredients,
    loadIngredients: state.loadIngredients,
  }), shallow);

  // TODO evaluate performance
  const sortedIngredients = () => {
    const copy = ingredients.slice();
    copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  };

  const { response, isLoading, error } = useFetch('/ingredients');

  React.useEffect(() => {
    if (response) {
      const newIngredients = response.data as Ingredient[];
      newIngredients.sort((a, b) => a.name.localeCompare(b.name));
      loadIngredients(newIngredients);
    }
  }, [response]);

  const getContent = () => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center h-full text-lg'>
          <Spinner size='lg' />
        </div>
      );
    }
    if (error) {
      // TODO improve error message
      return (
        <span className='flex items-center justify-center h-full text-lg'>
          There has been an error!
        </span>
      );
    }
    return ingredients.length > 0
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
      );
  };

  return (
    <>
      <h3 className='mt-12'>Ingredient list</h3>
      <div className='mt-1'>
        <ul className='border-2 border-gray-300 w-full overflow-y-auto h-44 rounded-lg shadow-sm divide-y-2 divide-gray-200'>
          {getContent()}
        </ul>
      </div>
    </>
  );
};

interface IngredientsMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface IngredientResponse {
  data: Ingredient;
}

// TODO check if the logic can be extracted into a custom hook
export const IngredientsMenu = ({ open, setOpen }: IngredientsMenuProps) => {
  const { units, addIngredient } = useStore((state) => ({
    units: state.units,
    ingredients: state.ingredients,
    addIngredient: state.addIngredient,
    loadIngredients: state.loadIngredients,
  }), shallow);
  const [ingredientName, setIngredientName] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [selectedUnit, setSelectedUnit] = React.useState(units.length > 0 ? units[0].id : '');
  const [loading, setLoading] = React.useState(false);

  const ingredientHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormError('');
    setIngredientName(event.currentTarget.value);
  };

  const handleCreateIngredient = async (event: React.MouseEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!ingredientName) {
      setFormError('Please add an ingredient name!');
      setLoading(false);
      return;
    }

    const newIngredient = {
      name: ingredientName,
      unit: selectedUnit,
    };

    // TODO move to hook
    axios.post('/ingredients', newIngredient)
      .then((result: IngredientResponse) => {
        addIngredient(result.data);
        setIngredientName('');
        setFormError('');
      }).catch(formError => {
        console.error(formError);
        // TODO set formError types
        setFormError('Unknown formError! Sorry...');
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <SlideOver open={open} setOpen={setOpen} title="Ingredients and units">
      <h3 className='mb-2 font-semibold'>Create ingredient</h3>
      <InputField
        value={ingredientName}
        onChange={ingredientHandler}
        placeholder="Ingredient name..."
        className={formError ? 'mb-0' : 'mb-3'}
      >
        {formError && <span className='w-full'>{formError}</span>}
      </InputField>

      <h4 className='text-sm'>Measurement unit</h4>
      <UnitSelector
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
      />
      <Button
        className='w-full mt-4'
        onClick={handleCreateIngredient}
        disabled={loading}
      >
        Add ingredient
      </Button>

      <IngredientList />
    </SlideOver>
  );
};