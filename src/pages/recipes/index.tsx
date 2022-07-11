import * as React from 'react';
import shallow from 'zustand/shallow';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

import { Header } from './components';
import { RecipeItem } from './components/RecipeItem';
import { Spinner } from '../../components/Elements/Spinner';
import { useStore } from '../../store/useStore';
import { useSearch } from './stores/search';
import { useFetch } from '../../hooks/useFetch';
import { Recipe } from '../../types';

// TODO list of the user's recipes (saved + created), with filters
export const Recipes = () => {
  const { recipes, loadRecipes } = useStore((state) => ({
    recipes: state.recipes,
    loadRecipes: state.loadRecipes,
  }), shallow);
  const search = useSearch(state => state.search);
  const { response, error, isLoading } = useFetch('/recipes');

  // TODO use Helmet
  React.useEffect(() => {
    document.title = 'Cookie - Recipes';
  }, []);

  React.useEffect(() => {
    if (response) {
      const newUnits = response.data as Recipe[];
      loadRecipes(newUnits);
    }
  }, [response]);

  const filteredRecipes = search.length > 0
    ? recipes.filter(recipe => recipe.title.toLowerCase().includes(search.toLowerCase()))
    : recipes;

  const content = () => {
    if (error) {
      // TODO error types
      return (
        <div className='p-2 h-full flex flex-col items-center justify-center'>
          <ExclamationCircleIcon className='h-16 w-16 text-red-500' />
          <h3 className='text-lg font-semibold'>Sorry, there was an error!</h3>
          <p>Please try again later.</p>
        </div>
      );
    } else if (isLoading) {
      return (
        <div className='p-2 h-full flex flex-col items-center justify-center gap-4'>
          <Spinner size='lg' />
          <h3>Your recipes are loading...</h3>
        </div>
      );
    } else {
      return filteredRecipes.map(recipe => <RecipeItem key={recipe.id} recipe={recipe} />);
    }
  };

  return (
    <>
      <Header />
      <div className={`p-2 ${(!isLoading || error) && 'h-3/4'}`}>
        {content()}
      </div>
    </>
  );
};