import {
    MDBAnimatedNavbar,
    MDBContainer,
    MDBIcon,
    MDBNavbarItem, MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler
} from "mdb-react-ui-kit";
import HeaderTwitch from "../comps/HeaderTwitch";
import HeaderTwitter from "../comps/HeaderTwitter";
import HeaderInstagram from "../comps/HeaderInstagram";

export default function Header() {
    return (
        <header>
            <MDBAnimatedNavbar expand='lg' fixed='top'>
                <MDBContainer fluid>
                    <MDBNavbarToggler aria-controls='navbar' aria-expanded='false' aria-label='Toggle navigation'>
                        <MDBIcon fas icon='bars' />
                    </MDBNavbarToggler>
                    <div className='collapse navbar-collapse' id='navbar'>
                        <MDBNavbarNav fullWidth className='me-auto mb-2 mb-lg-0'>
                            <MDBNavbarItem active>
                                <MDBNavbarLink>Home</MDBNavbarLink>
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                        <HeaderTwitch/>
                        <HeaderTwitter/>
                        <HeaderInstagram/>
                    </div>
                </MDBContainer>
            </MDBAnimatedNavbar>
        </header>
    )
}