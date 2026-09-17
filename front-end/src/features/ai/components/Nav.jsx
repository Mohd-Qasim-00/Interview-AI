
import style from "../style/style.module.css";
import { NavLink } from "react-router-dom";
import {useAuth} from "../../auth/hooks/useAuth";

export default function Nav() {
  const {handleLogout} = useAuth();
  const linkClassName = ({ isActive }) =>
    `${style.link} ${isActive ? style.active : ""}`;

  return (
    <nav className={style.navbar} aria-label="Main navigation">
      <NavLink className={style.brand} to="/">
        <span className={style.brandMark}>AI</span>
        <span>Interview Coach</span>
      </NavLink>

      <ul className={style.links}>
        <li><NavLink className={linkClassName} to="/">Home</NavLink></li>
        <li><NavLink className={linkClassName} to="/generate-report">Generate Report</NavLink></li>
        <li><button className={style.logout} type="button" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  )

}
