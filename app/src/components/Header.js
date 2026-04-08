import HeaderNav from "./HeaderNav"
import logo from '../images/logo.svg';

function Header({ handlePage }) {
    return (
        <div className="App-Header">
            <div className="Header-Left">
                <img src={logo} alt="logo" height="100vh" width="100vh"/>
            </div>
            <div className="Header-Left">
                Fictional
                <br />
                UNiversity
            </div>
                <div className="Header-Right">
                <div className="item1">ACCOUNT</div>
                <HeaderNav onNavClick={handlePage}/>
            </div>
        </div>
    )
}

export default Header;