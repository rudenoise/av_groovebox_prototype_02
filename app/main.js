'use strict'

const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')

function createWindow () {
  // Create the browser app.window.
  app.win = new BrowserWindow({
    width: 800,
    height: 800,
    backgroundThrottling: false,
    webPreferences: {
      zoomFactor: 1.0,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  console.log('app started')

  // and load the index.html of the app.
  app.win.loadFile(path.join(__dirname, 'index.html'))
  console.log('index loaded')

  app.win.on('closed', () => {
    app.quit()
  })

  // Open the DevTools.
  app.win.webContents.openDevTools()
  console.log('devtools open')
}

ipcMain.on('pingMsg', function (event, arg) {
  console.log(arg + ' recieved in main')
  event.reply('pongMsg', 'pong')
  console.log('pongMsg sent')
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a app.window in the app when the
  // dock icon is clicked and there are no other app.windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
