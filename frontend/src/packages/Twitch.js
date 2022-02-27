import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBCol,
    MDBIcon,
    MDBInputGroup,
    MDBInputGroupElement,
    MDBModal,
    MDBModalBody,
    MDBRow
} from "mdb-react-ui-kit";
import Base from "./Base";
import {useEffect, useRef, useState} from "react";
import {Api} from "../config/Config";
import ViewsGraph from "../twitch/ViewsGraph";
import TimeGraph from "../twitch/TimeGraph";

export default function Twitch() {
    let [hide, setHide] = useState(false);
    let [status, setStatus] = useState();
    let [twitch, setTwitch] = useState();
    let [element, setElement] = useState();
    let [pets, setPets] = useState(false);
    let [twitchChat, setTwitchChat] = useState(false);
    let viewsRef = useRef();
    let timeRef = useRef();

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

    let vid = (p, c) => {
        if(p && c)
            return "twitch-vid-3";
        else if(p || c)
            return "twitch-vid-2";
        return "twitch-vid-1";
    }

    return (
        <Base>
            <MDBRow>
                <MDBCol>
                    <span className="float-end p-2">
                        <MDBBtn outline className="twitch-color-dark" onClick={() => setHide(false)}>Watch & Chat</MDBBtn>
                    </span>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol>
                    <div className="twitch" ref={viewsRef}>
                        <ViewsGraph container={viewsRef}/>
                    </div>
                    <div className="twitch-time" ref={timeRef}>
                        <TimeGraph container={timeRef}/>
                    </div>
                </MDBCol>
            </MDBRow>
            <MDBModal show={show(status, hide)} className={"twitch-modal" + display(status, hide)} size="fullscreen">
                <MDBModalBody className="twitch-modal position-relative bg-white">
                    <div className="position-absolute twitch-watch m-1">
                        <MDBBtn size="sm" className={"m-1 " + (pets && twitchChat ? "twitch-color-light" : "twitch-color-dark")} outline onClick={() => setHide(!hide)}>
                            Close
                        </MDBBtn>
                        <div hidden={!twitchChat} className="twitch-btn">
                            <MDBBtn size="sm" className={"m-1 " + (pets && twitchChat ? "twitch-color-light" : "twitch-color-dark")} outline onClick={() => setTwitchChat(!twitchChat)}>
                                Chat
                            </MDBBtn>
                        </div>
                        <div hidden={!pets} className="twitch-btn">
                            <MDBBtn size="sm" className={"m-1 " + (pets && twitchChat ? "twitch-color-light" : "twitch-color-dark")} outline onClick={() => setPets(!pets)}>
                                Pets
                            </MDBBtn>
                        </div>
                    </div>
                    <div className="twitch-row">
                        <div className={"twitch-watch-column " + vid(pets, twitchChat)}>
                            <div id="twitch-stream-embed" className="twitch-main"/>
                        </div>
                        <div className={"position-relative twitch-watch-column " + (twitchChat ? "twitch-chat-hid" : "twitch-chat")}>
                            <div className="twitch-chat-min" onClick={() => setTwitchChat(!twitchChat)}>
                                <MDBIcon fas icon="chevron-right" />
                            </div>
                            <iframe id="twitch-chat-embed"
                                    title="twitch-chat"
                                    src={"https://www.twitch.tv/embed/hasanabi/chat?parent=" + Api.embedded}
                                    height="100%"
                                    width="100%"/>
                        </div>
                        <div className={"twitch-watch-column " + (pets ? "twitch-chat-hid" : "twitch-chat")}>
                            <MDBCard className="banished">
                                <MDBCardHeader>
                                    <MDBRow>
                                        <MDBCol>
                                            <div className="text-center">
                                                <MDBIcon fas icon="paw" className="me-2" />Pets
                                            </div>
                                        </MDBCol>
                                        <MDBCol size="1">
                                            <div onClick={() => setPets(!pets)}>
                                                <MDBIcon fas icon="chevron-right" />
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
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
                        </div>
                    </div>
                </MDBModalBody>
            </MDBModal>
        </Base>
    )
}