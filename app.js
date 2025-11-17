// app.js
const trails = [...trailData.TX, ...trailData.AR, ...trailData.OK, ...trailData.KA];

function TrailDirectory() {
  const [stateFilter, setStateFilter] = React.useState("All");
  const mapRef = React.useRef(null);
  const graphicsLayerRef = React.useRef(null);

  const filtered = trails.filter(t => {
    let stateMatch = false;
    if (stateFilter === "All") stateMatch = true;
    else if (stateFilter === "TX" && trailData.TX.includes(t)) stateMatch = true;
    else if (stateFilter === "AR" && trailData.AR.includes(t)) stateMatch = true;
    else if (stateFilter === "OK" && trailData.OK.includes(t)) stateMatch = true;
    else if (stateFilter === "KA" && trailData.KA.includes(t)) stateMatch = true;

    return stateMatch;
  });

  // Initialize map
  React.useEffect(() => {
    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer"
    ], (Map, MapView, Graphic, GraphicsLayer) => {
      const map = new Map({ basemap: "topo-vector" });
      const view = new MapView({
        container: "map",
        map,
        center: [-96, 36],
        zoom: 4
      });
      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);
      graphicsLayerRef.current = graphicsLayer;
      mapRef.current = view;

      filtered.forEach(t => {
        if (t.lat !== -100 && t.long !== -200) {
          const point = { type: "point", longitude: t.long, latitude: t.lat };
          const symbol = { type: "simple-marker", color: [226,119,40], outline: { color:[255,255,255], width:1 } };
          const popupTemplate = { title: t.projectName, content: t.areaName };
          const graphic = new Graphic({ geometry: point, symbol, popupTemplate });
          graphicsLayer.add(graphic);
        }
      });
    });
  }, []);

  // Update markers on filter change
  React.useEffect(() => {
    if (!graphicsLayerRef.current) return;
    graphicsLayerRef.current.removeAll();
    filtered.forEach(t => {
      if (t.lat !== -100 && t.long !== -200) {
        require(["esri/Graphic"], (Graphic) => {
          const point = { type:"point", longitude:t.long, latitude:t.lat };
          const symbol = { type:"simple-marker", color:[226,119,40], outline:{ color:[255,255,255], width:1 } };
          const popupTemplate = { title:t.projectName, content:t.areaName };
          const graphic = new Graphic({ geometry: point, symbol, popupTemplate });
          graphicsLayerRef.current.add(graphic);
        });
      }
    });
  }, [filtered]);

  return (
    React.createElement("div", null,
      React.createElement("div", {id:"filters"},
        React.createElement("label", null, "State: ",
          React.createElement("select", {value: stateFilter, onChange: e=>setStateFilter(e.target.value)},
            React.createElement("option", null, "All"),
            React.createElement("option", null, "TX"),
            React.createElement("option", null, "AR"),
            React.createElement("option", null, "OK"),
            React.createElement("option", null, "KA")
          )
        )
      ),
      React.createElement("div", {id:"map"}),
      filtered.map((t,i) => React.createElement("div", {key:i, className:"trail-card"},
        React.createElement("h2", null, t.projectName || "Unnamed Trail"),
        React.createElement("p", null, React.createElement("strong", null, "Area: "), t.areaName || "N/A"),
        React.createElement("p", null, React.createElement("strong", null, "Walkable: "), t.isWalking || "Unknown"),
        React.createElement("p", null, React.createElement("strong", null, "Biking: "), t.isBiking || "Unknown"),
        React.createElement("p", null, React.createElement("strong", null, "Equestrian: "), t.isEquestrian || "Unknown"),
        React.createElement("p", null, React.createElement("strong", null, "Wheelchair: "), t.isWheelchair || "Unknown"),
        React.createElement("p", null, React.createElement("strong", null, "Pets Allowed: "), t.isPet || "Unknown"),
        React.createElement("p", null, React.createElement("strong", null, "Length: "), t.length!==-1?t.length+" miles":"Unknown"),
        React.createElement("p", null, React.createElement("strong", null, "Elevation Gain: "), t.eGain!==-1?t.eGain+" ft":"Unknown"),
        t.infoLink && React.createElement("p", null, React.createElement("a", {href:t.infoLink, target:"_blank"}, "More Info")),
        t.comments && React.createElement("p", null, React.createElement("em", null, t.comments))
      ))
    )
  );
}

// Use ReactDOM.render for UMD React
ReactDOM.render(
  React.createElement(TrailDirectory, null),
  document.getElementById("root")
);
