import * as React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDoubleDownIcon, PlusIcon } from '@heroicons/react/solid';

import { SearchBar } from './SearchBar';
import { IngredientsMenu } from './IngredientsMenu';
import { useSearch } from '../stores/search';
import { NewRecipeMenu } from './NewRecipeMenu';

import { Button } from '@/components/Elements/Button';

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
  const [recipeMenuOpen, setRecipeMenuOpen] = React.useState(false);
  const [ingredientsMenuOpen, setIngredientsMenuOpen] = React.useState(false);
  const { recipeSearch, setRecipeSearch } = useSearch();

  const handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    setRecipeSearch(event.currentTarget.value);
  };

  return (
    <>
      <Disclosure>
        {({ open }: { open: boolean }) => (
          <header className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white sm:rounded-md shadow h-full transition-all duration-100 ${open ? 'max-h-52' : 'max-h-12'}`}>
            <Disclosure.Button as='div' className='flex items-center justify-between cursor-pointer group px-4 py-1.5 z-10 bg-white'>
              <h1 className='font-bold text-2xl mt-0.5 sm:mt-0'>Your recipes</h1>
              <ShowOptionsToggle open={open} />
            </Disclosure.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform -translate-y-32"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition duration-100 ease-out"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform -translate-y-32 opacity-0"
            >
              <Disclosure.Panel className="flex flex-col justify-between gap-2 px-4 pb-1.5">
                <SearchBar
                  value={recipeSearch}
                  changeHandler={handleSearchChange}
                  placeholder="Search your recipes..."
                />
                <div className='flex flex-col sm:flex-row justify-between gap-2'>
                  <Button
                    variant='primaryBlack'
                    onClick={() => setRecipeMenuOpen(true)}
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
              </Disclosure.Panel>
            </Transition>
          </header>
        )}
      </Disclosure>
      <NewRecipeMenu open={recipeMenuOpen} setOpen={setRecipeMenuOpen} />
      <IngredientsMenu open={ingredientsMenuOpen} setOpen={setIngredientsMenuOpen} />
    </>
  );
};