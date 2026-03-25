import { Link, SxProps } from "@mui/material";
import { ReactNode, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

/**
 * A link that opens a confirmation dialog before invoking an action.
 *
 * Renders a trigger link. When clicked, a MUI Dialog appears asking the user
 * to confirm or cancel. The dialog also opens automatically while `loading` is
 * true, keeping it visible until the async operation completes.
 *
 * @example
 * <ConfirmLink
 *   title="Remove member?"
 *   body="This action cannot be undone."
 *   onConfirm={handleRemove}
 *   loading={isRemoving}
 * >
 *   Remove
 * </ConfirmLink>
 */
interface ConfirmLinkProps {
  /** Called when the user clicks Cancel or dismisses the dialog. Optional — dialog simply closes if omitted. */
  onCancel?: () => void
  /** Called when the user clicks the confirm button. */
  onConfirm: () => void

  /** Dialog heading. Defaults to "Confirm". */
  title?: string
  /** Dialog body text. Defaults to "Are you sure?". */
  body?: string
  /**
   * When true, the dialog stays open and both dialog buttons are disabled.
   */
  loading?: boolean

  /** Label for the trigger link. */
  children: ReactNode

  /** Cancel button label. Defaults to "Cancel". */
  cancelText?: string
  /** MUI variant for the cancel button. Defaults to "outlined". */
  cancelVariant?: "text" | "outlined" | "contained"
  /** Confirm button label. Defaults to "Confirm". */
  confirmText?: string
  /** MUI variant for the confirm button. Defaults to "contained". */
  confirmVariant?: "text" | "outlined" | "contained"

  /** CSS class applied to the trigger link. */
  className?: string
  /** MUI `sx` prop applied to the trigger link. */
  sx?: SxProps
}

export default function ConfirmLink(props: ConfirmLinkProps) {
  const [show, setShow] = useState(false);

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
      <Link sx={props.sx} className={props.className} onClick={() => setShow(true)}>
        {props.children}
      </Link>

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
      />
    </>
  );
}
