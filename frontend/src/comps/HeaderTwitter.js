import {MDBIcon, MDBNavbarItem, MDBNavbarLink} from "mdb-react-ui-kit";

export default function HeaderTwitter() {
    return (
        <MDBNavbarItem>
            <MDBNavbarLink href='/twitter'>
                <MDBIcon fab icon='twitter' className='me-2' />Twitter
            </MDBNavbarLink>
        </MDBNavbarItem>
    );
}