import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBCol,
    MDBIcon, MDBInputGroup, MDBInputGroupElement,
    MDBModal,
    MDBModalBody,
    MDBRow
} from "mdb-react-ui-kit";
import Base from "./Base";
import {useEffect, useRef, useState} from "react";
import {Api} from "../config/Config";
import TwitchGraph from "../twitch/TwitchGraph";

export default function Twitch() {
    let [hide, setHide] = useState(true);
    let [status, setStatus] = useState();
    let [twitch, setTwitch] = useState();
    let [element, setElement] = useState();

    let graphRef = useRef();

    useEffect(() => {
        if(!status)
            fetch(Api.twitch + "status")
                .then(r => r.ok ? r.json() : setStatus(undefined))
                .then(j => setStatus(j));
    })

    useEffect(() => {
        if(!element && !status) {
            let size = document.getElementById("twitch-stream-embed");
            setElement({clientWidth: size.clientWidth, clientHeight: size.clientHeight});
        }
        if(status && status.type === "live" && !twitch && element) {
            setTwitch(new window.Twitch.Embed("twitch-stream-embed", {
                width: "100%",
                height: "100%",
                channel: "hasanabi",
                autoplay: false,
                layout: "video",
                theme: "dark"
            }));
        }
    }, [status, twitch, element]);

    let show = (s, h) => {
        return !h && s && s.type === "live"
    }

    let display = (s, h) => {
        if(show(s, h))
            return ""
        else
            return " d-none"
    }

    return (
        <Base>
            <div className="twitch" ref={graphRef}>
                <TwitchGraph container={graphRef}/>
            </div>
            <MDBModal show={show(status, hide)} className={"twitch-modal" + display(status, hide)} size="fullscreen">
                <MDBModalBody className="twitch-modal">
                    <MDBRow className="twitch-row">
                        <MDBCol size="8" className="twitch-col">
                            <div id="twitch-stream-embed" className="twitch-main"/>
                        </MDBCol>
                        <MDBCol size="2" className="twitch-col">
                            <iframe id="twitch-chat-embed"
                                    title="twitch-chat"
                                    src={"https://www.twitch.tv/embed/hasanabi/chat?parent=" + Api.embedded}
                                    height="100%"
                                    width="100%"/>
                        </MDBCol>
                        <MDBCol size="2" className="twitch-col">
                            <MDBCard className="banished">
                                <MDBCardHeader>
                                    <div className="twitch-close-container">
                                        <div className="text-center"><MDBIcon fas icon="gavel" className="me-2" />Banished chat</div>
                                        <div className="twitch-close">
                                            <MDBBtn className='btn-close' color='none' onClick={() => {setHide(true)}}/>
                                        </div>
                                    </div>
                                </MDBCardHeader>
                                <MDBCardBody>

                                </MDBCardBody>
                                <MDBCardFooter>
                                    <MDBInputGroup>
                                        <MDBInputGroupElement type="text" name="message"  placeholder="Message" />
                                        <MDBBtn type="submit">Send</MDBBtn>
                                    </MDBInputGroup>
                                </MDBCardFooter>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBModalBody>
            </MDBModal>
        </Base>
    )
}