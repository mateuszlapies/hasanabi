import {useEffect, useState} from "react";
import {Conf} from "../config/Config";
import {MDBCol, MDBRow} from "mdb-react-ui-kit";

export default function BTweet(props) {
    let [media, setMedia] = useState([]);

    useEffect(() => {
        if(props.tweet.attachments)
            fetch(Conf.twitter + "media?id=" + props.tweet.id + "&ids=" + props.tweet.attachments.media_keys.join(","))
                .then(r => r.json())
                .then(j => setMedia(j))
    }, [props])

    let fixText = (tweet) => {
        if(tweet.entities && tweet.entities.urls) {
            let arr = [tweet.text];
            tweet.entities.urls.forEach((i, index) => {
                let temp = arr[arr.length - 1].split(i.url);
                arr.pop();
                arr.push(temp[0]);
                if(i.display_url.indexOf("pic.twitter.com") < 0) {
                    arr.push(<a key={index} href={i.url} target="_blank" rel="noopener noreferrer">{i.display_url}</a>);
                }
                arr.push(temp[1]);
            });
            return arr;
        }
        return tweet.text;
    }

    return (
        <>
            <MDBRow>
                <MDBCol className="tweet-body">
                    {fixText(props.tweet)}
                </MDBCol>
            </MDBRow>
            <MDBRow>
                {media.map((i, index) =>
                    <MDBCol key={index}>
                        <img src={i.url} className='img-thumbnail' alt={i.alt_text} />
                    </MDBCol>
                )}
            </MDBRow>
        </>
    )
}