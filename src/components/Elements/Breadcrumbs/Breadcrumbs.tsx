import * as React from 'react';
import { ChevronRightIcon } from '@heroicons/react/outline';

export interface BreadcrumbsElement {
  name: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  clickCallback: () => void;
  selected: boolean;  // TODO is this the best way to keep track of the selected item?
}

interface BreadcrumbsProps {
  elements: BreadcrumbsElement[];
}

export const Breadcrumbs = ({ elements }: BreadcrumbsProps) => {
  return (
    <div className='flex items-center justify-start gap-1 w-full text-lg'>
      {elements.map((element, index) => (
        <React.Fragment key={`bc-${element.name}`}>
          <div
            className={`flex items-center justify-center gap-1 transition-colors ${element.selected ? 'text-violet-600 font-semibold' : 'text-gray-700 hover:text-violet-600 cursor-pointer'}`}
            onClick={element.clickCallback}
          >
            <element.icon className='h-5 w-5 hidden sm:block' />
            {element.name}
          </div>
          {index < elements.length - 1 && <ChevronRightIcon className='h-5 w-5' />}
        </React.Fragment>
      ))}
    </div>
  );
};