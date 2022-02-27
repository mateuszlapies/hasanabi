import Header from "./Header";
import Footer from "./Footer";
import {MDBContainer, MDBScrollbar} from "mdb-react-ui-kit";
import {Api} from "../config/Config";
import {useEffect, useState} from "react";
import {StatusContext} from "../contexts/StatusContext";

export default function Base(props) {
    let [error, setError] = useState(false);
    let [profile, setProfile] = useState();
    let [status, setStatus] = useState();

    useEffect(() => {
        if(!profile)
            fetch(Api.twitch + "profile")
                .then(r => r.json())
                .then(j => setProfile(j));

        fetch(Api.twitch + "status")
            .then(r => r.ok ? r.json() : setError(true))
            .then(j => setStatus(j));
    }, [props, profile]);

    let image = () => {
        if(profile && !error) {
            return <img id="background" src={profile.offline_image_url} alt="offline"/>
        }
    }

    return (
        <StatusContext.Provider value={status}>
            <Header/>
            <MDBScrollbar wheelSpeed={0.5}>
                {image()}
                <MDBContainer id="body">
                    {props.children}
                </MDBContainer>
                <Footer/>
            </MDBScrollbar>
        </StatusContext.Provider>
    )
}