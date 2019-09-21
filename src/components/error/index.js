import React, { Component } from 'react'
import { Alert } from 'reactstrap'

export default class Error extends Component {

    render() {
        if(this.props.error.code)
            return <Alert className = "mt-3" color="danger">
                {this.props.error.message}
            </Alert>
        else return null
    }
}

export class ErrorHandler {

    static handleApiError(errorCode) {
        if(typeof(errorCode) === 'number') {
            if(errorCode >= 500) {
                var type = 'server'
                var message = ""

                switch(errorCode) {
                    case 500:
                        message = 'Internal server error. The server was unable to fulfill the request.'
                        break;
                    case 501:
                        message = 'Method not implemented. The server does not support the requested method.'
                        break;
                    case 503:
                        message = 'The service is unavailable. Try again later.'
                        break;
                    default:
                        message = 'Unexpected error in server.'
                }
            }
            else if(errorCode >= 400) {
                type = 'client'
                message = ""

                switch(errorCode) {
                    case 400:
                        message = 'Bad request. Check the request syntax!'
                        break;
                    case 401:
                        message = 'Unauthorized. Credentials either not included or not valid.'
                        break;
                    case 403:
                        message = 'Forbidden. Unauthorized to perform the action.'
                        break;
                    case 404:
                        message = 'The requested resource was not found.'
                        break;
                    case 405:
                        message = 'Method not allowed. Check supported methods for the resource in response header.'
                        break;
                    case 409:
                        message = 'Conflict. There is a problem between request resource and current resource state.'
                        break;
                    case 410:
                        message = 'Gone. The target resource is no longer available in server.'
                        break;
                    case 415:
                        message = 'Unsupported media type. Format not supported by the method on target resource.'
                        break;
                    case 422:
                        message = 'Unprocessable entity. Syntax and context are ok, but could not process the request entity.'
                        break;
                    default:
                        message = 'Unexpected error in client.'
                        break;
                }
            }

            return {
                code: errorCode,
                type: type,
                message: message
            }
        }
    }
}