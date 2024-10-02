import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../context/LoginProvider";
import { GET_USER } from "../../graphql/queries/user.query";
import "./header.css";

interface IUser {
  email: string;
  fullname: string;
  id: string;
  bouteilles: any[];
}

const Header = () => {
  const { userLog, setUserLog } = useLogin();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  // const { clearCart } = useContext(WineContext);
  console.log(currentUser)

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { getUserByIdId: userLog?.user.id },
    skip: !userLog?.user.id, 
    onCompleted(data) {
      if (data.getUserById) {
        console.log("user", data.getUserById);
        setCurrentUser(data.getUserById);
      }
    },
  });
  

  const handleDeleteLocalStorage = () => {
    // clearCart();
    setUserLog(null);
  };
  

  return (
    <>
      <div className="nav-container">
        <a href="/" className="logo">
          <img
            className="m-3 logo-w"
            alt="Wainsera"
          />
        </a>
        <nav>
            <ul className="navbar">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Carte des vins
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    A propos
                  </Link>
                </li>
                <li className="nav-item"
                  onClick={handleDeleteLocalStorage}>
                  <Link className='nav-link'to="/login">
                    Deconnexion
                  </Link>
                </li>
              </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
