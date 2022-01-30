import {MDBIcon, MDBNavbarItem, MDBNavbarLink} from "mdb-react-ui-kit";

export default function HInstagram() {
    return (
        <MDBNavbarItem>
            <MDBNavbarLink href='/instagram' active>
                <MDBIcon fab icon='instagram' className='me-1 fa-lg instagram-icon' />Instagram
            </MDBNavbarLink>
        </MDBNavbarItem>
    );
}