import { useCallback, useEffect, useReducer, useRef } from 'react'
import axios from 'axios'

const actions = {
  REQUEST_START: 'REQUEST_START',
  REQUEST_END: 'REQUEST_END'
}

function reducer(state, action) {
  switch (action.type) {
    case actions.REQUEST_START:
      return {
        ...state,
        loading: true,
        error: null
      }
    case actions.REQUEST_END:
      return {
        ...state,
        loading: false,
        ...(action.error ? {} : { data: action.payload.data }),
        [action.error ? 'error' : 'response']: action.payload
      }
    default:
      return state
  }
}

function createInitialState(options) {
  return {
    loading: !options.manual,
    error: null,
    data: null,
    response: null
  }
}

export const useAxios = makeUseAxios({
  axios: axios.create({ baseURL: `${process.env.API_URL}` })
}).useAxios

export function makeUseAxios(configurationOptions) {
  let axiosInstance = axios

  function configure(options = {}) {
    if (options.axios !== undefined) {
      axiosInstance = options.axios
    }
  }

  configure(configurationOptions)

  return { useAxios, configure }

  async function request(config, dispatch) {
    try {
      dispatch({ type: actions.REQUEST_START })
      const response = await axiosInstance.request(config)
      dispatch({ type: actions.REQUEST_END, payload: response })
      return response
    } catch (err) {
      if (axios.isCancel(err)) {
        return
      }

      dispatch({ type: actions.REQUEST_END, payload: err, error: true })
      throw err
    }
  }

  function useAxios(config, options) {
    if (typeof config === 'string') {
      config = {
        url: config
      }
    }

    const stringifiedConfig = JSON.stringify(config)

    options = { manual: false, ...options }

    const cancelSourceRef = useRef()

    const [state, dispatch] = useReducer(
      reducer,
      createInitialState(options)
    )

    useEffect(() => {
      cancelSourceRef.current = axios.CancelToken.source()

      if (!options.manual) {
        request(
          { cancelToken: cancelSourceRef.current.token, ...config },
          dispatch
        ).catch(() => { })
      }

      return () => cancelSourceRef.current.cancel()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stringifiedConfig])

    const refetch = useCallback(
      (configOverride) => {
        return request(
          {
            cancelToken: cancelSourceRef.current.token,
            ...config,
            ...configOverride
          },
          dispatch
        )
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [stringifiedConfig]
    )

    return [state, refetch]
  }
}
