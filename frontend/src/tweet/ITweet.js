import {useEffect, useState} from "react";
import {Conf} from "../config/Config";
import {MDBCol, MDBRow} from "mdb-react-ui-kit";

export default function ITweet(props) {
    let [profile, setProfile] = useState();
    useEffect(() => {
        if(props.profile)
            fetch(Conf.twitter + "profile/" + props.profile)
                .then(r => r.json())
                .then(j => setProfile(j));
    }, [props]);

    if(profile) {
        return (
            <MDBRow className="tweet-header">
                <MDBCol>
                    <img src={profile.profile_image_url} alt="profile_picture" className="me-3 rounded-circle shadow-3-strong" />
                    <a className="text-reset" href={"https://twitter.com/" + profile.username} rel="opener" target="_blank">{profile.name}</a>
                </MDBCol>
                <MDBCol>
                    <div className="float-end">
                        {new Date(props.posted).toLocaleDateString("en-US")} {new Date(props.posted).toLocaleTimeString("en-US")}
                    </div>
                </MDBCol>
            </MDBRow>
        )
    }
    return <></>
}