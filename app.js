// app.js
const trails = [...trailData.TX, ...trailData.AR, ...trailData.OK, ...trailData.KA];

// ───────────────────────────────── TrailDetail (detail "page") ─────────────────────────────────
// ───────────────────────────────── TrailDetail (detail "page") ─────────────────────────────────
function TrailDetail(props) {
  const trail = props.trail;
  const onBack = props.onBack;
  const detailMapRef = React.useRef(null);

  // Small map for the trailhead
  React.useEffect(() => {
    if (!trail) return;
    if (trail.lat === -100 || trail.long === -200) return;

    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer"
    ], function (Map, MapView, Graphic, GraphicsLayer) {
      if (!detailMapRef.current) return;

      const map = new Map({ basemap: "topo-vector" });
      const view = new MapView({
        container: detailMapRef.current,  // use the div ref
        map: map,
        center: [trail.long, trail.lat],
        zoom: 13
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const point = {
        type: "point",
        longitude: trail.long,
        latitude: trail.lat
      };

      const symbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: { color: [255, 255, 255], width: 1 }
      };

      const popupTemplate = {
        title: trail.projectName,
        content: trail.areaName
      };

      const graphic = new Graphic({
        geometry: point,
        symbol: symbol,
        popupTemplate: popupTemplate
      });

      graphicsLayer.add(graphic);
    });
  }, [trail]);

  return React.createElement(
    "div",
    {
      className: "trail-detail",
      style: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "16px 20px",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
      }
    },

    // Back button
    React.createElement(
      "button",
      {
        onClick: onBack,
        style: {
          marginBottom: "16px",
          padding: "6px 12px",
          backgroundColor: "#f3f4f6",
          border: "1px solid #d1d5db",
          borderRadius: "999px",
          cursor: "pointer",
          fontSize: "0.9rem"
        }
      },
      "← Back to all trails"
    ),

    // Title + subtitle
    React.createElement(
      "h1",
      {
        style: {
          margin: "0 0 4px 0",
          fontSize: "1.5rem"
        }
      },
      trail.projectName || "Unnamed Trail"
    ),
    React.createElement(
      "h2",
      {
        style: {
          margin: "0 0 10px 0",
          fontSize: "1rem",
          color: "#4b5563"
        }
      },
      trail.areaName || ""
    ),

    // Summary chips (length, elevation, intensity)
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "14px"
        }
      },
      React.createElement(
        "span",
        {
          style: {
            padding: "4px 8px",
            borderRadius: "999px",
            backgroundColor: "#e5f2ff",
            fontSize: "0.85rem"
          }
        },
        "Length: ",
        trail.length !== -1 ? trail.length + " mi" : "Unknown"
      ),
      React.createElement(
        "span",
        {
          style: {
            padding: "4px 8px",
            borderRadius: "999px",
            backgroundColor: "#ffe8e5",
            fontSize: "0.85rem"
          }
        },
        "Elevation: ",
        trail.eGain !== -1 ? trail.eGain + " ft" : "Unknown"
      ),
      React.createElement(
        "span",
        {
          style: {
            padding: "4px 8px",
            borderRadius: "999px",
            backgroundColor: "#e7f7e7",
            fontSize: "0.85rem"
          }
        },
        "Intensity: ",
        trail.intensity || "Unknown"
      )
    ),

    // Main content row: left = info, right = map
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }
      },

      // LEFT: all the text/info
      React.createElement(
        "div",
        { style: { flex: "1 1 260px", minWidth: "240px" } },

        React.createElement(
          "h3",
          {
            style: {
              marginTop: "0",
              marginBottom: "6px",
              fontSize: "1rem"
            }
          },
          "Activities & Access"
        ),
        React.createElement(
          "p",
          null,
          React.createElement("strong", null, "Tap: "),
          trail.tap !== undefined ? trail.tap : "N/A"
        ),
        React.createElement(
          "p",
          null,
          React.createElement("strong", null, "Walkable: "),
          trail.isWalking || "Unknown"
        ),
        React.createElement(
          "p",
          null,
          React.createElement("strong", null, "Biking: "),
          trail.isBiking || "Unknown"
        ),
        React.createElement(
          "p",
          null,
          React.createElement("strong", null, "Equestrian: "),
          trail.isEquestrian || "Unknown"
        ),
        React.createElement(
          "p",
          null,
          React.createElement("strong", null, "Wheelchair: "),
          trail.isWheelchair || "Unknown"
        ),
        React.createElement(
          "p",
          null,
          React.createElement("strong", null, "Pets Allowed: "),
          trail.isPet || "Unknown"
        ),

        React.createElement(
          "h3",
          {
            style: {
              marginTop: "12px",
              marginBottom: "4px",
              fontSize: "1rem"
            }
          },
          "More Info"
        ),
        trail.infoLink &&
          React.createElement(
            "p",
            null,
            React.createElement(
              "a",
              {
                href: trail.infoLink,
                target: "_blank",
                rel: "noreferrer",
                style: { color: "#2563eb" }
              },
              "Trail Website"
            )
          ),
        trail.comments &&
          React.createElement(
            "p",
            {
              style: {
                marginTop: "4px",
                fontStyle: "italic",
                color: "#4b5563"
              }
            },
            trail.comments
          )
      ),

      // RIGHT: the small map
      React.createElement("div", {
        id: "detail-map",
        ref: detailMapRef,
        style: {
          width: "320px",
          height: "240px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          flexShrink: 0,
          marginLeft: "4px"
        }
      })
    )
  );
}


// ───────────────────────────────── TrailDirectory (existing list + big map) ─────────────────────────────────
function TrailDirectory() {
  const [stateFilter, setStateFilter] = React.useState("All");
  const [selectedTrail, setSelectedTrail] = React.useState(null);
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

  // Initialize map (same idea as before)
  React.useEffect(() => {
    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer"
    ], function (Map, MapView, Graphic, GraphicsLayer) {
      const map = new Map({ basemap: "topo-vector" });
      const view = new MapView({
        container: "map",
        map: map,
        center: [-96, 36],
        zoom: 4
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      graphicsLayerRef.current = graphicsLayer;
      mapRef.current = view;

      // Initial markers (for the initial filter)
      filtered.forEach(function (t) {
        if (t.lat !== -100 && t.long !== -200) {
          const point = { type: "point", longitude: t.long, latitude: t.lat };
          const symbol = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: { color: [255, 255, 255], width: 1 }
          };
          const popupTemplate = {
            title: t.projectName,
            content: t.areaName
          };
          const graphic = new Graphic({
            geometry: point,
            symbol: symbol,
            popupTemplate: popupTemplate
          });
          graphicsLayer.add(graphic);
        }
      });
    });
  }, []);

  // Update markers when the filter changes
  React.useEffect(() => {
    if (!graphicsLayerRef.current) return;

    graphicsLayerRef.current.removeAll();

    filtered.forEach(function (t) {
      if (t.lat !== -100 && t.long !== -200) {
        require(["esri/Graphic"], function (Graphic) {
          const point = { type: "point", longitude: t.long, latitude: t.lat };
          const symbol = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: { color: [255, 255, 255], width: 1 }
          };
          const popupTemplate = {
            title: t.projectName,
            content: t.areaName
          };
          const graphic = new Graphic({
            geometry: point,
            symbol: symbol,
            popupTemplate: popupTemplate
          });
          graphicsLayerRef.current.add(graphic);
        });
      }
    });
  }, [filtered]);

  // If a trail is selected, show the detail "page"
  if (selectedTrail) {
    return React.createElement(TrailDetail, {
      trail: selectedTrail,
      onBack: function () { setSelectedTrail(null); }
    });
  }

  // Otherwise show the original directory view
  return (
    React.createElement("div", null,
      React.createElement("div", { id: "filters" },
        React.createElement("label", null, "State: ",
          React.createElement("select", {
            value: stateFilter,
            onChange: function (e) { setStateFilter(e.target.value); }
          },
            React.createElement("option", null, "All"),
            React.createElement("option", null, "TX"),
            React.createElement("option", null, "AR"),
            React.createElement("option", null, "OK"),
            React.createElement("option", null, "KA")
          )
        )
      ),
      React.createElement("div", { id: "map" }),
      filtered.map(function (t, i) {
        return React.createElement("div", {
          key: i,
          className: "trail-card",
          onClick: function () { setSelectedTrail(t); }  // ← click tile to open detail page
        },
          React.createElement("h2", null, t.projectName || "Unnamed Trail"),
          React.createElement("p", null,
            React.createElement("strong", null, "Area: "),
            t.areaName || "N/A"
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Walkable: "),
            t.isWalking || "Unknown"
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Biking: "),
            t.isBiking || "Unknown"
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Equestrian: "),
            t.isEquestrian || "Unknown"
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Wheelchair: "),
            t.isWheelchair || "Unknown"
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Pets Allowed: "),
            t.isPet || "Unknown"
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Length: "),
            t.length !== -1 ? t.length + " miles" : "Unknown"
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Elevation Gain: "),
            t.eGain !== -1 ? t.eGain + " ft" : "Unknown"
          ),
          t.infoLink && React.createElement("p", null,
            React.createElement("a", { href: t.infoLink, target: "_blank" }, "More Info")
          ),
          t.comments && React.createElement("p", null,
            React.createElement("em", null, t.comments)
          )
        );
      })
    )
  );
}

// Use ReactDOM.render for UMD React
ReactDOM.render(
  React.createElement(TrailDirectory, null),
  document.getElementById("root")
);
