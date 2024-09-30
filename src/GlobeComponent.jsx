import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";

const GlobeComponent = () => {
  const globeEl = useRef();
  const [popData, setPopData] = useState([]);
  useEffect(() => {
    // load data
    fetch("./datasets/world_population.csv")
      .then((res) => res.text())
      .then((csv) =>
        d3.csvParse(csv, ({ lat, lng, pop }) => {
          const parsedData = {
            lat: +lat,
            lng: +lng,
            pop: +pop,
          };

          // Log invalid data
          if (
            parsedData.lat < -90 ||
            parsedData.lat > 90 ||
            parsedData.lng < -180 ||
            parsedData.lng > 180
          ) {
            console.error("Invalid data:", parsedData);
          }

          return parsedData;
        })
      )
      .then(setPopData);
  }, []);
  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.1;
  }, []);
  const weightColor = d3
    .scaleSequentialSqrt(d3.interpolateYlOrRd)
    .domain([0, 1e7]);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        hexBinPointsData={popData}
        hexBinPointWeight="pop"
        hexAltitude={(d) => d.sumWeight * 6e-8}
        hexBinResolution={4}
        hexTopColor={(d) => weightColor(d.sumWeight)}
        hexSideColor={(d) => weightColor(d.sumWeight)}
        hexBinMerge={true}
        enablePointerInteraction={false}
      />
    </div>
  );
};

export default GlobeComponent;
