import React, { Component } from "react"
import {
    Alert,
    Button,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap'

import { Redirect } from "react-router-dom"

import { Authentication } from '../authentication'

export default class Login extends Component {
    render() {
        return <Authentication>
            { auth => {
                if (auth.authenticated)
                    return <Redirect to ="/" />;
                else
                    return <Row>
                        <Col xs="12" sm={{size: 6, offset: 3}}>
                            <LoginForm onLogin = { auth.login } />
                            <LoginError error = { auth.error } />
                        </Col>
                    </Row>
            }}
        </Authentication>
    }
}

class LoginForm extends Component {
    constructor(){
        super()

        this.state = {
            username : "",
            password : ""
        }
    }

    onUsernameChange = event => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, username: value}))
    }

    onPasswordChange = event => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, password: value}))
    }

    onLoginButtonClick = () => {
        this.props.onLogin(this.state.username, this.state.password)
    }

    render() {
        return <Card color="primary">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardBody>
                <Form >
                    <FormGroup>
                        <Label>Username</Label>
                        <Input value = { this.state.username } onChange = { this.onUsernameChange }/>
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input type = "password" value = { this.state.password } onChange = { this.onPasswordChange }/>
                    </FormGroup>
                </Form>
            </CardBody>
            <CardFooter>
                <Button block onClick = { this.onLoginButtonClick }>Login</Button>
            </CardFooter>
        </Card>



    }
}

class LoginError extends Component {
    render(){
        if(this.props.error.code)
            return <Alert className = "mt-3" color="danger">
                {this.props.error.message}
            </Alert>
        else return null
    }
}