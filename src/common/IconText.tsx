import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface IconTextProps {
  /** Gap between the icon and the text. Defaults to `2` (MUI spacing unit). */
  gap?: string | number
  /** Bottom margin. Defaults to `"1rem"`. */
  marginBottom?: string | number
  /** The icon element to show to the left of the text. */
  icon: ReactNode
  /** The text or content to show to the right of the icon. */
  children: ReactNode
}

/**
 * Renders an icon alongside a line of text in a horizontal row.
 *
 * A lightweight layout primitive used for labelled data items such as dates,
 * locations, and deadlines throughout the portal.
 */
export default function IconText(props: IconTextProps){
  return <Stack direction="row" sx={{alignItems: 'center', gap: props.gap || 2, marginBottom: props.marginBottom || '1rem'}}>
    {props.icon}
    {props.children}
  </Stack>
}