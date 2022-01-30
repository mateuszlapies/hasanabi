import ITweet from "./ITweet";
import BTweet from "./BTweet";
import PTweet from "./PTweet";

export default function Tweet(props) {
    if (props.tweet) {
        return (
            <>
                <ITweet profile={props.tweet.author_id} posted={props.tweet.created_at} />
                <BTweet tweet={props.tweet} />
                <PTweet public={props.tweet.public_metrics} />
            </>
        );
    }
    return <></>
}