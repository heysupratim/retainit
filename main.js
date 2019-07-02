const electron = require('electron')
// Module to control application life.
const { app, ipcMain, globalShortcut } = require('electron')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, noteWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 400, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'viewnotes.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow)

app.on('ready', () => {
  createWindow();
  globalShortcut.register('CommandOrControl+Shift+N', () => {
    console.log('CommandOrControl+Shift+N is pressed')
    createNoteWindow();
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


ipcMain.on('createnote', (event, arg) => {
  createNoteWindow();
})

ipcMain.on('redraw_notes', (event, arg) => {
  mainWindow.webContents.send('redraw_notes', 'Tell Renderer to Redraw Notes');
})



function createNoteWindow() {
  // Create the browser window.
  if (!noteWindow) {
    noteWindow = new BrowserWindow({ width: 300, height: 400 })

    noteWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'createnote.html'),
      protocol: 'file:',
      slashes: true
    }))

    noteWindow.on('closed', function () {
      noteWindow = null
    })
  }
  else {
    noteWindow.focus()
  }

}


ipcMain.on('editnote', (event, arg) => {
  console.log(arg);
  createEditNoteWindow(arg);
  noteWindow.webContents.once('dom-ready', () => {
    noteWindow.webContents.send('editnote', arg);
  });
})

function createEditNoteWindow(arg) {
  // Create the browser window.
  if (!noteWindow) {
    noteWindow = new BrowserWindow({ width: 300, height: 400 })

    noteWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'createnote.html'),
      protocol: 'file:',
      slashes: true
    }))

    noteWindow.on('closed', function () {
      noteWindow = null
    })

    noteWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'createnote.html'),
      protocol: 'file:',
      slashes: true
    }))

  }
  else {
    noteWindow.focus()
    noteWindow.webContents.send('editnote', arg);
  }

}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
