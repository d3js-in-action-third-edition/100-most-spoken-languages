Promise.all([
  d3.csv("./data/top_100_languages.csv", d3.autoType),
  d3.csv("./data/flat_data_with_speakers.csv", d3.autoType),
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
  console.log("root", root);

  const descendants = root.descendants();
  const leaves = descendants.filter(d => !d.children);
  console.log("descendants", descendants);
  console.log("leaves", leaves);

  const jsonObject = { name: "Languages", children: [] };
  descendants.filter(d => d.depth === 1).forEach(d => {
    const family = { name: d.data.child, children: [] };
    d.children.forEach(b => {
      const branch = { name: b.data.child, children: [] };
      b.children.forEach(l => {
        const lang = { name: l.data.child, total_speakers: l.data.total_speakers, native_speakers: l.data.native_speakers }
        branch.children.push(lang)
      })
      family.children.push(branch);
    })
    jsonObject.children.push(family);
  })
  console.log("json", jsonObject)

  // root.sort((a, b) => d3.descending(a.value, b.value)); // Does that make a difference?

  // Call functions that will draw the charts
  setScales(leaves);
  drawCirclePack(root, descendants, leaves);
  drawTree(root, descendants);
  drawRadialTree(root, descendants);
  drawTreeMap(root, leaves);
  drawIcicle(root, descendants);
});

d3.json("./data/hierarchical-data.json").then(data => {
  console.log(data);

  const root = d3.hierarchy(data);
  console.log("root", root);

  const descendants = root.descendants();
  const leaves = descendants.filter(d => !d.children);
  console.log("descendants", descendants);
  console.log("leaves", leaves);

//  Could also build the charts from here

});