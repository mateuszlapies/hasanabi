import {MDBIcon, MDBNavbarItem, MDBNavbarLink} from 'mdb-react-ui-kit';

export default function HeaderTwitch() {
    return (
        <MDBNavbarItem>
            <MDBNavbarLink href='/twitch'>
                <MDBIcon fab icon='twitch' className='me-2' />Twitch
            </MDBNavbarLink>
        </MDBNavbarItem>
    );
}