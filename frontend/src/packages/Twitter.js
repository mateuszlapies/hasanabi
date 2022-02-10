import {useEffect, useRef, useState} from "react";
import {Conf} from "../config/Config";
import {MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCol, MDBRow, MDBSpinner} from "mdb-react-ui-kit";
import useOnScreen from "../helpers/useOnScreen";
import Base from "./Base";
import ITweet from "../tweet/ITweet";
import BTweet from "../tweet/BTweet";
import PTweet from "../tweet/PTweet";

export default function Twitter() {
    let ref = useRef();
    let isVisible = useOnScreen(ref);
    let [state, setState] = useState({
        page: 0,
        last: false,
        tweets: []
    });

    useEffect(() => {
        if(!state.last && isVisible) {
            let page = state.page + 1;
            fetch(Conf.twitter + "tweets?page=" + page)
                .then(r => r.json())
                .then(j => {
                    setState({
                        page: page,
                        last: j.pageable.last,
                        tweets: state.tweets.concat(j.content)
                    });
                });
        }
    }, [isVisible, state]);

    return (
        <Base>
            {state.tweets.map((i, index) => (
                <MDBRow key={index} className="row-el">
                    <MDBCol size="3"/>
                    <MDBCol size="6">
                        <a className="text-reset" href={"https://twitter.com/hasanthehun/status/" + i.id} target="_blank" rel="noreferrer">
                            <MDBCard>
                                <MDBCardHeader>
                                    <ITweet profile={i.author_id} posted={i.created_at} url={"https://twitter.com/hasanthehun/status/" + i.id} />
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <BTweet tweet={i} />
                                </MDBCardBody>
                                <MDBCardFooter>
                                    <PTweet public={i.public_metrics} />
                                </MDBCardFooter>
                            </MDBCard>
                        </a>
                    </MDBCol>
                    <MDBCol size="3"/>
                </MDBRow>
            ))}
            <div hidden={state.last}>
                <MDBRow>
                    <MDBCol className="text-center p-3">
                        <MDBSpinner ref={ref}/>
                    </MDBCol>
                </MDBRow>
            </div>
        </Base>
    )
}