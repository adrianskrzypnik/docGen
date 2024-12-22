const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

function createWindow() {
  const win = new BrowserWindow({
    width: 1980,
    height: 1080,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const isDev = process.env.npm_lifecycle_event === "electron:dev";

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  // Obsługa komunikatów z renderera
  ipcMain.on('minimize-window', () => win.minimize());
  ipcMain.on('toggle-maximize-window', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on('close-window', () => win.close());
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Obsługa wywołania skryptu Python
ipcMain.handle('create-document', async (event, data) => {
  return new Promise((resolve, reject) => {
    const pythonScript = spawn('python', ['create_doc.py', JSON.stringify({ data })]);
    console.log(data)

    let dataString = '';

    pythonScript.stdout.on('data', (data) => {
      dataString += data.toString();
      console.log(`Python stdout: ${data}`);
    });

    pythonScript.stderr.on('data', (data) => {
      console.error(`Error from Python script: ${data}`);
    });

    pythonScript.on('close', (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}`);
        return;
      }
      try {
        const result = JSON.parse(dataString);
        resolve(result);
      } catch (e) {
        reject('Failed to parse Python script output: '+ e);
      }
    });
  });
});