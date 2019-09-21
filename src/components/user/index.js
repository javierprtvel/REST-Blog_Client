import React, {PureComponent as Component} from 'react'
import {
    Row,
    Col,
    Label,
    Input,
    Button
} from 'reactstrap'
import {Link, Redirect} from 'react-router-dom'
import APIClient from "../api"
import Error, { ErrorHandler } from "../error"


export class FullUserPost extends Component {

    constructor(props) {
        super(props)

        this.state = {
            article: {
                _id: "",
                author: "",
                date: "",
                title: "",
                summary: "",
                body: "",
                tags: []
            },
            edited: false,
            error: {}
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleSummaryChange = this.handleSummaryChange.bind(this)
        this.handleBodyChange = this.handleBodyChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderRedirect = this.renderRedirect.bind(this)
    }

    async componentDidMount() {
        const userPostResponse = await APIClient.getPostByTitle(this.props.match.params.postId)

        if(userPostResponse.ok) {
            const userPost = await userPostResponse.json()
            this.setState(prev => ({...prev, article: {...userPost}}))
        }
        else {
            const error = ErrorHandler.handleApiError(userPostResponse.status)
            this.setState(prev => ({...prev, error: error}))
        }
    }

    handleTitleChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, article: {...(prev.article), title: value} }))
    }

    handleSummaryChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(this.setState(prev => ({...prev, article: {...(prev.article), summary: value} })))
    }

    handleBodyChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(this.setState(prev => ({...prev, article: {...(prev.article), body: value} })))
    }

    handleSubmit = async (event) => {
        if(this.state.article.title !== "" && this.state.article.summary !== "" && this.state.article.body !== "") {
            const updatedPost = { ...this.state.article }

            const modifyPostResponse = await APIClient.modifyPost(this.state.article._id, updatedPost)
            if(modifyPostResponse.ok) {
                this.setState(prev => ({ ...prev, edited: true }))
            }
            else {
                const error = ErrorHandler.handleApiError(modifyPostResponse.status)
                this.setState(prev => ({...prev, error: error}))
            }
        }
    }

    renderRedirect() {
        if(this.state.edited) {
            return <Redirect to = {`/posts/${this.state.article.title}`} />
        }
        else
            return null
    }

    render() {
        const tagStyle = {
            margin: "3px"
        }

        return (<section>
                <Error error = {this.state.error} />
            <article>
                <header>
                    <h1>{ this.state.article.title }</h1>
                </header>
                <div><h6>{ this.state.article.summary }</h6></div>
                <div>{this.state.article.body.split("\n").map((paragraph, index) => <p key= {`p-${index}`}>{paragraph}</p>)}</div>
                <div>{ this.state.article.tags.map(tag => (<span style={ tagStyle } className="badge badge-pill badge-dark">{tag}</span>)) }</div>
            </article>
            <hr/>
            <footer>
                <h4>Edit your post</h4>
                <hr/>
                <Row><Input type="text" value={this.state.article.title} onChange={this.handleTitleChange}/></Row><hr/>
                <Row><Input type="textarea" value={this.state.article.summary} onChange={this.handleSummaryChange}/></Row><hr/>
                <Row><Input type="textarea" value={this.state.article.body} onChange={this.handleBodyChange}/></Row><hr/>
                <Row><Input type="button" onClick={this.handleSubmit} value="Update post"/></Row><hr/>
            </footer>
            { this.renderRedirect() }
        </section>
        )
    }
}

export class NewPostEditor extends Component {

    constructor(props) {
        super(props)

        this.state = {
            _id: "",
            author: "",
            date: "",
            title: "",
            summary: "",
            body: "",
            tags: [],
            error: {}
        }

        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleSummaryChange = this.handleSummaryChange.bind(this)
        this.handleBodyChange = this.handleBodyChange.bind(this)
        this.handleTagsChange = this.handleTagsChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderRedirect = this.renderRedirect.bind(this)
    }

    async componentDidMount() {
        const userResponse = await APIClient.getUserByNickname(this.props.match.params.userId)
        const user = await userResponse.json()

        this.setState(prev => ({...prev, author: user._id}))
    }

    handleTitleChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, title: value}))
    }

    handleSummaryChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, summary: value}))
    }

    handleBodyChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        this.setState(prev => ({...prev, body: value}))
    }

    handleTagsChange = (event) => {
        let value = event.target !== null ? event.target.value : ""
        value = value.split(',').map(tag => tag.trim())
        this.setState(prev => ({...prev, tags: [...value]}))
    }

    handleSubmit = async (event) => {
        if(this.state.title !== "" && this.state.summary !== "" && this.state.body !== "") {
            const newPost = { ...this.state }

            const createPostResponse = await APIClient.createPost(this.state._id, newPost)
            if(createPostResponse.ok) {
                // cannot get resource id from header Location due to CORS response header restriction
                // using title alternative instead
                const userPostResponse = await APIClient.getPostByTitle(this.state.title)

                if(userPostResponse.ok) {
                    const userPost = await userPostResponse.json()
                    this.setState(prev => ({...userPost}))
                }
                else {
                    const error = ErrorHandler.handleApiError(userPostResponse.status)
                    this.setState(prev => ({ ...prev, error: error }))
                }
            }
            else {
                const error = ErrorHandler.handleApiError(createPostResponse.status)
                this.setState(prev => ({ ...prev, error: error }))
            }
        }
    }

    renderRedirect() {
        if(this.state._id !== "") {
            return <Redirect to={`/posts/${this.state.title}`}/>
        }
        else
            return null
    }

    render() {
        return <article>
            <h4>Write your post</h4>
            <hr/>
            <Error error = {this.state.error} />
            <Row><Label>Title</Label><Input type="text" value={this.state.title} onChange={this.handleTitleChange}/></Row><hr/>
            <Row><Label>Summary</Label><Input type="textarea" value={this.state.summary} onChange={this.handleSummaryChange}/></Row><hr/>
            <Row><Label>Body</Label><Input type="textarea" value={this.state.body} onChange={this.handleBodyChange}/></Row><hr/>
            <Row><Label>Tags</Label><Input type="text"  onChange={this.handleTagsChange}/></Row><hr/>
            <Row><Input type="button" onClick={this.handleSubmit} value="Create post"/></Row><hr/>
            { this.renderRedirect() }
        </article>

    }
}

export default class UserPostList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            author: "",
            authorNickname: "",
            articles: {
                content: [],
                currPage: 0,
                totalPages: 0
            },
            error: {}
        }

        this.getNextPage = this.getNextPage.bind(this)
    }

    async componentDidMount() {
        const userResponse = await APIClient.getUserByNickname(this.props.match.params.id)
        const user = await userResponse.json()
        const postsResponse = await APIClient.getPostsByAuthor(user._id)

        if(postsResponse.ok) {
            const postsPage = await postsResponse.json()
            this.setState(prev => ({...prev, author: user._id, authorNickname: user.nickname,
                articles: {
                    content: [...postsPage.content],
                    currPage: postsPage.number,
                    totalPages: postsPage.totalPages
                }}))
        }
        else {
            const error = ErrorHandler.handleApiError(postsResponse.status)
            this.setState(prev => ({ ...prev, error: error }))
        }
    }

    async getNextPage() {
        if(this.state.articles.currPage < (this.state.articles.totalPages - 1)) {
            const nextPage = this.state.articles.currPage + 1

            const postsResponse = await APIClient.getPostsByAuthor(this.state.author, nextPage)
            const postsPage = await postsResponse.json()
            this.setState( prev => ({...prev, articles: {
                    content: [...prev.articles.content, ...postsPage.content],
                    currPage: postsPage.number,
                    totalPages: postsPage.totalPages
                }}))
        }
    }

    handleDelete = async (postId) => {
        const deletePostResponse = await APIClient.deletePost(postId)

        if(deletePostResponse.status === 204) { // fetch articles again
            const currPage = this.state.articles.currPage

            const requests = []
            for(let i = 0; i <= currPage; i++) {
                requests.push(APIClient.getPostsByAuthor(this.state.author, i))
            }
            const responses = await Promise.all(requests)

            let postsArr = new Array(0)
            let newCurrPage = 0, newTotalPages = 0
            for(let i = 0; i < responses.length; i++) {
                let postsResponse = responses[i]

                if(postsResponse.ok) {
                    const postsPage = await postsResponse.json()
                    postsArr.push(...postsPage.content)
                    newCurrPage = parseInt(postsPage.number)
                    newTotalPages = parseInt(postsPage.totalPages)
                }
                else {
                    const error = ErrorHandler.handleApiError(postsResponse.status)
                    this.setState(prev => ({ ...prev, error: error }))
                }
            }

            this.setState(prev => ({...prev, articles: {
                    content: [...postsArr],
                    currPage: newCurrPage,
                    totalPages: newTotalPages
                }}))
        }
        else {
            const error = ErrorHandler.handleApiError(deletePostResponse.status)
            this.setState(prev => ({ ...prev, error: error }))
        }
    }

    render() {
        const currPage = this.state.articles.currPage
        const totalPages = this.state.articles.totalPages

        return (<div>
            <Link to = {`/${this.props.match.params.id}/posts/new-post-editor`}><Button type="button">New</Button></Link>
            <Row>
                <Col>Title</Col><Col>Date</Col><Col>Edit</Col><Col>Delete</Col>
            </Row>
            {
                this.state.articles.content.map(article => <UserPost
                    key={article._id}
                    id={article._id}
                    title={article.title}
                    userId={this.state.authorNickname}
                    date={article.date}
                    onDelete={this.handleDelete}/>)
            }
            { (currPage < totalPages - 1) ? <Row><Col> <li><Button onClick={this.getNextPage}>More</Button></li></Col></Row>
                : null }
            </div>)
        }
}

class UserPost extends Component {

    onDeleteButtonClick = () => this.props.onDelete(this.props.id)

    render() {
        const EditButton = () => (<Link to = {`/${this.props.userId}/posts/${this.props.title}`}>
            <Button type="button">Edit</Button>
        </Link>)

        return <Row>
            <Col>
                <Link to={`/posts/${this.props.title}`}>{this.props.title}</Link>
            </Col>
            <Col>
                {this.props.date}
            </Col>
            <Col>
                <EditButton />
            </Col>
            <Col>
                <Button onClick={this.onDeleteButtonClick}>Delete</Button>
            </Col>
        </Row>
    }
}