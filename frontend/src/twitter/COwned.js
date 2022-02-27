import {MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBIcon, MDBScrollbar} from "mdb-react-ui-kit";
import {useEffect, useState} from "react";
import {Api} from "../config/Config";
import ITweet from "./ITweet";
import BTweet from "./BTweet";
import PTweet from "./PTweet";

export default function COwned(props) {
    let [tweet, setTweet] = useState([]);

    useEffect(() => {
        fetch(Api.twitter + "owned")
            .then(r => r.json())
            .then(j => setTweet(j));
    }, [props]);

    return (
        <MDBCard className="card-el">
            <MDBCardHeader>
                <MDBIcon fas icon="hand-middle-finger" size="lg" className="me-2" />Owned
            </MDBCardHeader>
            <MDBCardBody className="main-card-limit p-1">
                <MDBScrollbar wheelSpeed={0.5}>
                {tweet.map((t, i) =>
                    <MDBCard key={i} className="text-sm m-3">
                        <MDBCardHeader>
                            <ITweet profile={t.author_id} posted={t.created_at} xsmall />
                        </MDBCardHeader>
                        <MDBCardBody>
                            <BTweet tweet={t} />
                        </MDBCardBody>
                        <MDBCardFooter>
                            <PTweet public={t.public_metrics} xsmall />
                        </MDBCardFooter>
                    </MDBCard>
                )}
                </MDBScrollbar>
            </MDBCardBody>
        </MDBCard>
    )
}