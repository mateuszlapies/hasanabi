import {MDBCol, MDBIcon, MDBRow} from "mdb-react-ui-kit";

export default function PTweet(props) {
    return (
        <MDBRow className={"text-center " + props.className}>
            <MDBCol>
                <MDBIcon far icon="comment-alt" size={props.xsmall ? "sm" : "lg"} className="pe-1" />{props.public.reply_count}
            </MDBCol>
            <MDBCol>
                <MDBIcon fas icon="retweet" size={props.xsmall ? "sm" : "lg"} className="pe-1" />{props.public.retweet_count}
            </MDBCol>
            <MDBCol>
                <MDBIcon far icon="heart" size={props.xsmall ? "sm" : "lg"} className="pe-1" />{props.public.like_count}
            </MDBCol>
            <MDBCol>
                <MDBIcon fas icon="quote-left" size={props.xsmall ? "sm" : "lg"}  className="pe-1" />{props.public.quote_count}
            </MDBCol>
        </MDBRow>
    )
}