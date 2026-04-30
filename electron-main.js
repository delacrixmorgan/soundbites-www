const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hidden',
    backgroundColor: '#fdfaf5',
  });

  // In production, load the index.html from the build folder
  // In development, load from the dev server URL
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

function getCompactCols(count) {
  if (count <= 3) return Math.max(count, 1);
  if (count % 3 === 0) return 3;
  if (count % 2 === 0) return 2;
  return 3;
}

ipcMain.on('enter-compact', (_event, count) => {
  const TOP_STRIP = 28;
  const BOTTOM_PAD = 12;
  const SIDE_PAD = 12; // px-3 each side
  const GAP = 8;       // gap-2
  const WIDTH = 320;

  const cols = getCompactCols(count || 1);
  const innerWidth = WIDTH - SIDE_PAD * 2;
  const cardSize = (innerWidth - (cols - 1) * GAP) / cols;
  const rows = Math.ceil((count || 1) / cols);
  const height = TOP_STRIP + BOTTOM_PAD + rows * cardSize + (rows - 1) * GAP;

  win.setSize(WIDTH, Math.round(height), true);
  win.setAlwaysOnTop(true);
});

ipcMain.on('resize-compact', (_event, height) => {
  const [w] = win.getSize();
  win.setSize(w, height, true);
});

ipcMain.on('show-emoji-panel', () => {
  app.showEmojiPanel();
});

ipcMain.on('exit-compact', () => {
  win.setSize(1000, 800, true);
  win.setAlwaysOnTop(false);
  win.center();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});