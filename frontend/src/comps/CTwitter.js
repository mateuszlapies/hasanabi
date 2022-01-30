import {MDBCard, MDBCardBody, MDBCardHeader, MDBIcon} from "mdb-react-ui-kit";
import {useEffect, useState} from "react";
import {Conf} from "../config/Config";
import Tweet from "../tweet/Tweet";

export default function CTwitter(props) {
    let [tweet, setTweet] = useState();

    useEffect(() => {
        fetch(Conf.twitter + "latest")
            .then(r => r.json())
            .then(j => setTweet(j));
    }, [props]);

    return (
        <MDBCard className="card-el">
            <MDBCardHeader>
                <MDBIcon fab icon="twitter" size="lg" className="me-2" />Latest Tweet
            </MDBCardHeader>
            <MDBCardBody>
                <Tweet tweet={tweet} />
            </MDBCardBody>
        </MDBCard>
    )
}