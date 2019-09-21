import React, { PureComponent as Component } from 'react'
import { Link } from 'react-router-dom'
import {
    Button
} from 'reactstrap'
import APIClient from "../api"

export class EditorPreview extends Component {
    render(){
        return <div>
            <div>
                <h1>{ this.props.nickname }</h1>
                <h5 className = "text-muted">Since <time className = "d-inline" dateTime = { this.props.signupDate }>{ this.props.signupDate }</time></h5>
            </div>
            <footer className = "mb-3">
                <Link to = {`/editors/${this.props.nickname}`}>See profile</Link>
            </footer>
        </div>
    }
}

export class FullEditor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id: "",
            nickname: "",
            name: "",
            signupDate: "",
            articles: {
                content: [],
                currPage: 0,
                totalPages: 0
            }
        }

        this.getNextPage = this.getNextPage.bind(this)
    }

    async componentDidMount() {
        const editorResponse = await APIClient.getEditorByNickname(this.props.match.params.id)
        const editor = await editorResponse.json()

        const postsResponse = await APIClient.getPostsByAuthor(editor._id)
        const postsPage = await postsResponse.json()

        this.setState( prev => ({...prev, _id: editor._id, nickname: editor.nickname, name: editor.name,
            signupDate: editor.signupDate, articles: {
                content: [...(postsPage.content.map(post => post.title))],
                currPage: postsPage.number,
                totalPages: postsPage.totalPages
            }}))
    }


    async getNextPage() {
        if(this.state.articles.currPage < (this.state.articles.totalPages - 1)) {
            const nextPage = this.state.articles.currPage + 1

            const postsResponse = await APIClient.getPostsByAuthor(this.state._id, nextPage)
            const postsPage = await postsResponse.json()

            this.setState( prev => ({...prev, articles: {
                    content: [...prev.articles.content, ...(postsPage.content.map(post => post.title))],
                    currPage: postsPage.number,
                    totalPages: postsPage.totalPages
                }}))
        }
    }

    render() {
        const currPage = this.state.articles.currPage
        const totalPages = this.state.articles.totalPages

        return (
            <div>
                <h1>{ this.state.nickname }</h1>
                <div>
                    <ul>
                        <li>Name: {this.state.name}</li>
                        <li>Nickname: {this.state.nickname}</li>
                        <li>Since: {this.state.signupDate}</li>
                        <li>Posts:
                            <ul>
                                {this.state.articles.content.map(article => (<li key = { article._id }><Link to = {`/posts/${article}`}>{ article }</Link>
                                   </li>))}
                                { (currPage < totalPages - 1) ? <li><Button onClick={this.getNextPage}>More</Button></li> : null }
                            </ul>
                        </li>
                    </ul>

                </div>
            </div>
        )
    }
}

export class EditorList extends Component {
    constructor() {
        super()

        this.state = {
            editors: []
        }
    }

    async componentDidMount() {
        const editorsResponse = await APIClient.getEditors()
        const editorsPage = await editorsResponse.json()

        this.setState( prev => ({...prev, editors: [...editorsPage.content]}))
    }

    render() {
        return this.state.editors.map( editor => <EditorPreview
            key = { editor._id }
            nickname = { editor.nickname }
            signupDate = { editor.signupDate } />
        )
    }
}