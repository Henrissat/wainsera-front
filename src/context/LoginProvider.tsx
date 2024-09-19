import { createContext, useContext, useEffect, useState } from 'react';

interface LoginInterface {
  token: String;
  user: UserInfoInterface;
}
interface UserInfoInterface {
  email: String;
  firstname: String;
  id: String;
}

interface UserContextInterface {
  userLog: LoginInterface | null;
  setUserLog: React.Dispatch<React.SetStateAction<LoginInterface | null>>;
}
const LoginContext = createContext<UserContextInterface>({
  userLog: null,
  setUserLog: () => {},
});

const LoginProvider = ({ children }: any) => {
  const [userLog, setUserLog] = useState<LoginInterface | null>(
    localStorage.getItem('userLog')
      ? JSON.parse(localStorage.getItem('userLog') || '')
      : null
  );

  useEffect(() => {
    if (userLog) {
      localStorage.setItem('userLog', JSON.stringify(userLog));
    } else {
      localStorage.removeItem('userLog');
    }
  }, [userLog]);

  return (
    <LoginContext.Provider value={{ userLog, setUserLog }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
