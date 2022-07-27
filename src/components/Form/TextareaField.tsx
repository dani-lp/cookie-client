import * as React from 'react';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & React.InputHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  wrapperClassName?: string;
  rows?: number;
};

export const TextareaField = (
  {
    id,
    label,
    name,
    value,
    required = false,
    rows = 5,
    onChange,
    className,
    wrapperClassName,
    placeholder = '',
    autoFocus = false,
    children
  }: InputFieldProps) => {
  return (
    <FieldWrapper label={label} className={wrapperClassName}>
      <textarea
        id={id}
        rows={rows}
        className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm ${className}`}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      {children}
    </FieldWrapper>
  );
};