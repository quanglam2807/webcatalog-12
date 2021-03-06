/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

import HelpIcon from '@material-ui/icons/Help';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  create,
  updateForm,
} from '../../state/dialog-choose-engine/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import EngineList from '../shared/engine-list';
import HelpTooltip from '../shared/help-tooltip';

import { requestSetPreference } from '../../senders';

const styles = (theme) => ({
  grid: {
    marginTop: theme.spacing(1),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  inline: {
    display: 'inline',
  },
  content: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

const DialogChooseEngine = ({
  classes,
  engine,
  forceEnginePrompt,
  hideEnginePrompt,
  name,
  onClose,
  onCreate,
  onUpdateForm,
  open,
  url,
  widevine,
}) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    onClose={onClose}
    open={open}
  >
    <EnhancedDialogTitle onClose={onClose} disableTypography>
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="subtitle1">
            Choose an Browser Engine for&nbsp;
            {name}
          </Typography>
        </Grid>
        <Grid item>
          <HelpTooltip
            title={(
              <Typography variant="body2" color="textPrimary">
                WebCatalog lets you pick your preferrred browser engine to power&nbsp;
                {name}
                . This cannot be changed later.
                You will have to uninstall and then reinstall&nbsp;
                {name}
                &nbsp;to change the engine of an app.
              </Typography>
            )}
          >
            <HelpIcon color="disabled" />
          </HelpTooltip>
        </Grid>
      </Grid>
    </EnhancedDialogTitle>
    <DialogContent className={classes.content}>
      <EngineList
        onEngineSelected={(selectedEngine) => onUpdateForm({ engine: selectedEngine })}
        engine={engine}
        isMultisite={!url}
        widevine={widevine}
      />
    </DialogContent>
    <DialogActions className={classes.dialogActions}>
      {!forceEnginePrompt && (
        <FormControlLabel
          control={(
            <Checkbox
              checked={hideEnginePrompt}
              onChange={(e) => requestSetPreference('hideEnginePrompt', e.target.checked)}
              color="primary"
            />
          )}
          label="Don't ask again"
        />
      )}
      <Button
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        color="primary"
        onClick={onCreate}
      >
        Install
      </Button>
    </DialogActions>
  </Dialog>
);

DialogChooseEngine.defaultProps = {
  forceEnginePrompt: false,
  url: null,
  widevine: false,
};

DialogChooseEngine.propTypes = {
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string.isRequired,
  forceEnginePrompt: PropTypes.bool,
  hideEnginePrompt: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  url: PropTypes.string,
  widevine: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      name,
      url,
      engine,
      opts,
      forceEnginePrompt,
    },
  } = state.dialogChooseEngine;

  const widevine = Boolean(opts && opts.widevine);

  const {
    hideEnginePrompt,
  } = state.preferences;

  return {
    engine,
    name,
    url,
    open,
    hideEnginePrompt,
    forceEnginePrompt,
    widevine,
  };
};

const actionCreators = {
  close,
  create,
  updateForm,
};

export default connectComponent(
  DialogChooseEngine,
  mapStateToProps,
  actionCreators,
  styles,
);
