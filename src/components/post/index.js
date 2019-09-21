import React, { PureComponent as Component } from 'react'
import { Link } from 'react-router-dom'
import {
    Pagination, PaginationItem, PaginationLink,
    Form,
    FormGroup,
    Input,
    Button,
} from 'reactstrap'
import APIClient from "../api"
import { AuthenticatedOnly, Authentication } from "../authentication"
import Error, { ErrorHandler } from "../error"

export class PostPreview extends Component {
    render(){
        return <article>
            <header>
                <h1>{ this.props.title }</h1>
                <h5 className = "text-muted"><address className = "d-inline">by {this.props.author}</address> on <time className = "d-inline" dateTime = { this.props.date }>{ this.props.date }</time></h5>
            </header>
            <p>{this.props.summary}</p>
            <footer className = "mb-3">
                <Link to = {`/posts/${this.props.title}`}>View more...</Link>
            </footer>
        </article>
    }
}

export class FullPost extends Component {
    constructor(){
        super()

        this.state = {
            id: "",
            author : "",
            date: "",
            title: "",
            body: "",
            tags: [],
            comments: {
                content: [],
                currPage: 0,
                totalPages: 0
            }
        }

        this.getNextPage = this.getNextPage.bind(this)
    }

    async componentDidMount() {
        const postResponse = await APIClient.getPostByTitle(this.props.match.params.id)
        const post = await postResponse.json()

        const editorResponse = await APIClient.getEditor(post.author)
        const editor = await editorResponse.json()

        const commentsResponse = await APIClient.getComments(post._id)
        const commentsPage = await commentsResponse.json()
        const comments = await Promise.all(commentsPage.content.map(async comment => {
            const u = await this.getUserNickname(comment.user)
            comment.userNickname = u
            return comment
        }))

        this.setState(prev => ({...prev, id: post._id, author: editor.name, date: post.date, title: post.title, body: post.body, tags: [...post.tags],
            comments: { content: [...comments], currPage: commentsPage.number, totalPages: commentsPage.totalPages }}))
    }

    async getNextPage() {
        if(this.state.comments.currPage < (this.state.comments.totalPages - 1)) {
            const nextPage = this.state.comments.currPage + 1

            const commentsResponse = await APIClient.getComments(this.state.id, nextPage)
            const commentsPage = await commentsResponse.json()
            const comments = await Promise.all(commentsPage.content.map(async comment => {
                const u = await this.getUserNickname(comment.user)
                comment.userNickname = u
                return comment
            }))

            this.setState( prev => ({...prev, comments: {
                    content: [...prev.comments.content, ...comments],
                    currPage: commentsPage.number,
                    totalPages: commentsPage.totalPages
                }}))
        }
    }

    getUserNickname = async (user) => {
        const userResponse = await APIClient.getUser(user)
        const userObj = await userResponse.json()

        return userObj.nickname
    }

    onCommentSubmit = () => window.location.reload()

    render() {
        const tagStyle = {
            margin: "3px"
        }

        const currPage = this.state.comments.currPage
        const totalPages = this.state.comments.totalPages

        return <article>
            <header>
                <h1>{ this.state.title }</h1>
                <h5 className = "text-muted"><address className = "d-inline">by { this.state.author }</address> on <time className = "d-inline" dateTime = { this.state.date }>{ this.state.date }</time></h5>
            </header>
            {this.state.body.split("\n").map((paragraph, index) => <p key= {`p-${index}`}>{paragraph}</p>)}
            <div>
                { this.state.tags.map(tag => (<span style={ tagStyle } className="badge badge-pill badge-dark">{tag}</span>)) }
            </div>
            <section>
                <header>
                    <h3>Comments</h3>
                    <hr />
                </header>
                { this.state.comments.content.map(comment => <PostComment key = {comment._id} user = { comment.userNickname } text = {comment.text} date = {comment.date} />) }
                { (currPage < totalPages - 1) ? <Button onClick={this.getNextPage}>More</Button> : null }
            </section>
            <AuthenticatedOnly>
                <Authentication>
                    {
                        auth => {
                            return <footer className = "mb-3">
                                <CommentMenu post = {this.state.id} user = { auth.user._id } onSubmit = {this.onCommentSubmit}/>
                            </footer>
                        }
                    }
                </Authentication>
            </AuthenticatedOnly>
        </article>
    }
}

export class PostComment extends Component {
    render() {
        return <article>
            <header>
                <h5>{this.props.user}</h5>
                <h6>{this.props.date}</h6>
            </header>
            { this.props.text.split("\n").map((paragraph, index) => <p key = {`c-${index}`}>{paragraph}</p>) }
        </article>
    }
}

export class PostList extends Component {
    constructor(props){
        super(props)
        this.state = {
            articles : [],
            totalPages: 0,
            editors: []
        }

        this.getEditorName = this.getEditorName.bind(this)
        this.getResume = this.getResume.bind(this)
    }

    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search)
        const page = params.get("page") || 0

        const postsResponse = await APIClient.getPosts(page)
        const postsPage = await postsResponse.json()

        let editorRequestArr = []
        for(let i = 0; i < postsPage.numberOfElements; i++) {
            let editorRequest = APIClient.getEditor(postsPage.content[i].author)
            editorRequestArr.push(editorRequest)
        }
        const editorResponses = await Promise.all(editorRequestArr)
        let editorsArr = []
        for(let i = 0; i < editorResponses.length; i++) {
            let editorResponse = editorResponses[i]
            let editor = await editorResponse.json()
            editorsArr.push(editor)
        }

        this.setState(prev => ({...prev, articles: [...postsPage.content], totalPages: postsPage.totalPages, editors: [...editorsArr]}))
    }

    async componentDidUpdate(prevProps) {
        const prevParams = new URLSearchParams(prevProps.location.search)
        const prevPage = parseInt(prevParams.get("page")) || 0
        const currParams = new URLSearchParams(this.props.location.search)
        const currPage = parseInt(currParams.get("page")) || 0

        if(currPage !== prevPage) {
            const postsResponse = await APIClient.getPosts(currPage)
            const postsPage = await postsResponse.json()

            let editorRequestArr = []
            for(let i = 0; i < postsPage.numberOfElements; i++) {
                let editorRequest = APIClient.getEditor(postsPage.content[i].author)
                editorRequestArr.push(editorRequest)
            }
            const editorResponses = await Promise.all(editorRequestArr)
            let editorsArr = []
            for(let i = 0; i < editorResponses.length; i++) {
                let editorResponse = editorResponses[i]
                let editor = await editorResponse.json()
                editorsArr.push(editor)
            }

            this.setState(prev => ({...prev, articles: [...postsPage.content], totalPages: postsPage.totalPages, editors: [...editorsArr]}))
        }
    }

    getEditorName = id => this.state.editors.find(editor => editor._id === id).name
    getResume = body => `${body.substring(0, 200)}...`

    render() {
        const page = new URLSearchParams(this.props.location.search).get("page") || 0

        return <div>
            {
                this.state.articles.map(article => <PostPreview
                    key = { article._id }
                    author = { this.getEditorName(article.author) }
                    title = { article.title }
                    date = { article.date }
                    summary = { article.summary }
                    id = { article._id } />
                )
            }
            <Pagination>
                {
                    Array.from(Array(this.state.totalPages).keys()).map(value =>
                    <PaginationItem key={value} active = {parseInt(page) === value}>
                        <PaginationLink tag={Link} to = {`/posts?page=${value}`}>
                            {1 + value}
                        </PaginationLink>
                    </PaginationItem>
                    )
                }
            </Pagination>
        </div>
    }
}

export class CommentMenu extends Component {

    constructor(props) {
        super(props)

        this.state = {
            commentText: "",
            error: {}
        }

        this.onTextAreaChange = this.onTextAreaChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    onTextAreaChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, commentText: value}))
    }

    handleSubmit = async (event) => {
        if(this.state.commentText !== "") {
            const post = this.props.post
            const user = this.props.user
            const text = this.state.commentText

            const commentResponse = await APIClient.createComment(post, user, text)
            commentResponse.ok ? this.props.onSubmit()
                : this.setState(prev => ({ ...prev, error: (ErrorHandler.handleApiError(commentResponse.status))}))
        }
        else {
            this.setState(prev => ({...prev, error: {code: 0, type: 'user', message: "Comment body is empty!"}}))
        }
    }

    render() {
        const style = {
            "borderTop": "1px black"
        }

        return (<div id="commentMenu" style={style}>
            <hr/>
            <h2>Add a comment</h2>
            <Form>
                <FormGroup>
                    <Input type="textarea" name="commentText" id="commentInput" value = {this.state.commentText} onChange={this.onTextAreaChange}/>
                </FormGroup>
                <Button onClick={ this.handleSubmit }>Send</Button>
            </Form>
            <Error error = { this.state.error } />
        </div>)
    }
}