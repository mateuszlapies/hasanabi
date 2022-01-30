import {
    MDBCollapse,
    MDBContainer,
    MDBIcon, MDBNavbar, MDBNavbarBrand,
    MDBNavbarItem, MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler
} from "mdb-react-ui-kit";
import HTwitch from "../headers/HTwitch";
import HTwitter from "../headers/HTwitter";
import HInstagram from "../headers/HInstagram";
import {useState} from "react";

export default function Header() {
    let [show, setShow] = useState(false);

    return (
        <MDBNavbar expand='lg' dark bgColor='dark' className="header">
            <MDBContainer>
                <MDBNavbarBrand href='/'>HasanAbi.tv</MDBNavbarBrand>
                <MDBNavbarToggler
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setShow(!show)}
                >
                    <MDBIcon icon='bars' fas />
                </MDBNavbarToggler>
                <MDBCollapse navbar show={show}>
                    <MDBNavbarNav left fullWidth={false} className='mr-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem>
                            <MDBNavbarLink active aria-current='page' href='/'>
                                <MDBIcon fas icon="dog" className="me-1 fa-lg" />Studio
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                    <MDBNavbarNav right fullWidth={false} className='mr-auto mb-2 mb-lg-0'>
                        <HTwitch/>
                        <HTwitter/>
                        <HInstagram/>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    );
}

