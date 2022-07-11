import * as React from 'react';
import shallow from 'zustand/shallow';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

import { useStore } from '../../../store/useStore';
import { useFetch } from '../../../hooks/useFetch';
import { Spinner } from '../../../components/Elements/Spinner';
import { Unit } from '../../../types';

interface UnitProps {
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const UnitItem = ({ name, selected = false, onClick }: UnitProps) => {
  return (
    <li
      className={`px-4 py-2 cursor-pointer transition-colors ${selected ? 'bg-violet-500 text-white font-semibold' : 'hover:bg-violet-200'}`}
      onClick={onClick}
    >
      {name}
    </li>
  );
};


interface SelectorProps {
  selectedUnit: string;
  setSelectedUnit: (unit: string) => void;
}

export const UnitSelector = ({ selectedUnit, setSelectedUnit }: SelectorProps) => {
  const { units, loadUnits } = useStore((state) => ({
    units: state.units,
    loadUnits: state.loadUnits
  }), shallow);
  const handleClick = (id: string) => () => setSelectedUnit(id);
  const { response, error, isLoading } = useFetch('/units');

  React.useEffect(() => {
    if (response) {
      const newUnits = response.data as Unit[];
      newUnits.sort((a, b) => a.name.localeCompare(b.name));
      loadUnits(newUnits);
      if (newUnits.length > 0) {
        setSelectedUnit(newUnits[0].id);
      }
    }
  }, [response]);

  const content = error
    ? (
      <div className='p-2 h-full flex flex-col items-center justify-center'>
        <ExclamationCircleIcon className='h-16 w-16 text-red-500' />
        <h3 className='text-lg font-semibold'>Sorry, there was an error!</h3>
        <p>Please try again later.</p>
      </div>
    )
    : !isLoading
      // TODO empty units, unit creator, ingredient list, duplicate checks
      ? units.map(unit => (
        <UnitItem
          key={unit.id}
          name={unit.name}
          selected={selectedUnit === unit.id}
          onClick={handleClick(unit.id)}
        />
      ))
      : (
        <div className='h-full flex flex-col items-center justify-center gap-4'>
          <Spinner size='lg' />
          <h3>Units are loading...</h3>
        </div>
      );

  return (
    <div className='mt-1'>
      <ul className='border-2 border-gray-300 w-full overflow-y-auto h-44 rounded-lg shadow-sm divide-y-2 divide-gray-200'>
        {content}
      </ul>
    </div>
  );
};