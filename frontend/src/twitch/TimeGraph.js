import React, {useEffect, useState} from "react";
import {scaleBand, scaleLinear} from "@visx/scale";
import {Group} from "@visx/group";
import {GradientPurpleRed, LinearGradient} from "@visx/gradient";
import {Bar} from "@visx/shape";
import {Api} from "../config/Config";
import {AxisBottom, AxisLeft} from "@visx/axis";
import {MDBCol, MDBRow} from "mdb-react-ui-kit";

export default function TimeGraph(props) {
    let [stats, setStats] = useState([]);

    useEffect(() => {
        fetch(Api.twitch + "timegraph")
            .then(r => r.ok ? r.json() : setStats([]))
            .then(j => setStats(j))
    },[props]);

    if(!props.container.current) return null;

    let dimension = {
        width: props.container.current.offsetWidth,
        height: props.container.current.offsetWidth * 6 / 16
    }

    if(dimension.width < 10) return null;
    if(stats.length === 0) return null;

    const xScale = scaleBand({
            range: [0, dimension.width],
            round: true,
            domain: stats.map((e) => e.date),
            padding: 0.4
        });
    const yScale = scaleLinear({
            range: [dimension.height, 0],
            round: true,
            domain: [0, Math.max(...stats.map(e => e.time))],
        });

    return (
        <MDBRow className="pt-4">
            <MDBCol>
                <h4>Amount of streamed hours per day</h4>
                <svg width={dimension.width} height={dimension.height + 80}>
                    <LinearGradient id="teal" to="#6441a5" from="#b9a3e3" />
                    <rect width={dimension.width} height={dimension.height + 80} fill="url(#teal)" rx={14} />
                    <Group top={40}>
                        {stats.map((d, i) =>
                            <g key={i}>
                                <GradientPurpleRed id="gradient"/>
                                <Bar
                                    x={xScale(d.date)}
                                    y={dimension.height - (dimension.height - (yScale(d.time)) ?? 0)}
                                    width={xScale.bandwidth()}
                                    height={dimension.height - (yScale(d.time)) ?? 0}
                                    fill="url(#gradient)"
                                />
                            </g>
                        )}
                    </Group>
                    <AxisLeft
                        scale={yScale}
                        top={40}
                        left={dimension.width * 0.05}
                        tickStroke="#f1f1f1"
                        stroke="#f1f1f1"
                        hideZero
                        tickLabelProps={() => ({
                            dx: '-0.25em',
                            dy: '0.25em',
                            fill: '#f1f1f1',
                            fontFamily: 'Arial',
                            fontSize: 10,
                            textAnchor: 'end',
                        })}
                    />
                    <AxisBottom
                        scale={xScale}
                        top={dimension.height + 40}
                        tickStroke="#f1f1f1"
                        stroke="#f1f1f1"
                        tickLabelProps={() => ({
                            fill: '#f1f1f1',
                            fontFamily: 'Arial',
                            fontSize: 10,
                            textAnchor: 'middle',
                        })}
                    />
                </svg>
            </MDBCol>
        </MDBRow>
    )
}