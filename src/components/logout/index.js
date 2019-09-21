import React, { Component } from "react"

import { Redirect } from "react-router-dom"

import { Authentication } from '../authentication'

export default class Logout extends Component {
    render() {
        return <Authentication>
            { auth => {
                if (auth.authenticated)
                    auth.logout()
                else
                    return <Redirect to ="/" />
            }}
        </Authentication>
    }
}