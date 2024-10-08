import { useLazyQuery } from '@apollo/client';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../context/LoginProvider';
import { LOGIN } from '../../graphql/queries/user.query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import useNotification from '../../notifications/useNotification';
import './login.css';

interface FormValues {
  email: string;
  password: string;
}

function Login() {
  const navigator = useNavigate();
  const { authentification } = useNotification();
  const [err, setErr] = useState<String | null>(null);
  const { setUserLog, userLog } = useLogin();
  const [waiting, setWaiting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
  } = useForm<FormValues>();

  const [login, { loading }] = useLazyQuery(LOGIN , {
    onCompleted(data) {
      toast(authentification.loginSuccess, {
        onClose() {
          setUserLog(data.login);
        },
        onOpen() {
          setWaiting(true);
        },
        type: 'success',
      });
    },
    onError(error) {
      console.error(error);
      setErr(error.message);
    },
  });

  useEffect(() => {
    if (userLog) {
      navigator('/');
    }
  }, [userLog, navigator]);

  const onSubmit: SubmitHandler<FormValues> = async (response) => {
    await login({ variables: { input: response } });
  };

  return (
    <div>
      <div>
        
      </div>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>

      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <h3>Login</h3>
        <div className="form-content">
          <label className="" htmlFor="email">
            Mail 
            <input
              style={{ width: '30rem' }}
              className="form-control"
              placeholder="john@example.com"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              id="email"
              {...register('email', { required: true })}            
            />
          </label>
          <label className="" htmlFor="password">
            Mot de passe 
            <input
              style={{ width: '30rem' }}
              className="form-control"
              placeholder="***********"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              type="password"
              id="password"
              {...register('password', { required: true })}            
            />
          </label>
        </div>
        <p className="text-danger d-flex justify-content-center">
          {' '}
          {err ? 'Les informations fournies ne sont pas correctes' : ''}{' '}
        </p>
        <div className="">
          <button
            className="btn-connexion"
            type="submit"
            disabled={waiting || loading}
          >
            {loading
              ? 'Chargement en cours'
              : waiting
              ? 'Veuillez patienter...'
              : 'Connexion'}
          </button>
        </div>
      </form>
      <div className='register'>
        <span>Je n'ai pas encore de compte </span>
        <span><Link to="/register"> S’inscrire</Link></span>
      </div>
    </div>
  );
}

export default Login;
