import {MDBIcon, MDBNavbarItem, MDBNavbarLink} from "mdb-react-ui-kit";

export default function HTwitter() {
    return (
        <MDBNavbarItem>
            <MDBNavbarLink href='twitter' active>
                <MDBIcon fab icon='twitter' className='me-1 fa-lg twitter-icon' />Twitter
            </MDBNavbarLink>
        </MDBNavbarItem>
    );
}