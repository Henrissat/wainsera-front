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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { loading, error } = useQuery(GET_USER, {
    variables: { getUserByIdId: userLog?.user.id },
    skip: !userLog?.user.id, 
    onCompleted(data) {
      if (data.getUserById) {
        console.log("user", data.getUserById);
        setCurrentUser(data.getUserById);
      }
    },
  });

  const name = currentUser?.fullname ? currentUser?.fullname : currentUser?.email;
  
  const handleDeleteLocalStorage = () => {
    setUserLog(null);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur s'est produite lors du chargement de l'utilisateur.</div>;

  return (
    <>
      <div className="nav-container">
        <a href="/" className="logo">
          <img
            className="m-3 logo-w"
            alt="Wainsera"
          />
        </a>
        <span className="name">Bonjour {name}</span>
        
        {/* Bouton Burger */}
        <button className="burger-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          &#9776;
        </button>

        {/* Menu avec affichage conditionnel */}
        <nav className={isMenuOpen ? "navbar active" : "navbar"}>
            <ul>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                    Carte des vins
                  </Link>
                </li>
                <li className="nav-item" onClick={() => { handleDeleteLocalStorage(); setIsMenuOpen(false); }}>
                  <Link className="nav-link" to="/login">
                    Déconnexion
                  </Link>
                </li>
              </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
