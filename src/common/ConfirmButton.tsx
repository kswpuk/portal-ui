import { Button, SxProps } from "@mui/material";
import { ReactNode, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

/**
 * A button that opens a confirmation dialog before invoking an action.
 *
 * Renders a trigger button. When clicked, a MUI Dialog appears asking the user
 * to confirm or cancel. The dialog also opens automatically while `loading` is
 * true, keeping it visible until the async operation completes.
 *
 * @example
 * <ConfirmButton
 *   title="Delete member?"
 *   body="This action cannot be undone."
 *   onConfirm={handleDelete}
 *   onCancel={() => {}}
 *   loading={isDeleting}
 *   loadingText="Deleting..."
 * >
 *   Delete
 * </ConfirmButton>
 */
interface ConfirmButtonProps {
  /** Called when the user clicks Cancel or dismisses the dialog. */
  onCancel: () => void
  /** Called when the user clicks the confirm button. */
  onConfirm: () => void

  /** Dialog heading. Defaults to "Confirm". */
  title?: string
  /** Dialog body text. Defaults to "Are you sure?". */
  body?: string
  /**
   * When true, the dialog stays open and both dialog buttons are disabled.
   * The confirm button also shows `loadingText` instead of `confirmText`.
   */
  loading?: boolean
  /** Disables the trigger button without opening the dialog. */
  disabled?: boolean

  /** Label for the trigger button. */
  children: ReactNode
  /** Icon shown to the left of the trigger button label. */
  startIcon?: ReactNode

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

  /** CSS class applied to the trigger button. */
  className?: string
  /** MUI `sx` prop applied to the trigger button. */
  sx?: SxProps
}

export default function ConfirmButton(props: ConfirmButtonProps) {
  const [show, setShow] = useState(false);

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
      <Button startIcon={props.startIcon} disabled={props.disabled} sx={props.sx} className={props.className} onClick={() => setShow(true)}>
        {props.children}
      </Button>

      <ConfirmDialog
        open={show || props.loading === true}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title={props.title}
        body={props.body}
        loading={props.loading}
        cancelText={props.cancelText}
        cancelVariant={props.cancelVariant}
        confirmText={props.confirmText}
        confirmVariant={props.confirmVariant}
        loadingText={props.loadingText}
      />
    </>
  );
}
