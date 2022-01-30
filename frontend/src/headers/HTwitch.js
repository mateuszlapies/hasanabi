import {MDBIcon, MDBNavbarItem, MDBNavbarLink} from 'mdb-react-ui-kit';

export default function HTwitch() {
    return (
        <MDBNavbarItem>
            <MDBNavbarLink href='/twitch' active>
                <MDBIcon fab icon='twitch' className='me-1 fa-lg twitch-icon' />Twitch
            </MDBNavbarLink>
        </MDBNavbarItem>
    );
}