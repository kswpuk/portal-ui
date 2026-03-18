import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, SxProps } from "@mui/material";
import { ReactNode, useState } from "react";

interface ConfirmButtonProps {
  onCancel: () => void
  onConfirm: () => void

  title?: string
  body?: string
  loading?: boolean
  disabled?: boolean

  children: ReactNode
  startIcon?: ReactNode

  cancelText?: string
  cancelVariant?: "text" | "outlined" | "contained"
  confirmText?: string
  confirmVariant?: "text" | "outlined" | "contained"
  loadingText?: string

  className?: string
  sx?: SxProps
}

export default function ConfirmButton(props: ConfirmButtonProps) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleCancel = () => {
    if(props.onCancel){
      props.onCancel()
    }

    setShow(false);
  }

  const handleConfirm = () => {
    if(props.onConfirm){
      props.onConfirm()
    }

    setShow(false);
  }

  return (
    <>
      <Button startIcon={props.startIcon} disabled={props.disabled} sx={props.sx} className={props.className} onClick={handleShow}>
        {props.children}
      </Button>

      <Dialog
        open={show || props.loading === true}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title || "Confirm"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.body || "Are you sure?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  variant={props.cancelVariant || "outlined"} onClick={handleCancel} disabled={props.loading}>
            {props.cancelText || "Cancel"}
          </Button>
          <Button variant={props.confirmVariant || "contained"} onClick={handleConfirm} autoFocus disabled={props.loading}>
            {props.loading ? props.loadingText || "Loading..." : props.confirmText || "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}