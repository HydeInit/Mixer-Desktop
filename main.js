const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    return;
 }
const electron = require('electron')
const MixerDesktop = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1280, height: 720, titleBarStyle: 'hidden', icon:'./icons/win/icon-app.ico', backgroundColor: '#141828', webPreferences: {
      nodeIntegration: false,
      preload: '',
      nativeWindowOpen: true,
    }})

  // Child window open event handler
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    event.preventDefault()
    Object.assign(options, {
      parent: mainWindow
    })
    event.newGuest = new BrowserWindow(options)
    event.newGuest.setMenu(null)
  })
    
  mainWindow.loadURL('https://mixer.com/users/login')
  mainWindow.setMenu(null)
    
  //mainWindow.webContents.openDevTools()
    
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

MixerDesktop.on('ready', createWindow)

MixerDesktop.on('window-all-closed', function () {
  if (process.platform !== 'win32') {
    MixerDesktop.quit()
  }
})

MixerDesktop.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

MixerDesktop.on('closed', function () {
    mainWindow = null
    MixerDesktop.quit()
    return
})