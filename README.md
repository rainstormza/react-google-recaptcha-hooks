# react-google-recaptcha-hooks

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-google-recaptcha-hooks.svg)](https://www.npmjs.com/package/react-google-recaptcha-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-google-recaptcha-hooks
```

## Usage

```tsx
import React from 'react'
import { useGoogleReCaptchaV2 } from 'react-google-recaptcha-hooks'

const App = () => {
  const {
    ReCaptchaBadge,
    executeReCaptcha,
    resetReCaptcha
  } = useGoogleReCaptchaV2({
    siteKey: '',
    language: 'en'
  })

  const handleClick = async () => {
    const token = await executeReCaptcha()

    setTimeout(() => {
      resetReCaptcha()
    }, 3000)
  }
  return (
    <div>
        {ReCaptchaBadge}

        <button onClick={handleClick}>Click</button>
    </div>
  )
}

export default App
```

## License

MIT © [armspkt](https://github.com/armspkt)
