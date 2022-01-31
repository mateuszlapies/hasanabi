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

    let flatMap = (array, fn) => {
        let result = [];
        for (let i = 0; i < array.length - 1; i++) {
            let mapping = fn(array[i]);
            result = result.concat(mapping);
        }
        return result;
    }

    let fixText = (tweet) => {
        let text = tweet.text;
        if(text) {
            if(tweet.entities && tweet.entities.urls) {
                tweet.entities.urls.forEach((i, index) =>
                    text = flatMap(text.split(i.url), (p) => [p, <a key={index} rel='opener' target='_blank' href={i.display_url}>{i.display_url}</a>]))
            }
        }
        return text;
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