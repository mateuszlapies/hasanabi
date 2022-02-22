import {useContext, useEffect, useState} from "react";
import {MDBCard, MDBCardBody, MDBCollapse} from "mdb-react-ui-kit";
import {StatusContext} from "../contexts/StatusContext";

export default function CTwitch() {
    let status = useContext(StatusContext);
    let [twitch, setTwitch] = useState();
    let [element, setElement] = useState();

    useEffect(() => {
        if(!element && status && status.type === "live") {
            let size = document.getElementById("twitch-embed");
            setElement({clientWidth: size.clientWidth, clientHeight: size.clientHeight});
        }
        if(status && status.type === "live" && !twitch && element) {
            setTwitch(new window.Twitch.Embed("twitch-embed", {
                width: element.clientWidth,
                height: element.clientHeight,
                channel: "hasanabi",
                autoplay: false,
                layout: "video",
                theme: "light"
            }));
        }
    }, [status, twitch, element]);

    let show = () => {
        if(status)
            return status.type === "live";
        return true;
    }

    return (
        <MDBCollapse style={{"height": "100%"}} show={show()}>
            <MDBCard className="card-el">
                <MDBCardBody>
                    <div id="twitch-embed" className="twitch"/>
                </MDBCardBody>
            </MDBCard>
        </MDBCollapse>
    )
}