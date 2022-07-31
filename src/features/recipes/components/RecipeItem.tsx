import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/outline';

import { Recipe } from '@/types';
import { DEFAULT_RECIPE_IMG_URL } from '@/config';

interface RecipeItemProps {
  recipe: Recipe;
}

export const RecipeItem = ({ recipe }: RecipeItemProps) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <div onClick={handleClick} className="bg-white max-w-md w-full rounded-md shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
      {/* TODO custom images */}
      <img
        src={recipe.imageUrl ?? DEFAULT_RECIPE_IMG_URL}
        alt={recipe.title}
        className="w-full h-52 object-cover"
      />
      <div className="p-4 bg-violet-100">
        {recipe.cookMinutes && (
          // TODO calories, ...
          <div className="flex items-center justify-start mb-1 text-sm text-gray-700">
            <ClockIcon className="h-5 w-5 mr-1 text-violet-800" />
            {recipe.cookMinutes} minutes
          </div>
        )}
        {/* TODO character limit */}
        <h4 className="font-semibold text-xl">{recipe.title}</h4>
        <p className="text-gray-800">
          {recipe.content.substring(0, 150)}{recipe.content.length > 150 && '...'}
        </p>
      </div>

    </div>
  );
};