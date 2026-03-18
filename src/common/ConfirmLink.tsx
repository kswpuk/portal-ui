import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, SxProps } from "@mui/material";
import { ReactNode, useState } from "react";

interface ConfirmLinkProps {
  onCancel?: () => void
  onConfirm: () => void

  title?: string
  body?: string
  loading?: boolean

  children: ReactNode

  cancelText?: string
  cancelVariant?: "text" | "outlined" | "contained"
  confirmText?: string
  confirmVariant?: "text" | "outlined" | "contained"

  className?: string
  sx?: SxProps
}

export default function ConfirmLink(props: ConfirmLinkProps) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleCancel = () => {
    if(props.onCancel){
      props.onCancel()
    }

    setShow(false);
  }

  const handleConfirm = () => {
    props.onConfirm();
    setShow(false);
  }

  return (
    <>
      <Link sx={props.sx} className={props.className} onClick={handleShow}>
        {props.children}
      </Link>

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
            {props.loading ? "Loading..." : props.confirmText || "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}