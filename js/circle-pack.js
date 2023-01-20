const drawCirclePack = (root) => {

  // Dimensions
  const width = 800;
  const height = 800;
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const radialScale = d3.scaleRadial()
    .domain([0, 400000000])
    .range([0, 100]);

  const colorScale = d3.scaleOrdinal()
    .domain(languageFamilies.map(d => d.label))
    .range(languageFamilies.map(d => d.color));

  // Compute the size of the circles
  // root.count(); // If all circles same size
  root.sum(d => radialScale(d.total_speakers)); // Show how deformed if no scale
  // root.sum(d => d.native_speakers === 0 ? 3 : radialScale(d.native_speakers));
  // root.sum(d => d.native_speakers === 0 ? 6 : d.native_speakers);

  // Compute labels and titles.
  const descendants = root.descendants();
  const leaves = descendants.filter(d => !d.children);
  console.log("descendants", descendants);
  console.log("leaves", leaves);

  root.sort((a, b) => d3.descending(a.value, b.value)); // Does that make a difference?

  // Compute the layout
  const packLayoutGenerator = d3.pack()
    .size([innerWidth, innerHeight])
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
        console.log(d);
        return `pack-circle pack-circle-${d.data.child.replaceAll(" ", "-")}`;
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
      .attr("width", d => 2.2 * d.r)
      .attr("height", d => 2.2 * d.r)
      .attr("x", d => d.x - 1.1 * d.r)
      .attr("y", d => d.y - 1.1 * d.r)
    .append("xhtml:div")
      .attr("class", "leaf-label")
      .text(d => d.data.child);


};