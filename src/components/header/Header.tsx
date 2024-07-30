import { Link } from "react-router-dom";
import "./header.css";


const Header = () => {

  return (
    <>
      <div className="nav-container">
        <a href="/">
          <img
            className="m-3 logo-w"
            alt="logo-wainsera"
          />
        </a>
        <nav >
            <ul className="navbar">
                <li className="nav-item">
                  <Link className="nav-link" to="/vin">
                    Vins
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/category">
                    A propos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Administrateur
                  </Link>
                </li>
              </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
