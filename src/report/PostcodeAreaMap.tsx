import { ComposableMap, createCoordinates, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps";
import Gradient from "javascript-color-gradient";

import postcodes from "./postcode_areas.json"  //TODO: Convert to Topojson for smaller file?
import { Box } from "@mui/material";

interface PostcodeAreaMapProps {
  data: ReportCount

  height?: number
  width?: number
  scale?: number
}

export default function PostcodeAreaMap(props: PostcodeAreaMapProps) {
  const grad = new Gradient()
    .setColorGradient("#aaa", "#a60c2b")
    .setMidpoint(Math.max(1, ...Object.values(props.data)) + 2)
    .getColors();

  const defaultHeight = 600
  const defaultWidth = 400
  const defaultScale = 1600

  //TODO: Work out how to disable clicking of elements
  return <Box sx={{width: props.width ?? defaultWidth, height: props.height ?? defaultHeight}}><ComposableMap projection="geoMercator" projectionConfig={{
    center: createCoordinates(-2.5, 55.5),
    scale: props.scale ?? defaultScale
  }} width={props.width ?? defaultWidth} height={props.height ?? defaultHeight} >
  <Geographies geography={postcodes}>
    {({ geographies }) =>
      geographies.map(geo => {
        return (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill={grad[props.data[geo.properties.name] || 0]}
          />
        );
      })
    }
  </Geographies>
</ComposableMap>
</Box>
}