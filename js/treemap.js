const drawTreeMap = (root, leaves) => {

  // Dimensions
  const width = 850;
  const height = 600;

  // Compute the layout
  const treemapLayoutGenerator = d3.treemap()
    .tile(d3.treemapBinary) // show results with different options
    .size(([width, height]))
    .paddingInner(2)
    .paddingOuter(2)
    // .paddingTop(2)
    // .paddingRight(2)
    // .paddingBottom(2)
    // .paddingLeft(2)
    .round(true);
  treemapLayoutGenerator(root);


  const svg = d3.select("#treemap")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const nodes = svg
    .selectAll(".node-container")
    .data(leaves)
    .join("g")
      .attr("class", "node-container")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  nodes 
    .append("rect")
      .attr("class", "treemap-node")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("fill", d => colorScale(d.parent.data.parent));

  nodes 
    .append("text")
      .attr("class", d => `treemap-label treemap-label-${d.data.child.replaceAll(" ", "-").replaceAll("'", "")}`)
      .attr("x", 5)
      .attr("y", 15)
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", 500)
      .text(d => d.data.child);

  d3.selectAll(".treemap-label")
    .style("opacity", d => {
      const textElement = document.querySelector(`.treemap-label-${d.data.child.replaceAll(" ", "-").replaceAll("'", "")}`);
      const textWidth = textElement.getBBox().width;
      return ((d.y1 - d.y0) >= 25) && ((d.x1 - d.x0) >= textWidth + 10) ? 1 : 0;
    });

  d3.selectAll(".treemap-node, .treemap-label")
    .on("mouseenter", (e, d) => {
      d3.select("#info-treemap .info-language").text(d.data.child);
      d3.select("#info-treemap .info-branch .information").text(d.data.parent);
      d3.select("#info-treemap .info-family .information").text(d.parent.data.parent);
      d3.select("#info-treemap .info-total-speakers .information").text(d3.format(".3s")(d.data.total_speakers));
      d3.select("#info-treemap .info-native-speakers .information").text(d3.format(".3s")(d.data.native_speakers));

      d3.select("#instructions-treemap").classed("hidden", true);
      d3.select("#info-treemap").classed("hidden", false);
    })
    .on("mouseleave", () => {
      d3.select("#instructions-treemap").classed("hidden", false);
      d3.select("#info-treemap").classed("hidden", true);
    });

};