import Header from "./Header";
import Footer from "./Footer";
import {MDBContainer} from "mdb-react-ui-kit";
import {Conf} from "../config/Config";
import {useEffect, useState} from "react";

export default function Base(props) {
    let [profile, setProfile] = useState();
    let [status, setStatus] = useState();

    useEffect(() => {
        fetch(Conf.twitch + "profile")
            .then(r => r.json())
            .then(j => setProfile(j));

        fetch(Conf.twitch + "status")
            .then(r => r.json())
            .then(j => setStatus(j));
    }, [props]);

    let image = () => {
        if(status && profile) {
            return <img id="background" src={profile.offline_image_url} alt="offline"/>
        }
    }

    return (
        <>
            <Header/>
            {image()}
            <MDBContainer id="body" className="content">
                {props.children}
            </MDBContainer>
            <Footer/>
        </>
    )
}