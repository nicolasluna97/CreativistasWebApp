import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

export default ({ children }) => (
  <div className='container'>
    <Head>
      <title>Creactivistas: Tests de personalidad</title>
      <meta name='viewport' content='initial-scale=0.8, maximum-scale=0.8, width=device-width' />
      <meta property='og:title' content='Querés tomar un test de personalidad basado en el modelo de los 5 grandes o el MBTI?' />
      <meta property='og:description' content='Tomá gratis un test de personalidad basado en el modelo de los 5 grandes o el MBTI. Conocé tus aptitudes mejor con un perfil detallado de tus razgos de personalidad.' />
      <meta property='og:image' content='/static/apple-icon-152x152.png' />
      <meta name='theme-color' content='#000000' />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:creator' content='@alerbuteler' />
      <meta name='twitter:title' content='Querés tomar un test de personalidad basado en el modelo de los 5 grandes o el MBTI?' />
      <meta name='twitter:description' content='Conocé tus aptitudes mejor con un perfil detallado de tus razgos de personalidad.' />
      <meta name='twitter:image' content='http://www.actus.com.ar/zoom/static/apple-icon.png' />
      <meta name='description' content='Tomá gratis un test de personalidad basado en el modelo de los 5 grandes o el MBTI. Conocé tus aptitudes mejor con un perfil detallado de tus razgos de personalidad.' />
      <meta name='keywords' content='Zoom, Actus, BigFive, Big5, MBTI, razgos de personalidad, tests de personalidad, test de personalidad, tests psicometricos, test psicometrico' />
      <link rel='icon' sizes='192x192' href='/static/android-icon-192x192.png' />
      <link rel='apple-touch-icon' href='/static/apple-icon-152x152.png' />
      <link rel='shortcut icon' href='/static/favicon.ico' />
      <link rel='manifest' href='/static/manifest.json' />
    </Head>
    <Header/>
    <div className='main'>
      <div className='content'>
      {children}
      </div>
    </div>
    <Footer />
    <style jsx global>
    {`
    body {
    color: black;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    text-align: center;
    margin: 0;
    padding: 0;
    background: #666;
    background:
      linear-gradient(27deg, #151515 5px, transparent 5px) 0 5px,
      linear-gradient(207deg, #151515 5px, transparent 5px) 10px 0px,
      linear-gradient(27deg, #222 5px, transparent 5px) 0px 10px,
      linear-gradient(207deg, #222 5px, transparent 5px) 10px 5px,
      linear-gradient(90deg, #1b1b1b 10px, transparent 10px),
      linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424);
    background-color: #131313;
    background-size: 20px 20px;

    /* ❌ QUITAMOS ESTO
    position: relative;
    height: 100%;
    min-height: calc(100vh - 180px);
    padding-bottom: 180px;
    */
  }

  /* Footer fix */
  html, body, #__next {
    height: 100%;
  }

  .container {
    min-height: 100vh;
    display: grid;
    grid-template-areas:
      "header header header"
      ". content ."
      "footer footer footer";
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto 1fr auto;
  }

  .main {
    grid-area: content;
    background: white;
    width: 1010px;
    padding-left: 60px;
    padding-right: 60px;
    padding-top: 12px; /* <-- Fix definitivo */
  }

  .main > :first-child {
    margin-top: 0 !important;
  }

  a { text-decoration: none; }
    
  `}
  </style>
  </div>
)
