import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';

import Slide from 'material-ui/transitions/Slide';
import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import Dialog, {
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog';

import FakeTitleBar from '../Shared/FakeTitleBar';
import { close } from '../../state/ui/dialogs/app-details/actions';

const styleSheet = createStyleSheet('AppDetails', {
  linearProgress: {
    opacity: 0,
  },

  toolbar: {
    padding: '0 12px',
  },
  dialogContent: {
    maxWidth: 288,
  },
  dialogContentText: {
    maxHeight: 300,
    height: 300,
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
  title: {
    padding: '0 16px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

const AppDetails = (props) => {
  const {
    description,
    classes,
    onClose,
    open,
    name,
  } = props;

  return (
    <Dialog
      fullScreen
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="up" />}
    >
      <FakeTitleBar />
      <AppBar position="static" key="appBar" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="contrast"
            aria-label="Menu"
            onClick={onClose}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            className={classes.title}
            color="inherit"
            type="title"
          >
            {name}
          </Typography>
          <IconButton
            color="contrast"
            aria-label="Search"
            onClick={onClose}
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText className={classes.dialogContentText}>
          {description}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

AppDetails.defaultProps = {
  open: false,
};

AppDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form,
  } = state.ui.dialogs.appDetails;

  const { description } = state.apps.details.apiData;


  return {
    open,
    description,
    name: form.name,
  };
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
});

export default
connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(AppDetails));
