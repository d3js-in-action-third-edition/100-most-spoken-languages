const drawCirclePack = (root, descendants, leaves) => {

  // Dimensions
  const width = 800;
  const height = 800;


  // Compute the size of the circles
  root.sum(d => d.total_speakers);

  // Compute the layout
  const packLayoutGenerator = d3.pack()
    .size([width, height])
    .padding(3); // Separation between circles
  const pack = packLayoutGenerator(root);

  // Append SVG container
  const svg = d3.select("#circle-pack")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Append circles
  const circles = svg
    .append("g")
      .attr("class", "circles-container")
    .selectAll(".pack-circle")
    .data(descendants)
    .join("circle")
      .attr("class", d => {
        // console.log(d);
        const isLanguage = d.depth === 3 ? "language" : "";
        return `pack-circle pack-circle-${d.data.child.replaceAll(" ", "-")} ${isLanguage}`;
      })
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r)
      .attr("fill", d => {
        switch (d.depth) {
          case 0:
            return "transparent";
          case 1:
            return colorScale(d.data.child);
          case 2:
            return d3.interpolate(colorScale(d.data.parent), "white")(0.5)
          default:
            return "white";
        };
      })
      .attr("stroke", "none");

  // Append labels
  const minRadius = 22;
  const leavesLabels = svg
    .append("g")
      .attr("class", "leaves-labels")
    .selectAll(".leaf-label-object")
    .data(leaves.filter(leave => leave.r >= minRadius))
    .join("foreignObject")
      .attr("class", "leaf-label-object")
      .attr("width", d => 2 * d.r)
      .attr("height", 40)
      .attr("x", d => d.x - d.r)
      .attr("y", d => d.y - 20)
    .append("xhtml:div")
      .attr("class", "leaf-label")
      .text(d => d.data.child);



  // Append legend
  const legendFamilies = d3.select("#legend-families")
    .append("ul")
    .selectAll(".legend-family")
    .data(languageFamilies)
    .join("li");
  legendFamilies
    .append("span")
      .attr("class", "legend-color")
      .style("background-color", d => colorScale(d.label));
  legendFamilies
    .append("span")
      .attr("class", "legend-label")
      .text(d => d.label);

  const speakersMax = 1000000000;
  const speakersMedium = 100000000;
  const speakersMin = 10000000;
  const legendSpeakers = d3.select("#legend-speakers")
    .append("svg")
      .attr("width", 260)
      .attr("height", 160)
    .append("g")
      .attr("transform", "translate(1, 10)");
  const legendCircles = legendSpeakers 
    .append("g")
      .attr("fill", "transparent")
      .attr("stroke", "#272626");
  legendCircles
    .append("circle")
      .attr("cx", radialScale(speakersMax))
      .attr("cy", radialScale(speakersMax))
      .attr("r", radialScale(speakersMax));
  legendCircles
    .append("circle")
      .attr("cx", radialScale(speakersMax))
      .attr("cy", 2*radialScale(speakersMax) - radialScale(speakersMedium))
      .attr("r", radialScale(speakersMedium));
  legendCircles
    .append("circle")
      .attr("cx", radialScale(speakersMax))
      .attr("cy", 2*radialScale(speakersMax) - radialScale(speakersMin))
      .attr("r", radialScale(speakersMin));

  const linesLength = 100;
  const legendLines = legendSpeakers
    .append("g")
      .attr("stroke", "#272626")
      .attr("stroke-dasharray", "6 4");
  legendLines
    .append("line")
      .attr("x1", radialScale(speakersMax))
      .attr("y1", 0)
      .attr("x2", radialScale(speakersMax) + linesLength)
      .attr("y2", 0);
  legendLines
    .append("line")
      .attr("x1", radialScale(speakersMax))
      .attr("y1", 2*radialScale(speakersMax) - 2*radialScale(speakersMedium))
      .attr("x2", radialScale(speakersMax) + linesLength)
      .attr("y2", 02*radialScale(speakersMax) - 2*radialScale(speakersMedium));
  legendLines
    .append("line")
      .attr("x1", radialScale(speakersMax))
      .attr("y1", 2*radialScale(speakersMax) - 2*radialScale(speakersMin))
      .attr("x2", radialScale(speakersMax) + linesLength)
      .attr("y2", 02*radialScale(speakersMax) - 2*radialScale(speakersMin));

  const labels = legendSpeakers
    .append("g")
      .attr("fill", "#272626")
      .attr("dominant-baseline", "middle");
  labels
    .append("text")
      .attr("x", radialScale(speakersMax) + linesLength + 5)
      .attr("y", 0)
      .text(d3.format(".1s")(speakersMax));
  labels
    .append("text")
      .attr("x", radialScale(speakersMax) + linesLength + 5)
      .attr("y", 2*radialScale(speakersMax) - 2*radialScale(speakersMedium))
      .text(d3.format(".1s")(speakersMedium));
  labels
    .append("text")
      .attr("x", radialScale(speakersMax) + linesLength + 5)
      .attr("y", 2*radialScale(speakersMax) - 2*radialScale(speakersMin))
      .text(d3.format(".1s")(speakersMin));


  // Interactions
  d3.selectAll(".language, foreignObject")
    .on("mouseenter", (e, d) => {
      console.log(d)
      d3.select(".info-language").text(d.data.child);
      d3.select(".info-branch .information").text(d.data.parent);
      d3.select(".info-family .information").text(d.parent.data.parent);
      d3.select(".info-total-speakers .information").text(d3.format(".3s")(d.data.total_speakers));
      d3.select(".info-native-speakers .information").text(d3.format(".3s")(d.data.native_speakers));

      d3.select("#instructions").classed("hidden", true);
      d3.select("#info").classed("hidden", false);
    })
    .on("mouseleave", () => {
      d3.select("#instructions").classed("hidden", false);
      d3.select("#info").classed("hidden", true);
    });

};