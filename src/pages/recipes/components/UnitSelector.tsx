import * as React from 'react';
import shallow from 'zustand/shallow';
import { ExclamationCircleIcon, PlusIcon } from '@heroicons/react/solid';

import { Spinner } from '../../../components/Elements/Spinner';
import { Button } from '../../../components/Elements/Button';
import { SearchBar } from './SearchBar';
import { axios } from '../../../lib/axios';
import { useStore } from '../../../store/useStore';
import { useSearch } from '../stores/search';
import { useFetch } from '../../../hooks/useFetch';
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


interface UnitResponse {
  data: Unit;
}

interface SelectorProps {
  selectedUnitId: string;
  setSelectedUnitId: (unit: string) => void;
}

export const UnitSelector = ({ selectedUnitId, setSelectedUnitId }: SelectorProps) => {
  const { units, loadUnits, addUnit } = useStore((state) => ({
    units: state.units,
    loadUnits: state.loadUnits,
    addUnit: state.addUnit,
  }), shallow);
  const { unitSearch, setUnitSearch } = useSearch((state) => ({
    unitSearch: state.unitSearch,
    setUnitSearch: state.setUnitSearch,
  }), shallow);

  const [unitError, setUnitError] = React.useState('');

  const handleClick = (id: string) => () => setSelectedUnitId(id);
  const { response, error, isLoading } = useFetch('/units');

  React.useEffect(() => {
    if (response) {
      const newUnits = response.data as Unit[];
      newUnits.sort((a, b) => a.name.localeCompare(b.name));
      loadUnits(newUnits);
      if (newUnits.length > 0) {
        setSelectedUnitId(newUnits[0].id);
      }
    }
  }, [response]);

  const handleUnitSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setUnitSearch(value);

    if (units.some(unit => unit.name === value)) {
      setUnitError('A unit with that name already exists!');
    } else {
      setUnitError('');
    }
  };

  const handleAddUnit = (event: React.FormEvent) => {
    event.preventDefault();

    if (unitError.length > 0) return;

    // axios post
    axios.post('/units', { name: unitSearch })
      .then((result: UnitResponse) => {
        addUnit(result.data);
      }).catch(error => {
        console.log(error);
        setUnitError('There has been an unknown error...');
      });
    setUnitSearch('');
  };

  const filteredUnits = unitSearch.length > 0
    ? units.filter(unit => unit.name.toLowerCase().includes(unitSearch.toLowerCase()))
    : units;

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
      ? filteredUnits.map(unit => (
        <UnitItem
          key={unit.id}
          name={unit.name}
          selected={selectedUnitId === unit.id}
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
    <>
      <form className="flex items-center justify-between gap-2" onSubmit={handleAddUnit}>
        <SearchBar
          value={unitSearch}
          changeHandler={handleUnitSearchChange}
          placeholder="Unit..."
          className={`h-10 ${unitError && 'focus:ring-red-500 focus:border-red-500'}`}
        />
        {/* TODO rounded addition button */}
        <Button className="w-4 rounded-md" type="submit" squared>
          <PlusIcon className="h-5 w-5" />
        </Button>
      </form>
      {unitError && unitError}
      <div className="mt-1">
        <ul className="border-2 border-gray-300 w-full overflow-y-auto h-44 rounded-lg shadow-sm divide-y-2 divide-gray-200">
          {content}
        </ul>
      </div>
    </>
  );
};