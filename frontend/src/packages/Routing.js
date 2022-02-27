import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Main from "./Main";
import Twitch from "./Twitch";
import Twitter from "./Twitter";

export default function Routing() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Main/>}/>
                <Route path="/twitch" element={<Twitch/>}/>
                <Route path="/twitter" element={<Twitter/>}/>
            </Routes>
        </Router>
    )
}