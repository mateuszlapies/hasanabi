import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Main from "./Main";
import Twitch from "./Twitch";
import Twitter from "./Twitter";
import Instagram from "./Instagram";

export default function Routing() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Main/>}/>
                <Route path="/twitch" element={<Twitch/>}/>
                <Route path="/twitter" element={<Twitter/>}/>
                <Route path="/instagram" element={<Instagram/>}/>
            </Routes>
        </Router>
    )
}