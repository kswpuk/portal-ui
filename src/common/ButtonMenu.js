import { Button, Menu } from "@mui/material";
import React, { useState } from "react";

export default function ButtonMenu(props){
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return <>
    <Button
      onClick={handleClick}
      disabled={props.disabled}
    >
      {props.buttonText}
    </Button>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      {props.children.map(el => {
        return React.cloneElement(el, {
          onClick: el.props.onClick ? (() => {el.props.onClick(); handleClose()}) : null
        })
      })}
    </Menu>
  </>
}