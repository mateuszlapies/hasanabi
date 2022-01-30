import {MDBCol, MDBIcon, MDBRow} from "mdb-react-ui-kit";

export default function PTweet(props) {
    return (
        <MDBRow className="text-center">
            <MDBCol>
                <MDBIcon far icon="comment-alt" size="lg" className="pe-1" />{props.public.reply_count}
            </MDBCol>
            <MDBCol>
                <MDBIcon fas icon="retweet" size="lg" className="pe-1" />{props.public.retweet_count}
            </MDBCol>
            <MDBCol>
                <MDBIcon far icon="heart" size="lg" className="pe-1" />{props.public.like_count}
            </MDBCol>
            <MDBCol>
                <MDBIcon fas icon="quote-left" size="lg" className="pe-1" />{props.public.quote_count}
            </MDBCol>
        </MDBRow>
    )
}