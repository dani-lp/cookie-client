import { Formik } from 'formik';
import { axios } from '../../../lib/axios';

import { Button } from '../../../components/Elements/Button';
import { InputField } from '../../../components/Form';
import { User } from '../../../types';
import { useStore } from '../../../store/useStore';

interface FormErrors {
  email?: string;
  password?: string;
  submitMessage?: string;
}

interface UserResponse {
  data: User;
}

// TODO extract
interface UserResponseError {
  response: {
    data: {
      error: string;
    };
  };
}

export const LoginForm = () => {
  const setUser = useStore((state) => state.setUser);

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={(values) => {
        const errors: FormErrors = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        } else if (!values.password) {
          errors.password = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        axios.post('/auth/login', {
          email: values.email,
          password: values.password
        })
          .then((result: UserResponse) => {
            setUser(result.data);
          })
          .catch((error: UserResponseError) => {
            console.error(error);
            const errorMessage = error.response.data.error;
            setErrors({ email: errorMessage });
          }).finally(() => setSubmitting(false));
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <InputField
              type="email"
              name="email"
              label="Email"
              onChange={handleChange}
              value={values.email}
            >
              {errors.email && touched.email && errors.email}
            </InputField>
            <InputField
              type="password"
              name="password"
              label="Password"
              onChange={handleChange}
              value={values.password}
            >
              {errors.password && touched.password && errors.password}
            </InputField>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            Log in
          </Button>
        </form>
      )}
    </Formik>
  );
};