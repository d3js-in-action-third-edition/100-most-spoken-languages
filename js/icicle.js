const drawIcicle = (root, descendants) => {

  // Dimensions
  const width = 1200;
  const height = 600;

  // Compute the layout
  const icicleLayoutGenerator = d3.partition()
    .size([width, height])
    .padding(1)
    .round(false);
  icicleLayoutGenerator(root);

  const svg = d3.select("#icicle")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const cells = svg
    .selectAll(".cell-container")
    .data(descendants)
    .join("g")
      .attr("class", "cell-container")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  cells
    .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => {
        switch(d.depth) {
          case 0:
            return "gray";
          case 1:
            return colorScale(d.data.child);
          case 2:
            return colorScale(d.data.parent);
          case 3:
            return colorScale(d.parent.data.parent);
        };
      });

  cells
    .append("text")
      .attr("x", -5)
      .attr("y", 12)
      .attr("fill", "white")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-weight", 500)
      .style("opacity", d => (d.x1 - d.x0) >= 18 ? 1 : 0)
      .text(d => d.data.child);

};