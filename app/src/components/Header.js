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
                <a  className="link-white"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePage("classes");
                    }}
                    >
                    Classes
                </a>
                <a  className="link-white"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePage("students");
                    }}
                    >
                    Students
                </a>
                <a  className="link-white"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePage("teachers");
                    }}
                    >
                    Teachers
                </a>
                {/*
                <a  className="link-white"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePage("billings");
                    }}
                    >
                    Billing
                </a>
                */}
                <a  className="link-white"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePage("about");
                    }}
                    >
                    About
                </a>
            </div>
        </div>
    )
}

export default Header;