'use strict'

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendPing: (arg) => ipcRenderer.send('pingMsg', arg),
  onPong: (callback) =>
    ipcRenderer.on('pongMsg', (_event, arg) => callback(arg))
})
