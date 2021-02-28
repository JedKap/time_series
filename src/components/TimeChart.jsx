import React, { useState, useRef, useEffect } from "react";
import data from "../categorized_domain_requests.json";
import AddRequest from "./AddRequest";
import Legend from "./Legend";
import * as d3 from "d3";

const TimeChart = () => {
  const [chartData, setChartData] = useState(data.categorized_domain_requests);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const colors = [
    {
      label: "Human Total",
      color: "blue",
    },
    {
      label: "Good Bot Total",
      color: "green",
    },
    {
      label: "Bad Bot Total",
      color: "red",
    },
    {
      label: "White List Total",
      color: "purple",
    },
  ];
  const svgRef = useRef();
  const width = 800;
  const height = 400;
  const leftPadding = 40;

  const parseTime = d3.timeFormat("%Y-%b-%d");
  const parseTime2 = d3.timeFormat("%Y-%m-%d");

  const handleHideAddRequest = () => {
    setShowAddRequest(false);
  };

  const parseDate = (d) => {
    // yyyy-mm-dd
    const date = d.split("-");
    return new Date(date[0], date[1] - 1, date[2]);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const minDate = d3.min(chartData, (d) => parseDate(d.summary_date));
    const maxDate = d3.max(chartData, (d) => parseDate(d.summary_date));

    const maxVal = d3.max(chartData, (d) =>
      Math.max(
        d.human_total,
        d.good_bot_total,
        d.bad_bot_total,
        d.whitelist_total
      )
    );

    const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.02])
      .range([height, 0]);

    const content = svg.select(".content");
    content.selectAll("*").remove();

    const addDataLine = (sc, data) => {
      const grp = content.append("g").attr("class", "datablock");

      grp
        .selectAll(".request")
        .data(data)
        .join(
          (enter) => enter.append("circle"),
          (update) => update.attr("class", "request"),
          (exit) => exit.remove()
        )
        .attr("cx", (r) => leftPadding + xScale(parseDate(r.sd)))
        .attr("cy", (r) => yScale(r.dt))
        .attr("r", 3)
        .style("stroke", sc)
        .style("fill", sc);

      const newLine = d3
        .line()
        .x((d) => leftPadding + xScale(parseDate(d.sd)))
        .y((d) => yScale(d.dt));

      grp
        .selectAll("path")
        .data([data])
        .join(
          (enter) => enter.append("path"),
          (update) => update.attr("class", "pRequest"),
          (exit) => exit.remove()
        )
        .attr("fill", "none")
        .attr("stroke", sc)
        .attr("d", (value) => newLine(value));
    };

    addDataLine(
      colors[0].color,
      chartData.map((x) => {
        return { sd: x.summary_date, dt: x.bad_bot_total };
      })
    );

    addDataLine(
      colors[1].color,
      chartData.map((x) => {
        return { sd: x.summary_date, dt: x.good_bot_total };
      })
    );
    addDataLine(
      colors[2].color,
      chartData.map((x) => {
        return { sd: x.summary_date, dt: x.human_total };
      })
    );

    addDataLine(
      colors[3].color,
      chartData.map((x) => {
        return { sd: x.summary_date, dt: x.whitelist_total };
      })
    );

    const xAxis = d3.axisBottom(xScale);
    svg
      .select(".x-axis")
      .style("transform", `translate(40px, ${height}px)`)
      .call(xAxis)
      .selectAll("text")
      .text((d) => parseTime(d))
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    const yAxis = d3.axisLeft(yScale);
    svg.select(".y-axis").style("transform", `translate(40px)`).call(yAxis);
  }, [chartData]);

  const onAddRequestInputChange = (numValue, dateValue, dateType) => {
    // THERE ISN'T ANY REAL DATE VALIDATION
    // search to see if overwriting an exist
    const setValue = (node) => {
      colors.forEach((c) => {
        switch (dateType) {
          default:
            break;
          case colors[0].color: {
            node.human_total = parseInt(numValue);
            break;
          }
          case colors[1].color: {
            node.good_bot_total = parseInt(numValue);
            break;
          }
          case colors[2].color: {
            node.bad_bot_total = parseInt(numValue);
            break;
          }
          case colors[3].color: {
            node.whitelist_total = parseInt(numValue);
            break;
          }
        }
        node.overall_total =
          +node.human_total +
          node.good_bot_total +
          node.bad_bot_total +
          node.whitelist_total;
      });
    };

    if (dateType && dateType !== "" && dateValue) {
      let newChartData = [...chartData]; // make a copy
      const cd = newChartData.find((x) => x.summary_date === dateValue);
      if (cd) {
        setValue(cd);
      } else {
        const newCD = {
          summary_date: dateValue,
          human_total: 0,
          good_bot_total: 0,
          bad_bot_total: 0,
          whitelist_total: 0,
          overall_total: 0,
        };
        setValue(newCD);
        newChartData = [...newChartData, newCD];
      }

      setChartData(newChartData);
    }

    console.log(numValue, dateValue);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "200px" }}> </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              width: "900px",
              height: "600px",
              border: "solid red 2px",
            }}
          >
            <svg
              style={{
                width: "100%",
                height: "100%",
                padding: "40px 20px 20px 20px ",
              }}
              ref={svgRef}
              id="ImpervaTimeChart"
              className="d3_timechart"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="x-axis" />
              <g className="y-axis" />
              <g className="content" />
            </svg>
            <div style={{ width: "100%" }}>
              <input
                style={{
                  width: "280px",
                  height: "30px",
                  border: "black",
                  background: "blue",
                  color: "white",
                  fontWeight: "700",
                }}
                value="Add Another Request"
                type="button"
                onClick={() => setShowAddRequest(true)}
              />
            </div>{" "}
          </div>
          <Legend colors={colors} />
        </div>
      </div>
      <AddRequest
        showAddRequest={showAddRequest}
        hideAddRequest={handleHideAddRequest}
        onAddRequestInputChange={onAddRequestInputChange}
        colors={colors}
        maxDate={parseTime2(
          d3.max(chartData, (d) => parseDate(d.summary_date))
        )}
      />
    </>
  );
};

export default TimeChart;
