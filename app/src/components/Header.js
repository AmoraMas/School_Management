import logo from '../images/logo.svg';

function Header() {
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

            <div className="Header-Right">ACCOUNT</div>
            <br /><br />
            <div className="Header-Right">Portal | About</div>
        </div>
    )
}

export default Header;