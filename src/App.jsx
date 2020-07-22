import React from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'
import MyHeader from './components/header'

class Main extends React.Component {
    constructor(props) {
        super(props)
    }

    openWindow = () => {
        const { BrowserWindow } = remote
        const printWindow = new BrowserWindow({
            show: true,
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        })

        printWindow.once('page-title-updated', () => {
            printWindow.webContents.send('webview-print-render', 'TSTSTSTSTS')
        })
        if (__DEBUG) {
            printWindow.loadURL('http://localhost:3004/print.html')
        } else {
            printWindow.loadFile('./print.html')
        }
    }

    render = () => (
        <div className="main">
            <MyHeader />
            <div className="main-btn">
                <button onClick={this.openWindow}>打开一个窗口</button>
            </div>
        </div>
    )
}

export default connect(
    null, null
)(Main)