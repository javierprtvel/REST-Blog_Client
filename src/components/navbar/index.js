import React, { PureComponent as Component } from 'react'
import {FiSearch as SearchIcon} from "react-icons/fi"
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Button
} from 'reactstrap'

import { Link } from 'react-router-dom'
import { AuthenticatedOnly, UnauthenticatedOnly, Authentication } from "../authentication";

export default class NavigationBar extends Component {
    onSearchButtonClick = () => {}

    render(){
        return <Navbar sticky = "top" expand dark color = "primary">
            <NavbarBrand tag={Link} to="/">REST Blog</NavbarBrand>
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink tag={Link} to="/posts?page=0">Posts</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} to="/editors">Editors</NavLink>
                </NavItem>
                <AuthenticatedOnly requiredRole = "ADMIN">
                    <NavItem>
                        <NavLink tag={Link} to="/admin">Admin</NavLink>
                    </NavItem>
                </AuthenticatedOnly>
                <AuthenticatedOnly requiredRole = "EDITOR">
                    <NavItem>
                        <Authentication>
                            {
                                auth => <NavLink tag={Link} to={`/${auth.user.nickname}/posts`}>My posts</NavLink>
                            }
                        </Authentication>
                    </NavItem>
                </AuthenticatedOnly>
                <UnauthenticatedOnly>
                    <NavItem>
                        <NavLink tag={Link} to="/login">Login</NavLink>
                    </NavItem>
                </UnauthenticatedOnly>
                <UnauthenticatedOnly>
                    <NavItem>
                        <NavLink tag={Link} to="/signup">Sign Up</NavLink>
                    </NavItem>
                </UnauthenticatedOnly>
                <AuthenticatedOnly>
                    <NavItem>
                        <NavLink tag={Link} to="/logout">Logout</NavLink>
                    </NavItem>
                </AuthenticatedOnly>
            </Nav>
            <Form inline>
                <FormGroup>
                    <InputGroup size = "sm">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <SearchIcon/>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input type = "text" placeholder="Search..." />
                        <InputGroupAddon addonType="append">
                            <Button onClick={this.onSearchButtonClick}>Search</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
            </Form>
        </Navbar>
    }
}
