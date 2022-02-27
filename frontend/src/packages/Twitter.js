import {useEffect, useRef, useState} from "react";
import {Api} from "../config/Config";
import {
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBCol,
    MDBRow,
    MDBSpinner,
    MDBTabs, MDBTabsContent, MDBTabsItem, MDBTabsLink, MDBTabsPane
} from "mdb-react-ui-kit";
import useOnScreen from "../helpers/useOnScreen";
import Base from "./Base";
import ITweet from "../twitter/ITweet";
import BTweet from "../twitter/BTweet";
import PTweet from "../twitter/PTweet";

const defaultState = {
    page: 0,
    last: false,
    tweets: []
}

export default function Twitter() {
    let ref = useRef();
    let isVisible = useOnScreen(ref);
    let [state, setState] = useState(defaultState);
    let [tab, setTab] = useState(1)

    useEffect(() => {
        let endpoint = () => {
            switch (tab) {
                default:
                case 1:
                    return "tweets";
                case 2:
                    return "ratios";
                case 3:
                    return "ownes"
            }
        }
        if(!state.last && isVisible) {
            let page = state.page + 1;
            fetch(Api.twitter + endpoint() + "?page=" + page)
                .then(r => r.json())
                .then(j => {
                    setState({
                        page: page,
                        last: j.last,
                        tweets: state.tweets.concat(j.content)
                    });
                });
        }
    }, [isVisible, state, tab]);

    return (
        <Base>
            <MDBTabs fill className='mb-3'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => { setTab(1); setState(defaultState); }} active={tab === 1}>
                        Tweets
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => { setTab(2); setState(defaultState); }} active={tab === 2}>
                        Ratios
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => { setTab(3); setState(defaultState); }} active={tab === 3}>
                        Owned
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>

            <MDBTabsContent>
                <MDBTabsPane show={tab === 1}>
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
                </MDBTabsPane>
                <MDBTabsPane show={tab === 2}>
                    {state.tweets.map((i, index) => (
                        <MDBRow key={index} className="row-el">
                            <MDBCol size="3"/>
                            <MDBCol size="6">
                                <MDBCard>
                                    <MDBCardHeader>
                                        <ITweet profile={i.author_id} posted={i.created_at} />
                                    </MDBCardHeader>
                                    <MDBCardBody>
                                        <BTweet tweet={i} />
                                    </MDBCardBody>
                                    <MDBCardFooter>
                                        <PTweet public={i.public_metrics} />
                                    </MDBCardFooter>
                                </MDBCard>
                            </MDBCol>
                            <MDBCol size="3"/>
                        </MDBRow>
                    ))}
                </MDBTabsPane>
                <MDBTabsPane show={tab === 3}>
                    {state.tweets.map((i, index) => (
                    <MDBRow key={index} className="row-el">
                        <MDBCol size="3"/>
                        <MDBCol size="6">
                            <MDBCard>
                                <MDBCardHeader>
                                    <ITweet profile={i.author_id} posted={i.created_at} />
                                </MDBCardHeader>
                                <MDBCardBody>
                                    <BTweet tweet={i} />
                                </MDBCardBody>
                                <MDBCardFooter>
                                    <PTweet public={i.public_metrics} />
                                </MDBCardFooter>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol size="3"/>
                    </MDBRow>
                    ))}
                </MDBTabsPane>
            </MDBTabsContent>
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