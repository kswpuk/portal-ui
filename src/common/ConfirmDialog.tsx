import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

/**
 * The shared confirmation dialog used by ConfirmButton and ConfirmLink.
 * Manages no state of its own — the parent controls `open`.
 *
 * Prefer using ConfirmButton or ConfirmLink over this component directly.
 * Use ConfirmDialog only when neither a Button nor a Link trigger is appropriate.
 *
 * @example
 * <ConfirmDialog
 *   open={showDialog}
 *   onConfirm={handleConfirm}
 *   onCancel={() => setShowDialog(false)}
 *   title="Delete item?"
 *   body="This action cannot be undone."
 * />
 */
export interface ConfirmDialogProps {
  /** Controls whether the dialog is visible. */
  open: boolean
  /** Called when the user clicks Cancel or dismisses the dialog. */
  onCancel: () => void
  /** Called when the user clicks the confirm button. */
  onConfirm: () => void

  /** Dialog heading. Defaults to "Confirm". */
  title?: string
  /** Dialog body text. Defaults to "Are you sure?". */
  body?: string
  /**
   * When true, both dialog buttons are disabled.
   * The confirm button also shows `loadingText` instead of `confirmText`.
   */
  loading?: boolean

  /** Cancel button label. Defaults to "Cancel". */
  cancelText?: string
  /** MUI variant for the cancel button. Defaults to "outlined". */
  cancelVariant?: "text" | "outlined" | "contained"
  /** Confirm button label. Defaults to "Confirm". */
  confirmText?: string
  /** MUI variant for the confirm button. Defaults to "contained". */
  confirmVariant?: "text" | "outlined" | "contained"
  /** Confirm button label shown while `loading` is true. Defaults to "Loading...". */
  loadingText?: string
}

export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  body,
  loading,
  cancelText,
  cancelVariant,
  confirmText,
  confirmVariant,
  loadingText,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title || "Confirm"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body || "Are you sure?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant={cancelVariant || "outlined"} onClick={onCancel} disabled={loading}>
          {cancelText || "Cancel"}
        </Button>
        <Button variant={confirmVariant || "contained"} onClick={onConfirm} autoFocus disabled={loading}>
          {loading ? loadingText || "Loading..." : confirmText || "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
