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

import { IngredientList } from './IngredientList';

import { Modal } from '@/components/Overlay';
import { Button } from '@/components/Elements/Button';
import { InputField } from '@/components/Form';
import { Breadcrumbs, BreadcrumbsElement } from '@/components/Elements/Breadcrumbs';
import { TextareaField } from '@/components/Form';

import { useFetch } from '@/hooks/useFetch';
import { useStore } from '@/store/useStore';
import { axios } from '@/lib/axios';
import {
  Ingredient,
  IngredientAmountDTO,
  Recipe,
  RecipeDTO
} from '@/types';


type ModalStep = 'initial' | 'ingredients' | 'content';
type Action =
  | { type: 'toInitial', payload: null }
  | { type: 'toIngredients', payload: null }
  | { type: 'toContent', payload: null }
  | { type: 'toPrevious', payload: null }
  | { type: 'toNext', payload: null }
  | { type: 'updateRecipe', payload: Recipe }

interface ModalState {
  recipe: Recipe;
  step: ModalStep;
}

type MenuField = 'title' | 'cookMinutes' | 'imageUrl' | 'amount' | 'content';

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
  imageUrl: '',
  ingredients: [],
};

const canMove = (from: ModalStep, to: ModalStep, recipe: Recipe) => {
  const initialOk = recipe.title.length > 0;
  const ingredientsOk = recipe.ingredients.length > 0;

  if (to === 'content') return initialOk && ingredientsOk;
  if (from === 'initial' && to === 'ingredients') return initialOk;
  return true;
};

// The return type is explicitly set because ts can't infer it
const stepReducer = (state: ModalState, action: Action): ModalState => {
  const { recipe, step } = state;
  const { type, payload } = action;

  switch (type) {
    case 'toInitial':
      // if (!canMove(step, 'initial', recipe)) return state; // not necessary for now
      return { ...state, step: 'initial' };

    case 'toIngredients':
      if (!canMove(step, 'ingredients', recipe)) return state;  // TODO set warning
      return { ...state, step: 'ingredients' };

    case 'toContent':
      if (!canMove(step, 'content', recipe)) return state;  // TODO set warning
      return { ...state, step: 'content' };

    case 'toPrevious':
      if (!canMove(step, step === 'ingredients' ? 'initial' : 'ingredients', recipe)) return state;  // TODO set warning
      if (step === 'ingredients') return { ...state, step: 'initial' };
      if (step === 'content') return { ...state, step: 'ingredients' };
      return state;

    case 'toNext':
      if (!canMove(step, step === 'initial' ? 'ingredients' : 'content', recipe)) return state;  // TODO set warning
      if (step === 'initial') return { ...state, step: 'ingredients' };
      if (step === 'ingredients') return { ...state, step: 'content' };
      return state;

    case 'updateRecipe':
      return { ...state, recipe: payload };

    default:
      return state;
  }
};


interface ModalContentProps {
  recipe: Recipe;
  onFormChange: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InitialContent = ({ recipe, onFormChange }: ModalContentProps) => {
  return (
    <>
      <h3 className='mb-2 font-semibold text-xl text-violet-900'>Some basic information</h3>
      <InputField
        label="Recipe name*"
        name="title"
        value={recipe.title}
        onChange={onFormChange}
        className="mb-3"
        autoFocus={false}
      />
      <InputField
        label="Cooking minutes"
        type="number"
        name="cookMinutes"
        value={recipe.cookMinutes === undefined ? '' : recipe.cookMinutes.toString()}
        onChange={onFormChange}
        className="mb-3"
      />
      <InputField
        label="Image URL"
        name="imageUrl"
        value={recipe.imageUrl}
        onChange={onFormChange}
        className="mb-3"
      />
    </>
  );
};

type IngredientContentProps = Omit<ModalContentProps, 'onFormChange'> & {
  dispatchStep: React.Dispatch<Action>;
}

const IngredientsContent = (
  {
    recipe,
    dispatchStep,
  }: IngredientContentProps
) => {
  const [selectedIngredientId, setSelectedIngredientId] = React.useState<string>('');
  const [ingredientAmount, setIngredientAmount] = React.useState(1);
  const ingredients = useStore(state => state.ingredients);

  const listedIngredients = ingredients.filter(ingredient => !recipe.ingredients.map(i => i.ingredientId).includes(ingredient.id));


  const handleAddIngredient = (event: React.FormEvent) => {
    event.preventDefault();

    if (listedIngredients.length === 0) return;

    if (selectedIngredientId) {
      dispatchStep({
        type: 'updateRecipe', payload: {
          ...recipe, ingredients: recipe.ingredients.concat({
            amount: ingredientAmount,
            ingredient: ingredients.find(ingredient => ingredient.id === selectedIngredientId)?.name,
            ingredientId: selectedIngredientId,
          } as IngredientAmountDTO)
        }
      });
    }

    const newListedIngredients = listedIngredients.filter(ingredient => ingredient.id !== selectedIngredientId);
    if (newListedIngredients.length > 0) setSelectedIngredientId(newListedIngredients[0].id);
    else setSelectedIngredientId('');
    setIngredientAmount(1);
  };

  const handleRemoveIngredient = (event: React.MouseEvent, ingredient: IngredientAmountDTO) => {
    event.preventDefault();

    dispatchStep({
      type: 'updateRecipe', payload: {
        ...recipe,
        ingredients: recipe.ingredients.filter(i => i !== ingredient)
      }
    });

    const newListedIngredients = listedIngredients.concat(ingredients.filter(i => i.id === ingredient.ingredientId));
    if (newListedIngredients.length > 0) setSelectedIngredientId(newListedIngredients[0].id);
  };

  const handleIngredientAmountChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);
    if (value < 0) return;
    setIngredientAmount(value);
  };

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
            onChange={handleIngredientAmountChange}
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
};

const TextContent = ({ recipe, onFormChange }: ModalContentProps) => {
  return (
    <>
      <h3 className='mb-2 font-semibold text-xl text-violet-900'>And finally, some content</h3>
      <TextareaField
        rows={10}
        name='content'
        value={recipe.content}
        onChange={onFormChange}
      />
    </>
  );
};

export const NewRecipeMenu = ({ open, setOpen }: MenuProps) => {
  const [{ recipe, step }, dispatchStep] = React.useReducer(stepReducer, {
    recipe: recipeBase,
    step: 'initial',
  });

  const { loadIngredients, addRecipe } = useStore((state) => ({
    loadIngredients: state.loadIngredients,
    addRecipe: state.addRecipe,
  }), shallow);

  // dispatch helpers
  const toInitial = () => dispatchStep({ type: 'toInitial', payload: null });
  const toIngredients = () => dispatchStep({ type: 'toIngredients', payload: null });
  const toContent = () => dispatchStep({ type: 'toContent', payload: null });
  const resetRecipe = () => dispatchStep({ type: 'updateRecipe', payload: recipeBase });

  // data fetching
  const { response } = useFetch('/ingredients');

  React.useEffect(() => {
    if (response) {
      const newIngredients = response.data as Ingredient[];
      newIngredients.sort((a, b) => a.name.localeCompare(b.name));
      loadIngredients(newIngredients);
    }
  }, [response]);

  // TODO is this good UX?
  React.useEffect(() => {
    if (!open) {
      resetRecipe();
      toInitial();
    }
  }, [open]);

  const steps = [
    { name: 'Recipe', icon: BookmarkAltIcon, clickCallback: toInitial, selected: step === 'initial' },
    { name: 'Ingredients', icon: ClipboardListIcon, clickCallback: () => toIngredients, selected: step === 'ingredients' },
    { name: 'Steps', icon: DocumentTextIcon, clickCallback: () => toContent, selected: step === 'content' },
  ] as BreadcrumbsElement[];

  const handleFormChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: string | number = event.currentTarget.value;
    const name = event.currentTarget.name as MenuField;

    if (name === 'cookMinutes') {
      value = parseInt(value);
      if (value < 0) return;
    }
    dispatchStep({
      type: 'updateRecipe', payload: {
        ...recipe,
        [name]: value
      }
    });
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

  // bit ugly, but does the trick
  const content = step === 'initial'
    ? <InitialContent recipe={recipe} onFormChange={handleFormChange} />
    : step === 'ingredients'
      ? <IngredientsContent recipe={recipe} dispatchStep={dispatchStep} />
      : <TextContent recipe={recipe} onFormChange={handleFormChange} />;


  // TODO fix the scrolling bugs

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
        {content}
      </div>

      <div className="absolute bottom-0 h-16 w-full bg-gray-50 px-4 py-3 sm:px-6 flex flex-1 items-center justify-around">
        <Button
          size='sm'
          className='w-32'
          variant='inverseBlack'
          onClick={() => dispatchStep({ type: 'toPrevious', payload: null })}
          disabled={step === 'initial'}
        >
          Previous
        </Button>
        <Button
          size='sm'
          className='w-32'
          onClick={() => {
            if (step === 'content') handleCreateRecipe();
            else dispatchStep({ type: 'toNext', payload: null });
          }}
        >
          {step === 'content' ? 'Create' : 'Next'}
        </Button>
      </div>
    </Modal>
  );
};