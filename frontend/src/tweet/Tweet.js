import ITweet from "./ITweet";
import BTweet from "./BTweet";
import PTweet from "./PTweet";

export default function Tweet(props) {
    if (props.tweet) {
        return (
            <a className="text-reset" href={"https://twitter.com/hasanthehun/status/" + props.tweet.id} target="_blank" rel="noreferrer">
                <ITweet profile={props.tweet.author_id} posted={props.tweet.created_at} url={"https://twitter.com/hasanthehun/status/" + props.tweet.id} />
                <BTweet tweet={props.tweet} className="tweet-body" />
                <PTweet public={props.tweet.public_metrics} className="tweet-public" />
            </a>
        );
    }
    return <></>
}