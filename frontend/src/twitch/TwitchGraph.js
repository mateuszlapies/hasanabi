import {useEffect, useState} from "react";
import {Api, Scope} from "../config/Config";

import React from "react";
import { Group } from "@visx/group";
import { LinearGradient } from '@visx/gradient';
import {
    scaleLinear,
    scaleBand
} from "@visx/scale";
import {BoxPlot, ViolinPlot} from "@visx/stats";
import {PatternLines} from "@visx/pattern";

export default function TwitchGraph(props) {
    let [data, setData] = useState([]);
    let [scope, setScope] = useState(Scope.MONTH)
    useEffect(() => {
        fetch(Api.twitch + "timeline")
            .then(r => r.ok ? r.json() : setData([]))
            .then(j => setData(j));
    }, [scope]);

    if(data.length === 0) return null;
    if(!props.container.current) return null;

    const dimension = {
        width: props.container.current.offsetWidth,
        height: props.container.current.offsetHeight
    }

    let toTime = (d) => new Date(d).getTime();

    if (dimension.width < 10) return null;

    const xMax = dimension.width;
    const yMax = dimension.height - 120;

    const xScale = scaleBand({
        range: [0, xMax],
        round: true,
        domain: data.map(e => toTime(e.timestamp_min)),
        padding: 0.4,
    });

    const values = [];
    data.forEach((e) => values.push(e.viewer_count_min, e.viewer_count_max));
    const minYValue = Math.min(...values);
    const maxYValue = Math.max(...values);

    const yScale = scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [minYValue, maxYValue],
    });

    const boxWidth = xScale.bandwidth();
    const constrainedWidth = Math.min(40, boxWidth);

    return (
        <div className="position-relative">
            <svg width={dimension.width} height={dimension.height}>
                <LinearGradient id="stats" to="#8b6ce7" from="#87f2d4" />
                <rect x={0} y={0} width={dimension.width} height={dimension.height} fill="url(#stats)" rx={14}/>
                <PatternLines id="vp" height={3} width={3} stroke="#ced4da" strokeWidth={1} orientation={['horizontal']}/>
                <Group top={40}>
                    {data.map((e, i) => {
                            let q1 = (e.viewer_count_avg - e.viewer_count_min) / 2 + e.viewer_count_min;
                            let q3 = (e.viewer_count_max - e.viewer_count_avg) / 2 + e.viewer_count_avg;
                            return (<g key={i}>
                                <ViolinPlot
                                    data={e.vp_data}
                                    stroke="#dee2e6"
                                    left={xScale(toTime(e.timestamp_min))}
                                    width={constrainedWidth}
                                    valueScale={yScale}
                                    fill="url(#vp)"
                                />
                                <BoxPlot
                                    min={e.viewer_count_min}
                                    median={e.viewer_count_avg}
                                    max={e.viewer_count_max}
                                    firstQuartile={q1}
                                    thirdQuartile={q3}
                                    left={xScale(toTime(e.timestamp_min)) + 0.3 * constrainedWidth}
                                    boxWidth={constrainedWidth * 0.4}
                                    fill="#FFFFFF"
                                    fillOpacity={0.3}
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    valueScale={yScale}
                                    minProps={{
                                        onMouseOver: () => {},
                                        onMouseLeave: () => {},
                                    }}
                                    maxProps={{
                                        onMouseOver: () => {},
                                        onMouseLeave: () => {},
                                    }}
                                    boxProps={{
                                        onMouseOver: () => {},
                                        onMouseLeave: () => {},
                                    }}
                                    medianProps={{
                                        onMouseOver: () => {},
                                        onMouseLeave: () => {},
                                    }}
                                />
                            </g>)
                        }
                    )}
                </Group>
            </svg>
        </div>
    );
}