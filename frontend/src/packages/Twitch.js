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
import {useEffect, useState} from "react";
import {Conf} from "../config/Config";

export default function Twitch() {
    let [status, setStatus] = useState();
    let [twitch, setTwitch] = useState();
    let [element, setElement] = useState();

    useEffect(() => {
        if(!status)
            fetch(Conf.twitch + "status")
                .then(r => r.json())
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

    let show = () => {
        return status && status.type === "live"
    }

    let display = () => {
        if(show())
            return ""
        else
            return " d-none"
    }

    return (
        <Base>
            <MDBModal show={show()} className={"twitch-modal" + display()} size="fullscreen">
                <MDBModalBody className="twitch-modal">
                    <MDBRow className="twitch-row">
                        <MDBCol size="8" className="twitch-col">
                            <div id="twitch-stream-embed" className="twitch-main"/>
                        </MDBCol>
                        <MDBCol size="2" className="twitch-col">
                            <iframe id="twitch-chat-embed"
                                    title="twitch-chat"
                                    src={"https://www.twitch.tv/embed/hasanabi/chat?parent=" + Conf.embedded}
                                    height="100%"
                                    width="100%"/>
                        </MDBCol>
                        <MDBCol size="2" className="twitch-col">
                            <MDBCard className="banished">
                                <MDBCardHeader>
                                    <div className="twitch-close-container">
                                        <div className="text-center"><MDBIcon fas icon="gavel" className="me-2" />Banished chat</div>
                                        <div className="twitch-close">
                                            <MDBBtn className='btn-close' color='none' onClick={() => {setStatus({type: undefined})}}/>
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