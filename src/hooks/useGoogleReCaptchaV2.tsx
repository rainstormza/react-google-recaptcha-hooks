import * as React from 'react'

import {
  getProjectWindow,
  injectScript,
  removeScript
} from '../helpers/html-dom'

interface IGoogleReCaptchaOptions {
  siteKey: string
  language?: string
}

interface IGoogleReCaptchaV2HookReturn {
  reCaptchaResponseToken?: string
  ReCaptchaBadge?: JSX.Element
  executeReCaptcha: () => Promise<string>
  resetReCaptcha: () => void
}

type TGoogleReCaptchaV2Hook = (
  options: IGoogleReCaptchaOptions
) => IGoogleReCaptchaV2HookReturn

const ERROR_SCRIPT_NOT_AVAILABLE = 'Google recaptcha is not available'
const GOOGLE_RECAPTCHA_V2_SCRIPT = 'https://www.google.com/recaptcha/api.js'
const SCRIPT_ID = 'google-recaptcha-v2'
const RESPONSE_TIME_DELAY = 2000 // 2s

export const ERROR_TOKEN_FETCH_FAILED =
  'Failed to get the Google ReCaptcha token'

export const useGoogleReCaptchaV2: TGoogleReCaptchaV2Hook = ({
  siteKey,
  language
}) => {
  const [token, setToken] = React.useState<string>()
  const executionTimeoutIDRef = React.useRef<number>()

  const resetReCaptcha = () => {
    const window = getProjectWindow()
    if (!window) {
      return
    }

    const { grecaptcha } = window
    if (!grecaptcha) {
      console.error(ERROR_SCRIPT_NOT_AVAILABLE)
    }

    // try {
    //   const { getResponse, reset } = grecaptcha
    //   if (getResponse()) {
    //     reset()
    //   }
    // } catch (e) {}
  }

  const executeReCaptcha = () => {
    const window = getProjectWindow()
    if (!window) {
      return Promise.reject(new Error(''))
    }

    const { grecaptcha } = window
    if (!grecaptcha) {
      throw new Error(ERROR_SCRIPT_NOT_AVAILABLE)
    }

    return new Promise<string>((resolve, reject) => {
      if (executionTimeoutIDRef.current) {
        window.clearTimeout(executionTimeoutIDRef.current)
        executionTimeoutIDRef.current = undefined
      }

      window.grecaptchaTokenResponse = (token: string) => {
        setToken(token)
        resolve(token)
      }
      window.grecaptchaExpired = () => reject(new Error('grecaptcha-expired'))
      window.grecaptcha.execute()

      executionTimeoutIDRef.current = window.setTimeout(() => {
        resetReCaptcha()
      }, RESPONSE_TIME_DELAY)
    })
  }

  const setupGRecaptchaInitialCallbacks = () => {
    const window = getProjectWindow()
    if (!window) {
      return
    }
    window.grecaptchaTokenResponse = (_: any) => undefined
    window.grecaptchaExpired = () => undefined
  }

  const onLoadInjectedScript = () => {
    const window = getProjectWindow()
    if (!window) {
      return
    }

    const { grecaptcha } = window
    if (!grecaptcha) {
      console.warn(ERROR_SCRIPT_NOT_AVAILABLE)
    }
  }

  React.useEffect(() => {
    const window = getProjectWindow()
    if (!window || !siteKey) {
      return
    }

    setupGRecaptchaInitialCallbacks()

    const scriptTag = window.document.getElementById(SCRIPT_ID)
    if (!scriptTag) {
      injectScript(
        SCRIPT_ID,
        `${GOOGLE_RECAPTCHA_V2_SCRIPT}?render=onload${
          language ? `&hl=${language}` : ''
        }`,
        onLoadInjectedScript
      )
    }

    return () => {
      setupGRecaptchaInitialCallbacks()
      removeScript(SCRIPT_ID)
    }
  }, [siteKey, language])

  return {
    reCaptchaResponseToken: token,
    executeReCaptcha,
    resetReCaptcha,
    ReCaptchaBadge: (
      <div
        id='recaptcha'
        className='g-recaptcha'
        data-sitekey={siteKey}
        data-size='invisible'
        // data-badge="inline"
        data-callback='grecaptchaTokenResponse'
      />
    )
  }
}

export default useGoogleReCaptchaV2
