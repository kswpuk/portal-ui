import { Button, Menu } from "@mui/material";
import React, { ReactElement, ReactNode, useState } from "react";

interface ButtonMenuProps {
  buttonText: string
  children: React.ReactElement<{ onClick?: () => void }> | React.ReactElement<{ onClick?: () => void }>[]
  disabled?: boolean
}

export default function ButtonMenu(props: ButtonMenuProps){
  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      {React.Children.map(props.children, (el, idx) => {
        if (!React.isValidElement(el)) return el;

        return React.cloneElement(el, {
          key: idx,
          onClick: () => {
            if(el.props.onClick) {
              el.props.onClick();
            }
            handleClose();
          }
        })
      })}
    </Menu>
  </>
}