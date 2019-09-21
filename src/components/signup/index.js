import React, { PureComponent as Component } from 'react'
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

export default class Signup extends Component {
    render() {
        return <Authentication>
            { auth => {
                if (auth.authenticated)
                    return <Redirect to ="/" />;
                else
                    return <Row>
                        <Col xs="12" sm={{size: 6, offset: 3}}>
                            <SignupForm onSignup = { auth.signup }/>
                            <SignupError error = { auth.error } />
                        </Col>
                    </Row>
            }}
        </Authentication>
    }
}

class SignupForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            email: "",
            nickname: "",
            password: "",
            repeatedPassword: ""
        }
    }

    onNameChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, name: value}))
    }

    onNicknameChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, nickname: value}))
    }

    onPasswordChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, password: value}))
    }

    onRepeatedPasswordChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, repeatedPassword: value}))
    }

    onEmailChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, email: value}))
    }

    onSignupButtonClick = (event) => {
        const password = this.state.password, repeatedPassword = this.state.repeatedPassword
        if(password === repeatedPassword) {
            this.props.onSignup(this.state.name, this.state.email, this.state.nickname, this.state.password)
        }
    }

    render() {
        return <Card color="primary">
        <CardHeader>
            <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardBody>
        <Form >
            <FormGroup>
            <Label>Name</Label>
            <Input value = { this.state.name } onChange = { this.onNameChange }/>
            </FormGroup>
            <FormGroup>
                <Label>Email</Label>
                <Input value = { this.state.email } onChange = { this.onEmailChange }/>
            </FormGroup>
            <FormGroup>
                <Label>Nickname</Label>
                <Input value = { this.state.nickname } onChange = { this.onNicknameChange }/>
            </FormGroup>
            <FormGroup>
                <Label>Password</Label>
                <Input type = "password" value = { this.state.password } onChange = { this.onPasswordChange }/>
                <Label>Repeat password</Label>
                <Input type = "password" value = { this.state.repeatedPassword } onChange = { this.onRepeatedPasswordChange }/>
            </FormGroup>
        </Form>
    </CardBody>
    <CardFooter>
        <Button block onClick = { this.onSignupButtonClick }>Sign Up</Button>
    </CardFooter>
    </Card>
    }
}

class SignupError extends Component {
    render(){
        if(this.props.error.code)
            return <Alert className = "mt-3" color="danger">
                {this.props.error.message}
            </Alert>
        else return null
    }
}