import {MDBIcon, MDBNavbarItem, MDBNavbarLink} from "mdb-react-ui-kit";

export default function HeaderInstagram() {
    return (
        <MDBNavbarItem>
            <MDBNavbarLink href='/instagram'>
                <MDBIcon fab icon='instagram' className='me-2' />Instagram
            </MDBNavbarLink>
        </MDBNavbarItem>
    );
}