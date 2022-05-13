import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

export default function ConfirmButton(props) {
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
        open={show || props.loading}
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