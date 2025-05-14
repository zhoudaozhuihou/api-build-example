import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import { hideToast, selectToast } from '../redux/slices/uiSlice';
import useI18n from '../hooks/useI18n';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    padding: theme.spacing(0.5),
  },
}));

function Toast() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);
  const { translate } = useI18n();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideToast());
  };

  // 如果消息是一个翻译键，则翻译它
  const getTranslatedMessage = (message) => {
    if (message && message.startsWith('toast.')) {
      return translate(message);
    }
    return message;
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={toast.open}
      autoHideDuration={toast.duration}
      onClose={handleClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={toast.type}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {getTranslatedMessage(toast.message)}
      </Alert>
    </Snackbar>
  );
}

export default Toast; 