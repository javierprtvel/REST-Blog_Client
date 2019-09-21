const BASE_URL = 'http://localhost:8080/restblog'

let token = sessionStorage.getItem('authentication') ?
    (JSON.parse(sessionStorage.getItem('authentication'))).token
    : null

export default class APIClient {
    static async login(user, pass) {
        const loginRequest = await fetch(`${BASE_URL}/login`,
            {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    username: user,
                    password: pass
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

        const loginResponse = await loginRequest
        if(loginResponse.ok) token = loginResponse.headers.get("Authorization")

        return loginResponse
    }

    static async signup (name, email, nickname, password) {
        const bodyObj = {
            name: name,
            password: password,
            nickname: nickname,
            email: email,
            signupDate: "",
            roles: ["READER"],
            subscriptions: [],
            suspended: false
        }

        const signupResponse = await fetch(`http://localhost:8080/restblog/users`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Content-Type": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(bodyObj)
            })

        return signupResponse
    }

    static async getUser(id) {
        const userRequest = await fetch(`${BASE_URL}/users/${id}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Authorization": token,
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const userResponse = await userRequest

        return userResponse
    }

    static async getUserByNickname(nickname) {
        const userRequest = await fetch(`${BASE_URL}/users/nickname/${nickname}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Authorization": token,
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const userResponse = await userRequest

        return userResponse
    }

    static async getPosts(page = 0) {
        const postsRequest = await fetch(`${BASE_URL}/posts?page=${page}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const postsResponse = await postsRequest

        return postsResponse
    }


    static async getPostsByAuthor(author, page = 0) {
        const postsRequest = await fetch(`${BASE_URL}/posts?author=${author}&page=${page}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const postsResponse = await postsRequest

        return postsResponse
    }

    static async getPost(id) {
        const postRequest = await fetch(`${BASE_URL}/posts/${id}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const postResponse = await postRequest

        return postResponse
    }

    static async getPostByTitle(title) {
        const postRequest = await fetch(`${BASE_URL}/posts/title/${title}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const postResponse = await postRequest

        return postResponse
    }

    static async createPost(id, newPost) {
        const postRequest = await fetch(`${BASE_URL}/posts/`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Accept": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(newPost)
            })

        const postResponse = await postRequest

        return postResponse
    }

    static async modifyPost(id, updatedPost) {
        const postRequest = await fetch(`${BASE_URL}/posts/${id}`,
            {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Accept": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(updatedPost)
            })

        const postResponse = await postRequest

        return postResponse
    }

    static async deletePost(id) {
        const postRequest = await fetch(`${BASE_URL}/posts/${id}`,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Authorization": token,
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const postResponse = await postRequest

        return postResponse
    }

    static async getComments(post, page = 0) {
        const commentsRequest = await fetch(`${BASE_URL}/posts/${post}/comments?page=${page}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const commentsResponse = await commentsRequest

        return commentsResponse
    }

    static async createComment(post, user, text) {
        const bodyObj = {
            post: post,
            user: user,
            text: text,
            date: ""
        }

        const commentRequest = await fetch(`${BASE_URL}/posts/${post}/comments`,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8",
                    "Authorization": token,
                    "Content-Type": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(bodyObj)
            })

        const commentResponse = await commentRequest

        return commentResponse
    }

    static async getEditors(page = 0) {
        const editorsRequest = await fetch(`${BASE_URL}/users/editors?page=${page}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const editorsResponse = await editorsRequest

        return editorsResponse
    }

    static async getEditor(id) {
        const userRequest = await fetch(`${BASE_URL}/users/editors/${id}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const userResponse = await userRequest

        return userResponse
    }

    static async getEditorByNickname(nickname) {
        const userRequest = await fetch(`${BASE_URL}/users/editors/nickname/${nickname}`,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json;charset=UTF-8"
                }
            })

        const userResponse = await userRequest

        return userResponse
    }
}