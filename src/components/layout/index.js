import React, { Component } from 'react'
import NavigationBar from "../navbar"
import { Container } from "reactstrap"
import {PostList, FullPost} from "../post"
import {EditorList, FullEditor} from "../editor";
import UserPostList, {FullUserPost, NewPostEditor} from "../user"
import Login from "../login"
import Logout from "../logout"
import { Switch, Route, Redirect } from "react-router-dom"
import Signup from "../signup";

export default class Layout extends Component {
    render(){
        return <>
            <NavigationBar/>
            <Container className = "pt-3" tag = "main">
                <Switch>
                    <Route path = "/posts/:id" component = { FullPost }/>
                    <Route path = "/posts" component = { PostList } />
                    <Route path = "/editors/:id" component = { FullEditor }/>
                    <Route path = "/:userId/posts/new-post-editor" component = { NewPostEditor }/>
                    <Route path = "/:userId/posts/:postId" component = { FullUserPost }/>
                    <Route path = "/:id/posts" component = { UserPostList }/>
                    <Route path = "/editors" component = { EditorList } />
                    <Route path = "/login" component = { Login } />
                    <Route path = "/logout" component = { Logout } />
                    <Route path = "/signup" component = { Signup } />
                    <Redirect from = "/" to = "/posts"/>
                </Switch>
            </Container>
        </>
    }
}