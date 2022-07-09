import { RegisterForm } from './components';

export const Register = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-xs w-full bg-white flex flex-col items-center justify-center p-8 rounded-2xl shadow-md">
        <h1 className='font-medium text-2xl mb-6'>Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
};