import React from 'react';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Stack,
} from '@mui/material';

export interface ConfirmDialogProps extends Pick<DialogProps, 'maxWidth' | 'fullWidth' | 'keepMounted'> {
  open: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  isSubmitting?: boolean;
  disableBackdropClose?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmButtonProps,
  cancelButtonProps,
  onConfirm,
  onCancel,
  isSubmitting = false,
  disableBackdropClose = false,
  maxWidth = 'xs',
  fullWidth = true,
  keepMounted = false,
}) => {
  const titleId = React.useId();
  const contentId = React.useId();

  const handleClose: DialogProps['onClose'] = (_, reason) => {
    if (disableBackdropClose && reason === 'backdropClick') {
      return;
    }
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={titleId}
      aria-describedby={contentId}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      keepMounted={keepMounted}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={contentId} component="div">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%">
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
            {...cancelButtonProps}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={isSubmitting}
            {...confirmButtonProps}
          >
            {confirmLabel}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

