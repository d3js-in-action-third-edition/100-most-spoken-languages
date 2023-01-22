Promise.all([
  d3.csv("../data/top_100_languages.csv", d3.autoType),
  d3.csv("../data/flat_data_with_speakers.csv", d3.autoType),
]).then(data => {
  const languagesData = data[0];
  const flatData = data[1];
  console.log("languagesData", languagesData);
  console.log("flatData", flatData);

  // Format data
  const stratify = d3.stratify()
    .id(d => d.child)
    .parentId(d => d.parent);
  const root = stratify(flatData);
  console.log("root data", root.data);

  const descendants = root.descendants();
  const leaves = descendants.filter(d => !d.children);
  console.log("descendants", descendants);
  console.log("leaves", leaves);

  // root.sort((a, b) => d3.descending(a.value, b.value)); // Does that make a difference?

  // Call functions that will draw the charts
  setScales(leaves);
  drawCirclePack(root, descendants, leaves);
  drawTree(root, descendants);
  drawRadialTree(root, descendants);
  drawTreeMap(root, leaves);
  drawIcicle(root, descendants);
});