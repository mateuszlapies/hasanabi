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

    return (
        <MDBRow className="tweet-header">
            <MDBCol>
                {profile && (
                    <>
                        <img src={profile.profile_image_url} alt="profile_picture" className="me-3 rounded-circle shadow-3-strong" />
                        <a className="text-reset font-weight-bold" href={"https://twitter.com/" + profile.username} target="_blank" rel="noreferrer">
                            {profile.name}
                        </a>
                    </>
                )}
            </MDBCol>
            <MDBCol>
                <MDBTypography tag="span" className={"float-end " + (props.xsmall ? "text-x-sm" : "text-sm")}>
                    {new Date(props.posted).toLocaleDateString()} {new Date(props.posted).toLocaleTimeString()}
                </MDBTypography>
            </MDBCol>
        </MDBRow>
    )
}