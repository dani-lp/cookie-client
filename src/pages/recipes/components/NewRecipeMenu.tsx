import * as React from 'react';
import shallow from 'zustand/shallow';
import { Dialog } from '@headlessui/react';
import {
  BookmarkAltIcon,
  ClipboardListIcon,
  DocumentTextIcon,
  PlusIcon,
  XIcon
} from '@heroicons/react/outline';

import { Modal } from '../../../components/Overlay';
import { Button } from '../../../components/Elements/Button';
import { InputField } from '../../../components/Form';
import { Breadcrumbs, BreadcrumbsElement } from '../../../components/Elements/Breadcrumbs';
import { TextareaField } from '../../../components/Form/TextareaField';

import { IngredientList } from './IngredientList';
import { useFetch } from '../../../hooks/useFetch';
import { useStore } from '../../../store/useStore';
import { axios } from '../../../lib/axios';
import { Ingredient, IngredientAmountDTO, Recipe, RecipeDTO } from '../../../types';


type ModalState = 0 | 1 | 2;

type MenuSteps = 'title' | 'cookMinutes' | 'imageUrl' | 'amount' | 'content';

interface NewRecipeResponse {
  data: Recipe;
}

interface MenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const recipeBase = {
  id: '',
  user: '',
  title: '',
  content: '',
  cookMinutes: undefined,
  imageUrl: undefined,
  ingredients: [],
};

export const NewRecipeMenu = ({ open, setOpen }: MenuProps) => {
  const [step, setStep] = React.useState<ModalState>(0);
  const [recipe, setRecipe] = React.useState<Recipe>(recipeBase);
  const [selectedIngredientId, setSelectedIngredientId] = React.useState<string>('');
  const [ingredientAmount, setIngredientAmount] = React.useState(1);

  const { ingredients, loadIngredients, addRecipe } = useStore((state) => ({
    ingredients: state.ingredients,
    loadIngredients: state.loadIngredients,
    addRecipe: state.addRecipe,
  }), shallow);

  const listedIngredients = ingredients.filter(ingredient => {
    return !recipe.ingredients.map(i => i.ingredientId).includes(ingredient.id);
  });

  const { response } = useFetch('/ingredients');

  React.useEffect(() => {
    if (response) {
      console.log(response);

      const newIngredients = response.data as Ingredient[];
      newIngredients.sort((a, b) => a.name.localeCompare(b.name));
      loadIngredients(newIngredients);
      if (newIngredients.length > 0) {
        setSelectedIngredientId(newIngredients[0].id);
      }
    }
  }, [response]);

  // TODO is this good UX?
  React.useEffect(() => {
    if (!open) {
      setRecipe(recipeBase);
      if (ingredients.length > 0) setSelectedIngredientId(ingredients[0].id);
      setIngredientAmount(1);
      setStep(0);
    }
  }, [open]);

  const steps = [
    { name: 'Recipe', icon: BookmarkAltIcon, clickCallback: () => setStep(0), selected: step === 0 },
    { name: 'Ingredients', icon: ClipboardListIcon, clickCallback: () => setStep(1), selected: step === 1 },
    { name: 'Steps', icon: DocumentTextIcon, clickCallback: () => setStep(2), selected: step === 2 },
  ] as BreadcrumbsElement[];

  // TODO use 'name' attribute
  const handleFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, field: MenuSteps) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    if (name === 'amount') {
      setIngredientAmount(parseInt(value));
      return;
    }
    setRecipe({
      ...recipe,
      [name]: value
    });

    switch (field) {
      case 'title':
        setRecipe({ ...recipe, title: value });
        break;
      case 'cookMinutes': {
        setRecipe({ ...recipe, cookMinutes: parseInt(value) });
        break;
      }
      case 'imageUrl':
        // TODO URL validation
        setRecipe({ ...recipe, imageUrl: value });
        break;
      case 'content':
        setRecipe({ ...recipe, content: value });
        break;
      case 'amount':
        setIngredientAmount(parseInt(value));
        break;
      default:
        break;
    }
  };

  const handleAddIngredient = (event: React.FormEvent) => {
    event.preventDefault();

    if (listedIngredients.length === 0) return;

    if (selectedIngredientId) {
      setRecipe({
        ...recipe, ingredients: recipe.ingredients.concat({
          amount: ingredientAmount,
          ingredient: ingredients.find(ingredient => ingredient.id === selectedIngredientId)?.name,
          ingredientId: selectedIngredientId,
        } as IngredientAmountDTO)
      });
    }

    const newListedIngredients = listedIngredients.filter(ingredient => ingredient.id !== selectedIngredientId);
    if (newListedIngredients.length > 0) setSelectedIngredientId(newListedIngredients[0].id);
    else setSelectedIngredientId('');
    setIngredientAmount(1);
  };

  const handleRemoveIngredient = (event: React.MouseEvent, ingredient: IngredientAmountDTO) => {
    event.preventDefault();

    setRecipe({ ...recipe, ingredients: recipe.ingredients.filter(i => i !== ingredient) });

    const newListedIngredients = listedIngredients.concat(ingredients.filter(i => i.id === ingredient.ingredientId));
    if (newListedIngredients.length > 0) setSelectedIngredientId(newListedIngredients[0].id);
  };

  const formIsValid = () => {
    return recipe.title.length > 0
      && recipe.cookMinutes
      && recipe.cookMinutes > 0
      && recipe.content.length > 0
      && recipe.ingredients.length > 0;
  };

  const handleCreateRecipe = async () => {
    try {
      const newRecipe: RecipeDTO = {
        ...recipe, ingredients: recipe.ingredients.map(r => ({
          amount: r.amount,
          ingredient: r.ingredientId,
        }))
      };
      delete newRecipe['id'];

      const response: NewRecipeResponse = await axios.post('/recipes', newRecipe);
      if (formIsValid()) {
        addRecipe(response.data);
      }
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextButton = () => {
    switch (step) {
      case 0:
        if (recipe.title.length > 0) {
          setStep(1);
          break;
        }
        // TODO error message
        break;
      case 1:
        if (recipe.ingredients.length > 0) {
          setStep(2);
          break;
        }
        // TODO error message
        break;
      case 2:
        handleCreateRecipe();
        break;
    }
  };

  const content = (step: ModalState) => {
    switch (step) {
      case 0:
        return (
          <>
            <h3 className='mb-2 font-semibold text-xl text-violet-900'>Some basic information</h3>
            <InputField
              label="Recipe name*"
              name="title"
              value={recipe.title}
              onChange={(e) => handleFormChange(e, 'title')}
              className="mb-3"
              autoFocus={false}
            />
            <InputField
              label="Cooking minutes"
              type="number"
              name="cookMinutes"
              value={recipe.cookMinutes?.toString()}
              onChange={(e) => handleFormChange(e, 'cookMinutes')}
              className="mb-3"
            />
            <InputField
              label="Image URL"
              name="imageUrl"
              value={recipe.imageUrl}
              onChange={(e) => handleFormChange(e, 'imageUrl')}
              className="mb-3"
            />
          </>
        );
      case 1:
        return (
          <>
            <h3 className='mb-2 font-semibold text-xl text-violet-900'>Pick some ingredients!</h3>
            <IngredientList
              ingredients={listedIngredients}
              selectedIngredientId={selectedIngredientId}
              setSelectedIngredientId={setSelectedIngredientId}
              className="mb-3"
            />
            <div className='mt-1'>
              <form onSubmit={handleAddIngredient} className="flex items-end justify-between gap-2">
                <InputField
                  label="Amount"
                  type="number"
                  name="amount"
                  value={ingredientAmount.toString()}
                  onChange={(e) => handleFormChange(e, 'amount')}
                />
                <Button className="w-4 rounded-md mb-[1px]" type="submit" squared>
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </form>
            </div>
            <div className='flex flex-wrap items-center justify-start gap-2 mt-1'>
              {recipe.ingredients.map(ingredient => (
                <div
                  key={ingredient.ingredientId}
                  className="bg-violet-300 shadow-sm rounded-full px-2 py-0.5 flex items-center justify-center gap-1"
                >
                  {ingredient.ingredient}
                  <div
                    onClick={(e) => handleRemoveIngredient(e, ingredient)}
                    className="rounded-full p-0.5 hover:bg-violet-700 cursor-pointer hover:text-white transition-colors"
                  >
                    <XIcon className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className='mb-2 font-semibold text-xl text-violet-900'>And finally, some content</h3>
            <TextareaField
              rows={10}
              value={recipe.content}
              onChange={(e) => handleFormChange(e, 'content')}
            />
          </>
        );
      default:
        return null;
    }
  };

  // TODO maintain proper format on content textarea
  // TODO validation between step changes

  return (
    <Modal open={open} setOpen={setOpen} className="min-h-[24rem] h-[28rem]">
      <div className="bg-white px-2 pt-3">
        <div>
          <Dialog.Title className="mb-3 bg-violet-100 rounded-lg shadow px-3 py-2">
            <Breadcrumbs elements={steps} />
          </Dialog.Title>
        </div>
      </div>

      <div className='px-3 mb-20 max-h-96 overflow-y-auto'>
        {content(step)}
      </div>

      <div className="absolute bottom-0 h-16 w-full bg-gray-50 px-4 py-3 sm:px-6 flex flex-1 items-center justify-around">
        <Button
          size='sm'
          className='w-32'
          variant='inverseBlack'
          onClick={() => { if (step > 0) setStep(step - 1 as ModalState); }}
          disabled={step === 0}
        >
          Previous
        </Button>
        <Button
          size='sm'
          className='w-32'
          onClick={handleNextButton}
        >
          {step < 2 ? 'Next' : 'Create'}
        </Button>
      </div>
    </Modal>
  );
};