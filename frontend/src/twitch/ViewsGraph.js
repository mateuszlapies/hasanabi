import {useEffect, useState} from "react";
import {Api} from "../config/Config";

import React from "react";
import { Group } from "@visx/group";
import { LinearGradient } from '@visx/gradient';
import { scaleLinear, scaleBand } from "@visx/scale";
import {BoxPlot, ViolinPlot} from "@visx/stats";
import {PatternLines} from "@visx/pattern";
import {AxisLeft} from "@visx/axis";
import {Brush} from "@visx/brush";
import {AreaClosed} from "@visx/shape";
import { curveMonotoneX } from '@visx/curve';
import { Tooltip, defaultStyles as defaultTooltipStyles } from '@visx/tooltip';
import {MDBCol, MDBRow} from "mdb-react-ui-kit";

export default function ViewsGraph(props) {
    let [brush, setBrush] = useState([]);
    let [data, setData] = useState([]);
    let [defaultScope, setDefault] = useState({after: undefined, before: undefined});
    let [scope, setScope] = useState({after: undefined, before: undefined});
    let [tooltip, setTooltip] = useState();
    useEffect(() => {
        fetch(Api.twitch + "brush")
            .then(r => r.ok ? r.json() : setBrush([]))
            .then(j => {
                setBrush(j.brush);
                setScope(j.scope)
                setDefault(j.scope);
            })
    }, [props]);

    useEffect(() => {
        let filter = "";
        if(scope.after && scope.before)
            filter = "?after=" + scope.after + "&before=" + scope.before;
        fetch(Api.twitch + "viewsgraph" + filter)
            .then(r => r.ok ? r.json() : setData([]))
            .then(j => setData(j));
    }, [scope]);

    if(data.length === 0) return null;
    if(brush.length === 0) return null;
    if(!props.container.current) return null;

    let dimension = {
        width: props.container.current.offsetWidth,
        height: props.container.current.offsetWidth * 9 / 16
    }

    let toTime = (d) => new Date(d).getTime();

    if (dimension.width < 10) return null;

    let xMax = dimension.width;
    let yMax = dimension.height - 80;
    let yMaxBrush = dimension.height * 0.125;

    let xBrushScale = scaleBand({
        range: [0, xMax],
        domain: brush.map((e) => toTime(e.timestamp)),
        padding: 0.4
    });

    let xScale = scaleBand({
        range: [0, xMax],
        round: true,
        domain: data.map(e => toTime(e.timestamp_min)),
        padding: 0.4,
    });

    let brushValues = [];
    brush.forEach((e) => brushValues.push(e.viewers));
    let minYBrushValue = Math.min(...brushValues);
    let maxYBrushValue = Math.max(...brushValues);

    let yBrushScale = scaleLinear({
        range: [yMaxBrush, 0],
        domain: [minYBrushValue, maxYBrushValue],
    });

    let values = [];
    data.forEach((e) => values.push(e.viewer_count_min, e.viewer_count_max));
    let minYValue = Math.min(...values);
    let maxYValue = Math.max(...values);

    let yScale = scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [minYValue, maxYValue],
    });

    let boxWidth = xScale.bandwidth();
    let constrainedWidth = Math.min(40, boxWidth);

    let onBrushChange = (domain) => {
        if (!domain) {
            setScope({after: undefined, before: undefined});
            return;
        }
        const { xValues } = domain;
        if(xValues.length > 1)
            setScope({after: Math.min(...xValues), before: Math.max(...xValues)});
        else if(xValues.length > 0)
            setScope({after: xValues[0], before: xValues[1]});
    };

    let defaultScopeScaled = {
        start: {
            x: xBrushScale(defaultScope.after ? defaultScope.after : 0)
        },
        end: {
            x: xBrushScale(defaultScope.before ? defaultScope.before : 0)
        }
    }

    return (
        <MDBRow>
            <MDBCol>
                <h4>Viewer count per stream title</h4>
                <svg width={dimension.width} height={dimension.height}  className="mb-1">
                    <LinearGradient id="stats" to="#b9a3e3" from="#6441a5" />
                    <rect x={0} y={0} width={dimension.width} height={dimension.height} fill="url(#stats)" rx={14}/>
                    <PatternLines id="vp" height={3} width={3} stroke="#262626" strokeWidth={1} orientation={['horizontal']}/>
                    <AxisLeft
                        scale={yScale}
                        top={40}
                        left={dimension.width * 0.05}
                        tickStroke="#f1f1f1"
                        stroke="#f1f1f1"
                        tickLabelProps={() => ({
                            dx: '-0.25em',
                            dy: '0.25em',
                            fill: '#f1f1f1',
                            fontFamily: 'Arial',
                            fontSize: 10,
                            textAnchor: 'end',
                        })}
                    />
                    <Group top={40}>
                        {data.map((e, i) => {
                            let q1 = (e.viewer_count_avg - e.viewer_count_min) / 2 + e.viewer_count_min;
                            let q3 = (e.viewer_count_max - e.viewer_count_avg) / 2 + e.viewer_count_avg;
                            return (<g key={i}>
                                <ViolinPlot
                                    data={e.vp_data}
                                    stroke="#262626"
                                    left={xScale(toTime(e.timestamp_min)) + dimension.width * 0.075}
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
                                    left={xScale(toTime(e.timestamp_min)) + 0.3 * constrainedWidth + dimension.width * 0.075}
                                    boxWidth={constrainedWidth * 0.4}
                                    fill="#f1f1f1"
                                    fillOpacity={0.3}
                                    stroke="#f1f1f1"
                                    strokeWidth={2}
                                    valueScale={yScale}
                                    minProps={{
                                        onMouseOver: () => setTooltip({
                                            tooltipTop: yScale(e.viewer_count_avg) ?? 40,
                                            tooltipLeft: xScale(toTime(e.timestamp_min)) + constrainedWidth + 5,
                                            tooltipData: {
                                                name: e.title,
                                                min: e.viewer_count_min,
                                                avg: e.viewer_count_avg,
                                                max: e.viewer_count_max,
                                                q1: q1,
                                                q3: q3,
                                                start: e.timestamp_min,
                                                end: e.timestamp_max,
                                                time: toTime(e.timestamp_max) - toTime(e.timestamp_min)
                                            }
                                        }),
                                        onMouseLeave: () => setTooltip(undefined),
                                    }}
                                    maxProps={{
                                        onMouseOver: () => setTooltip({
                                            tooltipTop: yScale(e.viewer_count_avg) ?? 40,
                                            tooltipLeft: xScale(toTime(e.timestamp_min)) + constrainedWidth + 5,
                                            tooltipData: {
                                                name: e.title,
                                                min: e.viewer_count_min,
                                                avg: e.viewer_count_avg,
                                                max: e.viewer_count_max,
                                                q1: q1,
                                                q3: q3,
                                                start: e.timestamp_min,
                                                end: e.timestamp_max,
                                                time: toTime(e.timestamp_max) - toTime(e.timestamp_min)
                                            }
                                        }),
                                        onMouseLeave: () => setTooltip(undefined),
                                    }}
                                    boxProps={{
                                        onMouseOver: () => setTooltip({
                                            tooltipTop: yScale(e.viewer_count_avg) ?? 40,
                                            tooltipLeft: xScale(toTime(e.timestamp_min)) + constrainedWidth + 5,
                                            tooltipData: {
                                                name: e.title,
                                                min: e.viewer_count_min,
                                                avg: e.viewer_count_avg,
                                                max: e.viewer_count_max,
                                                q1: q1,
                                                q3: q3,
                                                start: e.timestamp_min,
                                                end: e.timestamp_max,
                                                time: toTime(e.timestamp_max) - toTime(e.timestamp_min)
                                            }
                                        }),
                                        onMouseLeave: () => setTooltip(undefined),
                                    }}
                                    medianProps={{
                                        onMouseOver: () => setTooltip({
                                            tooltipTop: yScale(e.viewer_count_avg) ?? 40,
                                            tooltipLeft: xScale(toTime(e.timestamp_min)) + constrainedWidth + 5,
                                            tooltipData: {
                                                name: e.title,
                                                min: e.viewer_count_min,
                                                avg: e.viewer_count_avg,
                                                max: e.viewer_count_max,
                                                q1: q1,
                                                q3: q3,
                                                start: e.timestamp_min,
                                                end: e.timestamp_max,
                                                time: toTime(e.timestamp_max) - toTime(e.timestamp_min)
                                            }
                                        }),
                                        onMouseLeave: () => setTooltip(undefined),
                                    }}
                                />
                            </g>)}
                        )}
                    </Group>
                </svg>
                {tooltip && (
                    <Tooltip
                        top={tooltip.tooltipTop}
                        left={tooltip.tooltipLeft}
                        style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
                    >
                        <MDBRow>
                            <MDBCol><h6>{tooltip.tooltipData.name}</h6></MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <MDBRow>
                                    <MDBCol>
                                        <strong>Time</strong>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        {tooltip.tooltipData.time && <div>time: {new Date(tooltip.tooltipData.time).toLocaleTimeString()}</div>}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        {tooltip.tooltipData.start && <div>{new Date(tooltip.tooltipData.start).toLocaleString()}</div>}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        {tooltip.tooltipData.end && <div>{new Date(tooltip.tooltipData.end).toLocaleString()}</div>}
                                    </MDBCol>
                                </MDBRow>
                            </MDBCol>
                            <MDBCol size={5}>
                                <MDBRow>
                                    <MDBCol>
                                        <strong>Viewers</strong>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        {tooltip.tooltipData.avg && <div>avg: {tooltip.tooltipData.avg}</div>}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        {tooltip.tooltipData.min && <div>min: {tooltip.tooltipData.min}</div>}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        {tooltip.tooltipData.max && <div>max: {tooltip.tooltipData.max}</div>}
                                    </MDBCol>
                                </MDBRow>
                            </MDBCol>
                        </MDBRow>
                    </Tooltip>
                )}
                <svg width={dimension.width} height={yMaxBrush} className="mt-1">
                    <LinearGradient id="gradient" from="#b9a3e3" to="#b9a3e3" />
                    <rect x={0} y={0} width={dimension.width} height={yMaxBrush} fill={"url(#gradient)"} rx={14} />
                    <Group>
                        <LinearGradient
                            id="brush_gradient"
                            from="#6441a5"
                            fromOpacity={1}
                            to="#6441a5"
                            toOpacity={0.2}
                        />
                        <AreaClosed
                            data={brush}
                            x={(d) => xBrushScale(toTime(d.timestamp))}
                            y={(d) => yBrushScale(d.viewers)}
                            yScale={yBrushScale}
                            strokeWidth={1}
                            stroke="url(#brush_gradient)"
                            fill="url(#brush_gradient)"
                            curve={curveMonotoneX}
                        />
                        <PatternLines
                            id="brush"
                            width={8}
                            height={8}
                            stroke="#f6acc8"
                            strokeWidth={1}
                            orientation={['diagonal']}
                        />
                        <Brush
                            xScale={xBrushScale}
                            yScale={yBrushScale}
                            width={dimension.width}
                            height={yMaxBrush}
                            handleSize={8}
                            resizeTriggerAreas={['left', 'right']}
                            brushDirection="horizontal"
                            selectedBoxStyle={{fill: "url(#brush)", stroke: "white"}}
                            initialBrushPosition={defaultScopeScaled}
                            onChange={onBrushChange}
                            useWindowMoveEvents
                        />
                    </Group>
                </svg>
            </MDBCol>
        </MDBRow>
    );
}