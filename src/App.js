import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootswatch/dist/lux/bootstrap.css'
import './styles.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './components/layout'
import { AuthenticatedApp } from "./components/authentication";

class App extends Component {
    render() {
        return <AuthenticatedApp>
            <Router>
                <Layout/>
            </Router>
        </AuthenticatedApp>
    }
}

export default App;
