import {BrowserRouter, Route} from "react-router-dom";
import Main from "./Main";
import Twitch from "./Twitch";
import Twitter from "./Twitter";
import Instagram from "./Instagram";

export default function Router() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={Main} />
            <Route path="/twitch" component={Twitch} />
            <Route path="/twitter" component={Twitter} />
            <Route path="/instagram" component={Instagram} />
        </BrowserRouter>
    )
}