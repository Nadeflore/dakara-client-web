import fetch from 'unfetch'
import { LOGOUT } from 'actions/token'
export const FETCH_API = "FETCH_API"

/**
 * Middleware for api calls using fetch.
 * process actions with FETCH_API key.
 *
 * This key contains the following:
 *   endpoint: request uri
 *   method: http method
 *   types: array containing request, success, failure types
 *
 * optional keys:
 *   json: body to send to api
 *   onSuccess: action to be dispatched,
 *     or action creator taking success action as argument
 *   onFailure: action to be dispatched,
 *     or action creator taking failure action as argument
 *
 *
 * If a token is present in state,
 * this token is send as authorization on each request
 */
export default ({getState, dispatch}) => next => action => {
    let fetchApi = action[FETCH_API]

    if (typeof fetchApi === 'undefined') {
        return next(action)
    }

    /**
     * Extract params
     */
    const { endpoint, method, types, onSuccess, onFailure } = fetchApi
    const [ requestType, successType, failureType ] = types

    /**
     * Create new action from original action and resulting action
     */
    const actionWith = newAction => {
        const finalAction = {...action, ...newAction}

        // re-add json data if provided
        const { json } = finalAction[FETCH_API]
        finalAction.json = json

        // clean the final action from the fetch API instructions
        delete finalAction[FETCH_API]
        return finalAction
    }

    /**
     * Process action on success or failure
     * dispatch action as is, or actioncreator
     */
    const processAction = (entity, newAction) => {
        if (!entity) {
            return
        }

        if (entity instanceof Array) {
            for (let e of entity) {
                processAction(e, newAction)
            }
            return
        }

        if (typeof entity === 'function') {
            return entity(dispatch, getState, newAction)
        }

        return dispatch(entity)
    }

    // Send request action
    next(actionWith({ type: requestType }))


    /**
     * Create headers and body for fetch
     */
    let headers, body
    // add header for token
    const token = getState().token
    if (token) {
        headers = {
            Authorization: `Token ${token}`,
            ...headers
        }
    }

    // add header and body for JSON data
    const json = fetchApi.json
    if (json) {
        body = JSON.stringify(json),
        headers = {
            'Content-Type': 'application/json',
            ...headers
        }
    }


    return fetch(endpoint, { headers, body, method })
        .then(response => {
            const contentLength = response.headers.get("content-length")
            if (contentLength && contentLength == 0) {
                return null
            }

            const contentType = response.headers.get("content-type")
            if (!contentType.includes("application/json")) {
                if (!response.ok) {
                    return Promise.reject()
                }
                return null
            }

            return response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return json
            })
        })
        .then(response => {
            const newAction = actionWith({
                type: successType,
                response
            })
            processAction(onSuccess, newAction)
            return next(newAction)
        },
        error => {
            const newAction = actionWith({
                type: failureType,
                error: error || {}
            })
            processAction(onFailure, newAction)

            if (error && error.detail == "Invalid token.") {
                // Token expired on server, logout
                dispatch({type: LOGOUT})
            }

            return next(newAction)
        })

}
