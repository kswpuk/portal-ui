import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import gradient from 'gradient-color'
import postcodes from "./postcode_areas.json"  //TODO: Convert to Topojson for smaller file?
import { Box } from "@mui/material";

export default function PostcodeAreaMap(props) {
  const grad = gradient(["#aaa", "#a60c2b"], Math.max(1, ...Object.values(props.data)) + 2)
  const defaultHeight = 600
  const defaultWidth = 400
  const defaultScale = 1600

  //TODO: Work out how to disable clicking of elements
  return <Box width={props.width | defaultWidth} height={props.height | defaultHeight}><ComposableMap projection="geoMercator" projectionConfig={{
    center: [-2.5, 55.5],
    scale: props.scale | defaultScale
  }} width={props.width | defaultWidth} height={props.height | defaultHeight} >
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