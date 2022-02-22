import {useEffect, useState} from "react";
import {Api} from "../config/Config";
import {MDBCol, MDBRow, MDBTypography} from "mdb-react-ui-kit";

export default function ITweet(props) {
    let [profile, setProfile] = useState();
    useEffect(() => {
        if(props.profile)
            fetch(Api.twitter + "profile/" + props.profile)
                .then(r => r.json())
                .then(j => setProfile(j));
    }, [props]);

    if(profile) {
        return (
            <MDBRow className="tweet-header">
                <MDBCol>
                    <img src={profile.profile_image_url} alt="profile_picture" className="me-3 rounded-circle shadow-3-strong" />
                    <a className="text-reset font-weight-bold" href={"https://twitter.com/" + profile.username} target="_blank" rel="noreferrer">
                        {profile.name}
                    </a>
                </MDBCol>
                <MDBCol>
                    <MDBTypography tag="small" className="float-end">
                        {new Date(props.posted.replace("+00", "-08")).toLocaleDateString()} {new Date(props.posted.replace("+00", "-08")).toLocaleTimeString()}
                    </MDBTypography>
                </MDBCol>
            </MDBRow>
        )
    }
    return <></>
}