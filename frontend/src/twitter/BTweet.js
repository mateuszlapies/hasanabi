import {useEffect, useState} from "react";
import {Api} from "../config/Config";
import {MDBCol, MDBRow, MDBTypography} from "mdb-react-ui-kit";

export default function BTweet(props) {
    let [error, setError] = useState(false);
    let [media, setMedia] = useState([]);

    useEffect(() => {
        if(props.tweet.attachments)
            fetch(Api.twitter + "media?id=" + props.tweet.id + "&ids=" + props.tweet.attachments.media_keys.join(","))
                .then(r => r.ok ? r.json() : setError(true))
                .then(j => setMedia(j))
    }, [props])

    let fixText = (tweet) => {
        if(tweet.text && tweet.entities && tweet.entities.urls) {
            let arr = [tweet.text];
            tweet.entities.urls.forEach((i, index) => {
                if(arr[arr.length - 1]) {
                    let temp = arr[arr.length - 1].split(i.url);
                    arr.pop();
                    arr.push(temp[0]);
                    if (i.display_url.indexOf("pic.twitter.com") < 0) {
                        arr.push(<a key={index} href={i.url} target="_blank"
                                    rel="noopener noreferrer">{i.display_url}</a>);
                    }
                    arr.push(temp[1]);
                }
            });
            return arr;
        }
        return tweet.text;
    }

    let addMedia = (m) => {
        if(!error)
            return m.map((i, index) =>
                <MDBCol key={index}>
                    <img src={i.url} className='img-thumbnail' alt={i.alt_text} />
                </MDBCol>
            );
    }

    return (
        <>
            <MDBRow>
                <MDBCol className={props.className}>
                    <MDBTypography tag="span" className="tweet-text">
                        {fixText(props.tweet)}
                    </MDBTypography>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                {addMedia(media)}
            </MDBRow>
        </>
    )
}