/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  app,
  Menu,
  shell,
  ipcMain,
} = require('electron');

const sendToAllWindows = require('./send-to-all-windows');

const { getPreference } = require('./preferences');
const formatBytes = require('./format-bytes');

const mainWindow = require('../windows/main');

let menu;

const createMenu = () => {
  const registered = getPreference('registered');
  const updaterEnabled = process.env.SNAP == null && !process.mas && !process.windowsStore;

  const updaterMenuItem = {
    label: 'Check for Updates...',
    click: () => ipcMain.emit('request-check-for-updates'),
    visible: updaterEnabled,
  };
  if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
    updaterMenuItem.label = 'Restart to Apply Updates...';
  } else if (global.updaterObj && global.updaterObj.status === 'update-available') {
    updaterMenuItem.label = 'Downloading Updates...';
    updaterMenuItem.enabled = false;
  } else if (global.updaterObj && global.updaterObj.status === 'download-progress') {
    const { transferred, total, bytesPerSecond } = global.updaterObj.info;
    updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
    updaterMenuItem.enabled = false;
  } else if (global.updaterObj && global.updaterObj.status === 'checking-for-update') {
    updaterMenuItem.label = 'Checking for Updates...';
    updaterMenuItem.enabled = false;
  }

  const macMenuItems = [
    { type: 'separator' },
    { role: 'services', submenu: [] },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
  ];

  const template = [
    {
      label: app.name,
      submenu: [
        {
          label: 'About WebCatalog',
          click: () => sendToAllWindows('open-dialog-about'),
        },
        { type: 'separator' },
        {
          label: registered ? 'WebCatalog Plus' : 'WebCatalog Basic',
          visible: true,
          enabled: false,
          click: null,
        },
        {
          label: 'Upgrade...',
          visible: !registered,
          click: registered ? null : () => sendToAllWindows('open-license-registration-dialog'),
        },
        {
          type: 'separator',
          visible: updaterEnabled,
        },
        updaterMenuItem,
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => sendToAllWindows('go-to-preferences'),
        },
        ...macMenuItems,
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        {
          role: 'pasteandmatchstyle',
          // by default, it's 'Alt+Shift+CmdOrCtrl+F'
          accelerator: 'Shift+CmdOrCtrl+F',
        },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => sendToAllWindows('focus-search'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'close' },
        { role: 'minimize' },
        // role: 'zoom' is only supported on macOS
        process.platform === 'darwin' ? {
          role: 'zoom',
        } : {
          label: 'Zoom',
          click: () => {
            const win = mainWindow.get();

            if (win != null) {
              win.maximize();
            }
          },
        },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'WebCatalog Help',
          click: () => shell.openExternal('https://help.webcatalog.app?utm_source=webcatalog_app'),
        },
        {
          label: 'Report a Bug via GitHub...',
          click: () => shell.openExternal('https://github.com/webcatalog/webcatalog-app/issues'),
        },
        {
          label: 'Request a New Feature via GitHub...',
          click: () => shell.openExternal('https://github.com/webcatalog/webcatalog-app/issues/new?template=feature.md&title=feature%3A+'),
        },
        {
          label: 'Submit New App to Catalog...',
          click: () => shell.openExternal('https://forms.gle/redZCVMwkuhvuDtb9'),
        },
        {
          label: 'Learn More...',
          click: () => shell.openExternal('https://webcatalog.app?utm_source=webcatalog_app'),
        },
        { type: 'separator' },
        {
          role: 'toggledevtools',
          accelerator: '',
        },
      ],
    },
  ];

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// https://dev.to/saisandeepvaddi/creating-a-custom-menu-bar-in-electron-1pi3
// Register an event listener.
// When ipcRenderer sends mouse click co-ordinates, show menu at that position.
const showMenu = (window, x, y) => {
  if (!menu) return;
  menu.popup({
    window,
    x,
    y,
  });
};

module.exports = {
  createMenu,
  showMenu,
};