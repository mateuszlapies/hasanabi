import Base from "./Base";
import {MDBCol, MDBRow} from "mdb-react-ui-kit";
import CTwitch from "../twitch/CTwitch";
import CTwitter from "../twitter/CTwitter";
import CRatio from "../twitter/CRatio";
import COwned from "../twitter/COwned";

export default function Main() {
    return (
        <Base>
            <MDBRow className="row-el">
                <MDBCol className="col-el">
                    <CTwitch/>
                </MDBCol>
            </MDBRow>
            <MDBRow className="row-el">
                <MDBCol size="6" className="col-el">
                    <CTwitter/>
                </MDBCol>
                <MDBCol size="3" className="col-el">
                    <CRatio/>
                </MDBCol>
                <MDBCol size="3" className="col-el">
                    <COwned/>
                </MDBCol>
            </MDBRow>
        </Base>
    );
}