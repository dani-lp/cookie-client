import { Formik } from 'formik';

import { Button } from '@/components/Elements/Button';
import { InputField } from '@/components/Form';
import { axios } from '@/lib/axios';
import { useStore } from '@/store/useStore';
import { User } from '@/types';

interface FormErrors {
  username?: string;
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

export const RegisterForm = () => {
  const setUser = useStore((state) => state.setUser);

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validate={(values) => {
        const errors: FormErrors = {};

        if (!values.username) {
          errors.username = 'Required';
        }

        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }

        if (!values.password) {
          errors.password = 'Required';
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        axios.post('/auth/register', {
          username: values.username,
          email: values.email,
          password: values.password
        })
          .then((result: UserResponse) => {
            setUser(result.data);
            setSubmitting(false);
          })
          .catch((error: UserResponseError) => {
            console.error(error);
            const errorMessage = error.response.data.error;
            // TODO errors
            setErrors({ email: errorMessage });
          });
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
              type="text"
              name="username"
              label="Username"
              onChange={handleChange}
              value={values.username}
            >
              {errors.username && touched.username && errors.username}
            </InputField>
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
            Register
          </Button>
        </form>
      )}
    </Formik>
  );
};