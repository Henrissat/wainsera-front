import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useState } from 'react';
import { ADD_USER } from '../../graphql/mutations/user.mutation';


const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const schema = yup.object({
  fullname: yup.string().required('Le nom complet est requis'),
  email: yup
  .string()
  .email("L'email fourni n'est pas valide")
  .test("email-valid", "L'email n'est pas valide", function (value) {
    if (!value) {
      return false;
    }
    return emailRegex.test(value);
  })
  .required("L'email est requis"),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe est requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
});

interface FormValues {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  // Initialiser react-hook-form avec Yup pour la validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [addUser, { loading }] = useMutation(ADD_USER);
  const [waiting, setWaiting] = useState<boolean>(false);

  // Soumission du formulaire
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setWaiting(true);
      await addUser({
        variables: {
          input: {
            fullname: data.fullname,
            email: data.email,
            password: data.password,
          },
        },
        onCompleted: () => {
          toast.success('Inscription réussie. Redirection vers la page de connexion...', {
            onClose: () => navigate('/login'),
          });
        },
      });
    } catch (error) {
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mt-3 d-flex justify-content-center">
        <h3>Créer un compte</h3>
        <br className="line" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Fullname */}
        <div className="mt-4 d-flex justify-content-center">
          <label htmlFor="fullname">
            Nom Complet <em className="text-danger">*</em>
            <input
              style={{ width: '20rem' }}
              className="form-control"
              placeholder="Votre nom complet"
              id="fullname"
              {...register('fullname')}
            />
            <div className="text-danger">{errors.fullname?.message}</div>
          </label>
        </div>

        {/* Email */}
        <div className="mt-4 d-flex justify-content-center">
          <label htmlFor="email">
            Email <em className="text-danger">*</em>
            <input
              style={{ width: '20rem' }}
              className="form-control"
              placeholder="exemple@gmail.com"
              type="email"
              id="email"
              {...register('email')}
            />
            <div className="text-danger">{errors.email?.message}</div>
          </label>
        </div>

        {/* Password */}
        <div className="mt-4 d-flex justify-content-center">
          <label htmlFor="password">
            Mot de passe <em className="text-danger">*</em>
            <input
              style={{ width: '20rem' }}
              className="form-control"
              placeholder="********"
              type="password"
              id="password"
              {...register('password')}
            />
            <div className="text-danger">{errors.password?.message}</div>
          </label>
        </div>

        {/* Confirm Password */}
        <div className="mt-4 d-flex justify-content-center">
          <label htmlFor="confirmPassword">
            Confirmation Mot de passe <em className="text-danger">*</em>
            <input
              style={{ width: '20rem' }}
              className="form-control"
              placeholder="********"
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
            />
            <div className="text-danger">{errors.confirmPassword?.message}</div>
          </label>
        </div>

        {/* Submit button */}
        <div className="my-5 d-flex justify-content-center">
          <button className="btn btn-primary" disabled={waiting || loading}>
            {loading ? 'Chargement...' : waiting ? 'Veuillez patienter...' : 'Inscription'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
