import * as React from 'react';
import { ChevronDoubleDownIcon, PlusIcon } from '@heroicons/react/solid';

import { Button } from '../../../components/Elements/Button';
import { SearchBar } from './SearchBar';
import { IngredientsMenu } from './IngredientsMenu';
import { useSearch } from '../stores/search';
import { NewRecipeMenu } from './NewRecipeMenu';

interface ToggleProps {
  open: boolean;
}

const ShowOptionsToggle = ({ open }: ToggleProps) => {
  return (
    <div className='p-0.5 rounded-lg border-2 transition-colors border-gray-700'>
      <ChevronDoubleDownIcon className={`h-6 w-6 text-gray-700 transition-transform ${open && 'rotate-180'}`} />
    </div>
  );
};

export const Header = () => {
  const [open, setOpen] = React.useState(false);
  const [recipeMenuOpen, setRecipeMenuOpen] = React.useState(false);
  const [ingredientsMenuOpen, setIngredientsMenuOpen] = React.useState(false);
  const { recipeSearch, setRecipeSearch } = useSearch();

  const handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    setRecipeSearch(event.currentTarget.value);
  };

  return (
    <>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-4 py-1.5 sm:rounded-md shadow'>
        {/* TODO extract to component */}
        <div onClick={() => setOpen(!open)} className='flex items-center justify-between cursor-pointer group'>
          <h1 className='font-bold text-2xl mt-0.5 sm:mt-0'>Your recipes</h1>
          <ShowOptionsToggle open={open} />
        </div>
        <div className={!open ? 'hidden' : 'flex flex-col justify-between gap-2'}>
          <SearchBar
            value={recipeSearch}
            changeHandler={handleSearchChange}
            placeholder="Search your recipes..."
          />
          <div className='flex flex-col sm:flex-row justify-between gap-2'>
            <Button
              variant='primaryBlack'
              onClick={() => setRecipeMenuOpen(true)}
            // TODO onClick open new ingredients modal, multiple steps (advance with 'next' button, return to step 1 on close)
            >
              <PlusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              New recipe
            </Button>
            <Button
              variant='inverseBlack'
              onClick={() => setIngredientsMenuOpen(true)}
            >
              Ingredients menu
            </Button>
          </div>
        </div>
      </div>
      <NewRecipeMenu open={recipeMenuOpen} setOpen={setRecipeMenuOpen} />
      <IngredientsMenu open={ingredientsMenuOpen} setOpen={setIngredientsMenuOpen} />
    </>
  );
};