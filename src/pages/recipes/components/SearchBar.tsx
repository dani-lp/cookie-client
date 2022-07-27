import { SearchIcon } from '@heroicons/react/solid';
import { InputField } from '../../../components/Form';

type SearchBarProps = {
  value: string;
  changeHandler: (event: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

export const SearchBar = ({ value, changeHandler, placeholder = '', className = '' }: SearchBarProps) => {
  return (
    <InputField
      value={value}
      onChange={changeHandler}
      className={`relative pl-11 ${className}`}
      wrapperClassName='relative'
      placeholder={placeholder}
    >
      <div className="absolute inset-y-0 left-3 flex items-center">
        <SearchIcon className='h-6 w-6 text-gray-600' />
      </div>
    </InputField>
  );
};