import { useRouter } from 'next/router'
import Link from '../alheimsins/Link'

export default ({ path, user, info }) => {
  const router = useRouter()
  const big5 = router.pathname.indexOf('/big5') > -1
  return (
    <header>
      <div className='logo-container'><img src='/static/creactivistas_isologo_220x121px.png' alt='Creactivistas' className='Creactivistas-logo' /></div>
      <div className='nav-container'>
        <div className='links-container'>
          <Link route='/' activeClassName='active'><a>Inicio</a></Link>
          <Link route='/actus' activeClassName='active'><a>Actus</a></Link>
          <Link route='/big5' activeClassName='active'><a>Big 5</a></Link>
        </div>
        <div className='nav-right'>
          {/* {user
            ? <span>logged in as <b>{user}</b></span>
            : <a href='/api/login' style={{ color: 'black' }}>LOGIN</a>} */}
        </div>
        {info && <div className='nav-info'>{info}</div>}
      </div>
      {big5 && (
        <div className='nav-container'>
          <div className='links-container'>
            <Link route='/' activeClassName='active'>Inicio</Link>
            <Link route='/actus' activeClassName='active'>Actus</Link>
            <Link route='/big5' activeClassName='active'>Big 5</Link>
            <Link route='/big5' activeClassName='active' sublink>INTRO</Link>
            <Link route='/big5/test' activeClassName='active'>TEST</Link>
            <Link route='/big5/resultados' activeClassName='active'>RESULTADOS</Link>
            {/* <Link route='/big5/compare' activeClassName='active'>COMPARE</Link> */}
            <Link route='/big5/creditos' activeClassName='active'>CRÉDITOS</Link>
          </div>
          <div className='nav-right'>
            {/* {user
              ? <span>logged in as <b>{user}</b></span>
              : <a href='/api/login' style={{ color: 'black' }}>LOGIN</a>} */}
          </div>
          {info && <div className='nav-info'>{info}</div>}
        </div>
      )}
      <style jsx>
        {`
          header {
            grid-area: header;
            justify-self: center;
            background: white;
            margin: auto;
            padding: 25px;
            max-width: 1080px;
          }
          .logo-container {
            display: flex;
            justify-content: center;
            width: 1080px;
            height: 130px;
          }
          .Creactivistas-logo {
            width: 220px;
            height: 121px;
          }
          .nav-info {
            position: absolute;
            font-size: 12px;
            left: 10%;
          }
          .nav-container {
            padding: 12px;
            background-color: #fafafa;
          }
          .nav-container:nth-child(2) {
            background-color: #dadada;
            padding: 6px 0 9px;
            line-height: 1.5em;
          }
          .nav-container:nth-child(2) .active {
            text-decoration: underline #909090;
            text-underline-position: under;
          }
          .links-container {
            display: inline-block;
          }
          .nav-right {
            right: 20px;
            position: absolute;
            display: inline-block;
            font-size: 12px;
          }
          a {
            color: #0a9c9c;
            padding: 10px;
            font-size: 1em;
          }
          .nav-container:nth-child(2) a {
            color: #222;
            font-size: 1.2em;
          }
          a:hover {
            color: black;
          }
          .active {
            color: black !important;
          }
          @media screen and (max-width: 800px) {
            .nav-right {
              display: none;
            }
          }
        `}
      </style>
    </header>
  )
}
