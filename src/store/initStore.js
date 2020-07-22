import { createStore, applyMiddleware, compose } from 'redux'
import reducers from '../reducers'

export default function initStore(middlewares) {
    if (process.env.NODE_ENV === `development`) {
        const { logger } = require(`redux-logger`)
        middlewares.push(logger)
    }

    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        reducers,
        composeEnhancer(applyMiddleware(...middlewares))
    );

    return { store }
}
