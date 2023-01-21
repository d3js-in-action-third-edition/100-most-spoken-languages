const drawTree = (root, descendants) => {

  // Dimensions
  const width = 1200;
  const padding = 2;
  const margin = {top:66, right: 0, bottom: 0, left:0};

  // Compute the layout
  const dx = 20;
  const dy = width / (root.height + padding);
  const treeLayoutGenerator = d3.tree()
    .nodeSize([dx, dy]);
  treeLayoutGenerator(root);

  // Center the tree
  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) {
      x1 = d.x;
    }
    if (d.x < x0) {
      x0 = d.x;
    }
  });

  // Compute the default height
  const height = x1 - x0 + dx * 2;

  // Append SVG container
  const svg = d3.select("#tree")
    .append("svg")
      .attr("viewBox", [-dy * padding / 2, x0 - dx, width, height + margin.top]); // Use a group translate instead?

  svg
    .append("defs")
    .append("filter")
      .attr("id", "filter-multiply")
    .append("feBlend")
      .attr("mode", "multiply");

  const vizContainer = svg
    .append("g")
      .attr("transform", `translate(0, ${margin.top})`);
  
  // Append links
  const linkGenerator = d3.link(d3.curveBumpX)
    .x(d => d.y)
    .y(d => d.x);
  vizContainer
    .append("g")
      .attr("class", "links-container")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-opacity", 0.6)
    .selectAll(".tree-link")
    .data(root.links())
    .join("path")
      .attr("class", "tree-link")
        .attr("d", d => linkGenerator(d));

  // Append nodes and labels
  vizContainer
    .append("g")
      .attr("class", "nodes-container")
    .selectAll(".node-tree")
    .data(descendants)
    .join("circle")
      .attr("class", "node-tree")
      .attr("cx", d => d.y)
      .attr("cy", d => d.x)
      .attr("r", d => d.depth === 3 ? radialScale(d.data.total_speakers) : 4)
      .attr("fill", d => d.depth === 3 
                      ? colorScale(d.parent.data.parent) 
                      : "white")
      .attr("fill-opacity", d => d.depth === 3 ? 0.15 : 1)
      .attr("stroke", d => d.depth === 3 ? "none" : "grey")
      .style("filter", "url(#filter-multiply)");

  vizContainer
    .append("g")
      .attr("class", "labels-container")
    .selectAll(".label-tree")
    .data(descendants)
    .join("text")
      .attr("class", "label-tree")
      .attr("x", d => d.children ? d.y - 8 : d.y + 8)
      .attr("y", d => d.x)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("alignment-baseline", "middle")
      .attr("paint-order", "stroke")
      .attr("stroke", d => d.depth ===3 ? "none" : "white")
      .attr("stroke-width", 2)
      .style("font-size", "14px")
      .text(d => d.data.child);

};