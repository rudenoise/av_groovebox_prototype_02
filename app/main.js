'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')

let isShown = true

function createWindow() {
  // Create the browser app.window.
  app.win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      zoomFactor: 1.0,
      nodeIntegration: true,
      backgroundThrottling: false,
    },
    //icon: './app/sheep.png',
  })

  console.log('app started')

  // and load the index.html of the app.
  app.win.loadFile('./app/index.html')
  console.log('index loaded')

  app.win.on('closed', () => {
    app.quit()
  })

  app.win.on('hide', function () {
    isShown = false
  })

  app.win.on('show', function () {
    isShown = true
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

app.on('app.window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a app.window in the app when the
  // dock icon is clicked and there are no other app.windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
