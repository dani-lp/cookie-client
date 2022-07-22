import * as React from 'react';
import { Dialog } from '@headlessui/react';
import { BookmarkAltIcon, ChevronRightIcon, ClipboardListIcon, DocumentTextIcon } from '@heroicons/react/outline';

import { Modal } from '../../../components/Overlay';
import { Button } from '../../../components/Elements/Button';
import { Recipe } from '../../../types';
import { InputField } from '../../../components/Form';


type ModalState = 0 | 1 | 2;

interface MenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface BreadcrumbsProps {
  step: ModalState;
  setStep: (step: ModalState) => void;
}

const Breadcrumbs = ({ step, setStep }: BreadcrumbsProps) => {
  // TODO better styling, extract to reusable component

  return (
    <div className='flex items-center justify-start gap-1 w-full'>
      <span
        className={`flex items-center justify-center gap-1 transition-colors ${step === 0 ? 'text-violet-600 font-semibold' : 'text-gray-700 hover:text-violet-600 cursor-pointer'}`}
        onClick={() => setStep(0)}
      >
        <BookmarkAltIcon className='h-5 w-5 hidden sm:block' />
        Recipe
      </span>
      <ChevronRightIcon className='h-5 w-5' />
      <span
        className={`flex items-center justify-center gap-1 transition-colors ${step === 1 ? 'text-violet-600 font-semibold' : 'text-gray-700 hover:text-violet-600 cursor-pointer'}`}
        onClick={() => setStep(1)}
      >
        <ClipboardListIcon className='h-5 w-5 hidden sm:block' />
        Ingredients
      </span>
      <ChevronRightIcon className='h-5 w-5' />
      <span
        className={`flex items-center justify-center gap-1 transition-colors ${step === 2 ? 'text-violet-600 font-semibold' : 'text-gray-700 hover:text-violet-600 cursor-pointer'}`}
        onClick={() => setStep(2)}
      >
        <DocumentTextIcon className='h-5 w-5 hidden sm:block' />
        Steps
      </span>
    </div>
  );
};


type MenuField = 'title' | 'cookMinutes' | 'imageURL';

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

  // TODO is this good UX?
  React.useEffect(() => {
    if (!open) setRecipe(recipeBase);
  }, [open]);

  // TODO use 'name' attribute
  const handleFormChange = (event: React.FormEvent<HTMLInputElement>, field: MenuField) => {
    const value = event.currentTarget.value;
    console.log(value);

    switch (field) {
      case 'title':
        setRecipe({ ...recipe, title: value });
        break;
      case 'cookMinutes': {
        const re = /^[0-9\b]+$/;
        if (value === '' || re.test(value) && recipe.cookMinutes !== undefined) {
          setRecipe({ ...recipe, cookMinutes: parseInt(value) });
        }
        break;
      }
      case 'imageURL':
        // TODO URL validation
        setRecipe({ ...recipe, imageUrl: value });
        break;
      default:
        break;
    }
  };

  const content = (step: ModalState) => {
    switch (step) {
      case 0:
        return (
          <>
            <InputField
              label="Recipe name"
              value={recipe.title}
              onChange={(e) => handleFormChange(e, 'title')}
              className="mb-3"
            />
            <InputField
              label="Cooking minutes"
              type="number"
              value={recipe.cookMinutes?.toString()}
              onChange={(e) => handleFormChange(e, 'cookMinutes')}
              className="mb-3"
            />
            <InputField
              label="Image URL"
              value={recipe.imageUrl}
              onChange={(e) => handleFormChange(e, 'imageURL')}
              className="mb-3"
            />
          </>
        );
      case 1:
        return (
          <>
            {/* Add ingredients */}
          </>
        );
      case 2:
        return (
          <>
            {/* Add content/explanation */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 h-96">
        <div className="sm:flex sm:items-start">
          <Dialog.Title className="mb-4">
            <Breadcrumbs step={step} setStep={setStep} />
          </Dialog.Title>
          <div>
            {content(step)}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-1 items-center justify-around">
        <Button
          size='sm'
          className='w-32'
          variant='inverseBlack'
          onClick={() => { if (step > 0) setStep(step - 1 as ModalState); }}
        >
          Previous
        </Button>
        <Button
          size='sm'
          className='w-32'
          onClick={() => { if (step < 2) setStep(step + 1 as ModalState); }}
        >
          Next
        </Button>
      </div>
    </Modal>
  );
};