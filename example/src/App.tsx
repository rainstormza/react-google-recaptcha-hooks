import React from 'react'
import { useGoogleReCaptchaV2 } from 'react-google-recaptcha-hooks'

const App = () => {
  const {
    ReCaptchaBadge,
    executeReCaptcha,
    resetReCaptcha
  } = useGoogleReCaptchaV2({
    siteKey: '6LfER7MUAAAAAAWtV9QK1aAaMXwEct6AINoVGoTz',
    language: 'en'
  })

  const handleClick = async () => {
    const token = await executeReCaptcha()
    console.log('token:', token)

    setTimeout(() => {
      resetReCaptcha()
    }, 3000)
  }
  return (
    <div>
      test{' '}
      <div>
        {ReCaptchaBadge}

        <button onClick={handleClick}>Click</button>
      </div>
    </div>
  )
}

export default App
