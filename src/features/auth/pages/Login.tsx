import { LoginForm } from '../components';

export const Login = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-xs w-full bg-white flex flex-col items-center justify-center p-8 rounded-2xl shadow-md">
        <h1 className='font-medium text-2xl mb-6'>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};