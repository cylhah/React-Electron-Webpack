import React from 'react'
import { connect } from 'react-redux'

class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => (
        <div className="header">
            This is Header
        </div>
    )
}

export default connect(
    null, null
)(Header)