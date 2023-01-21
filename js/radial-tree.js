const drawRadialTree = (root, descendants) => {

  // Dimensions
  const width = 1200;
  const height = 1200;
  const padding = 200;
  const margin = {top: padding, right: padding, bottom: padding, left: padding};
  const radius = (width - margin.left - margin.right) / 2; // outer radius of the tree

  // Generate the layout
  const radialTreeLayoutGenerator = d3.tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
  radialTreeLayoutGenerator(root);

  const svg = d3.select("#radial-tree")
    .append("svg")
      .attr("viewBox", [-margin.left - radius, -margin.top - radius, width, height]); // Could it be done with group translation?

  // Append links
  const linkGenerator = d3.linkRadial()
    .angle(d => d.x)
    .radius(d => d.y);
  svg
    .append("g")
      .attr("class", "links-container")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-opacity", 0.6)
    .selectAll(".radial-tree-link")
    .data(root.links())
    .join("path")
      .attr("class", "radial-tree-link")
      .attr("d", d => linkGenerator(d));

  // Append circles
  const nodes = svg
    .append("g")
      .attr("class", "nodes-container")
    .selectAll(".node-radial-container")
    .data(descendants)
    .join("g")
      .attr("class", "node-radial-container")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);
    
  nodes
    .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", d => d.depth === 3 ? radialScale(d.data.total_speakers) : 4)
      .attr("fill", d => d.depth === 3 
                      ? colorScale(d.parent.data.parent) 
                      : "white")
      .attr("fill-opacity", d => d.depth === 3 ? 0.15 : 1)
      .attr("stroke", d => d.depth === 3 ? "none" : "grey")
      .style("filter", "url(#filter-multiply)");

  // Append labels
  nodes
    .append("text")
      .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr("x", d => {
        if (d.x < Math.PI) {
          return d.children ? -8 : 8;
        } else {
          return d.children ? 8 : -8;
        }
      })
      .attr("text-anchor", d => {
        if (d.x < Math.PI) {
          return d.children ? "end" : "start";
        } else {
          return d.children ? "start" : "end";
        }
      })
      .attr("alignment-baseline", "middle")
      .attr("paint-order", "stroke")
      .attr("stroke", d => d.depth ===3 ? "none" : "white")
      .attr("stroke-width", 2)
      .style("font-size", "14px")
      .text(d => d.data.child);

};