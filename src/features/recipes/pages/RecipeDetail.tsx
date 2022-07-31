import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/outline';

import { Spinner } from '@/components/Elements/Spinner';

import { DEFAULT_RECIPE_IMG_URL } from '@/config';
import { useFetch } from '@/hooks/useFetch';
import { useStore } from '@/store/useStore';

// TODO fix 404 error on API
export const RecipeDetail = () => {
  const recipeId = useParams().id;
  const recipe = useStore(state => state.recipes).find(recipe => recipe.id === recipeId);
  const addRecipe = useStore(state => state.addRecipe);
  const { response, error, isLoading } = useFetch(`/recipes/${recipeId}`);

  React.useEffect(() => {
    document.title = recipe ? `Cookie - ${recipe.title}` : 'Cookie - Recipes';
  }, [recipe]);

  React.useEffect(() => {
    if (response) {
      addRecipe(response.data);
    }
  }, [response]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!recipe && !error) {
    // TODO 404 page
    return <div>No recipe 404</div>;
  }

  if (!recipe) {
    // TODO unknown error page
    return <div>Unknown error</div>;
  }

  return (
    <div className='p-4'>
      <img
        src={recipe.imageUrl ?? DEFAULT_RECIPE_IMG_URL}
        alt={recipe.title}
        className="rounded-lg"
      />
      <div className='flex items-center justify-between mt-3'>
        <h3 className="font-semibold text-2xl">{recipe.title}</h3>
        {recipe.cookMinutes && (
          // TODO calories, ...
          <div className="flex items-center justify-start text-gray-700">
            <ClockIcon className="h-5 w-5 mr-1 text-violet-800" />
            {recipe.cookMinutes} minutes
          </div>
        )}
      </div>
      <h4 className='mt-2 font-semibold'>Ingredients</h4>
      <ul className="list-disc pl-4">
        {recipe.ingredients.map(ingredient => (
          <li key={ingredient.ingredientId}>
            {ingredient.amount} {ingredient.ingredient}
          </li>
        ))}
      </ul>
      <p className="mt-3 max-w-prose">
        {recipe.content}
      </p>
    </div>
  );
};