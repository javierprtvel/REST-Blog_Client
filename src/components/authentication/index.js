import React, { Component } from "react"
import PropTypes from 'prop-types'
import APIClient from "../api"

const AuthContext = React.createContext()

export class AuthenticatedApp extends Component {
    constructor(){
        super()

        if(sessionStorage.getItem('authentication')) {
            this.state = JSON.parse(sessionStorage.getItem('authentication'))
        }
        else {
            this.state = {
                authenticated: false,
                user: {},
                token: null,
                error: {}
            }
        }
    }

    login = async (user, pass) => {
        const loginResponse = await APIClient.login(user, pass)
        if(loginResponse.ok) {
            const jwt = loginResponse.headers.get("Authorization").toString()

            const userResponse = await APIClient.getUserByNickname(user)
            if(userResponse.ok) {
                const userObj = await userResponse.json()
                this.setState(prev => ({...prev, authenticated: true, user: userObj, token: jwt}))
                sessionStorage.removeItem('authentication')
                sessionStorage.setItem('authentication', JSON.stringify(this.state))
            }
            else {
                this.setState(prev => ({...prev, error: { code: "USER NOT FOUND", message: "Couldn't fetch user data!" }}))
            }
        }
        else {
            this.setState(prev => ({...prev, error: { code: "INVALID_LOGIN", message: "Invalid user or password!" }}))
        }
    }

    logout = async () => {
        this.setState(prev => ({...prev, authenticated: false, user: {}, token: null, error: {}}))
        sessionStorage.removeItem('authentication')
    }

    signup = async (name, email, nickname, password) => {
        const signupResponse = await APIClient.signup(name, email, nickname, password)

        signupResponse.ok ? this.login(nickname, password)
            : signupResponse.status === 409 ? this.setState(prev => ({...prev, error: { code: "USER ALREADY EXISTS", message: "Couldn't sign user up! User already exists." }}))
                : this.setState(prev => ({...prev, error: { code: "UNEXPECTED ERROR", message: "Couldn't sign user up! Unexpected error. Try later." }}))
    }

    render() {
        const auth = {
            authenticated: this.state.authenticated,
            user: this.state.user,
            token: this.state.token,
            error: this.state.error,
            login: this.login,
            logout: this.logout,
            signup: this.signup
        }

        return <AuthContext.Provider value = { auth } >
            { this.props.children }
        </AuthContext.Provider>
    }
}

export const Authentication = AuthContext.Consumer
export class AuthenticatedOnly extends Component {
    static propTypes = {
        requiredRole: PropTypes.string,
        children: PropTypes.element.isRequired
    }

    static defaultProps = {
        requiredRole : null
    }

    render(){
        return <Authentication>
            {
                auth => {
                    if (auth.authenticated && (this.props.requiredRole === null || auth.user.roles.includes(this.props.requiredRole)))
                        return this.props.children
                }
            }
        </Authentication>
    }
}
export class UnauthenticatedOnly extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    }

    render(){
        return <Authentication>
            {
                auth => {
                    if (!auth.authenticated)
                        return this.props.children
                }
            }
        </Authentication>
    }
}