import {useEffect} from "react";
import {MDBCard, MDBCardBody} from "mdb-react-ui-kit";

export default function CTwitch() {
    useEffect(() => {
        let size = document.getElementById("twitch-embed");
        new window.Twitch.Embed("twitch-embed", {
            width: size.clientWidth,
            height: size.clientHeight,
            channel: "hasanabi",
            autoplay: false,
            layout: "video",
            theme: "light"
        });
    });

    return (
        <MDBCard className="card-el">
            <MDBCardBody className="p-2">
                <div id="twitch-embed" className="twitch"/>
            </MDBCardBody>
        </MDBCard>
    )
}