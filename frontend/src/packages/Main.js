import Base from "./Base";
import {MDBCol, MDBRow} from "mdb-react-ui-kit";
import CTwitch from "../comps/CTwitch";
import CTwitter from "../comps/CTwitter";
import CRatio from "../comps/CRatio";

export default function Main() {
    return (
        <Base>
            <MDBRow className="row-el">
                <MDBCol className="col-el">
                    <CTwitch/>
                </MDBCol>
            </MDBRow>
            <MDBRow className="row-el">
                <MDBCol className="col-el">
                    <CTwitter/>
                </MDBCol>
                <MDBCol className="col-el">
                    <CRatio/>
                </MDBCol>
            </MDBRow>
        </Base>
    );
}