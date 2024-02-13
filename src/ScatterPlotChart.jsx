import { React, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./ScatterPlotChart.css";
import { getTickDistancesMap } from "../../../utils/helper";

const ScatterPlotChart = ({
  data = [],
  xParameter = "",
  yParameter1 = "",
  yParameter2 = "",
  margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  colors = [],
  parentHeight,
}) => {
  const svgRef = useRef();
  const svgContainerStyle = {
    marginTop: `${margins["top"]}px`,
    marginBottom: `${margins["bottom"]}px`,
    marginRight: `${margins["right"]}px`,
    marginLeft: `${margins["left"]}px`,
  };

  const labels = data.map((d) => d[xParameter]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const height = parentHeight,
      width = 700;
    // width = svgRef.current.parentElement.clientWidth;

    svg.attr("height", height).attr("width", width);

    const xScale = d3
      .scaleLinear() // change to scaleLinear
      .domain([
        d3.min(data, (d) => d[xParameter]),
        d3.max(data, (d) => d[xParameter]),
      ]) // adjust the domain
      .range([margins.left, width - margins.left - margins.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d[yParameter1], d[yParameter2])), // adjust the domain
        d3.max(data, (d) => Math.max(d[yParameter1], d[yParameter2])), // adjust the domain
      ])
      .range([height - margins.top - margins.bottom, margins.top]);

    svg.append("g").call(xAxis);
    // .append("text")
    // .attr("title",(d) => console.log(d[xParameter],"d[xparameter]"));
    svg.append("g").call(yAxis);
    const tickDistancesMap = getTickDistancesMap(labels);

    console.log(tickDistancesMap, "tick distances map");

    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dots")
      .attr("cx", (d, i) => tickDistancesMap[d[xParameter]])
      .attr("cy", (d) => yScale(d[yParameter1]))
      .attr("r", 10)
      .attr("fill", colors);

    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dots")
      .attr("cx", (d, i) => tickDistancesMap[d[xParameter]])
      .attr("cy", (d) => yScale(d[yParameter2]))
      .attr("r", (d) => d[yParameter2])
      .attr("fill", colors)
      .append("title")
      .attr("class", "tooltip")
      .text((d) => d[xParameter] + " | " + d[yParameter2]);

    function xAxis(g) {
      g.attr(
        "transform",
        `translate(0,${height / 2})` // adjust the position
      ).call(
        d3
          .axisBottom(xScale)
          .tickSize(0)
          .tickPadding(10)
          
      );
    }

    function yAxis(g) {
      g.attr("transform", `translate(${width / 2}, 0)`) // adjust the position
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(0)
            .tickPadding(10)
            .ticks(0)
            .tickFormat((d) => (d != 0 ? d : d))
        );
    }

    // Cleanup Function
    return () => {
      const prevState = svgRef.current;
      if (prevState) {
        prevState.innerHTML = "";
      }
    };
  }, [data]);
  return (
    <div className="scatter-plot-container">
      <div
        className="scatter-plot"
        // style={{ ...svgContainerStyle }}
      >
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default ScatterPlotChart;