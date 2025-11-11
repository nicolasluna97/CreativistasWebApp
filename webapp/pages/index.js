function SiteIndex () {
  return (
    <div>
      <h3>Tests de personalidad</h3>
      <p>
        Tomá gratis un test de personalidad basado en el modelo de los 5 grandes o el MBTI.<br />
        Conocé mejor tus aptitudes con un perfil detallado de tus rasgos de personalidad.
      </p>
      <p>
        Los test de perfil de personalidad son una herramienta muy poderosa que puede usarse bien o mal.
        Todas las personas tenemos tendencias y preferencias que hacen que seamos quien somos hoy.
        Estilos únicos que podemos, para simplificar su entendimiento, agrupar en características generales y particulares.
        Los test son una foto de una persona que es mucho más compleja que una serie de variables, pero esa foto nos permite comprender de una forma sencilla y práctica dónde está cada uno en este momento.
      </p>
      <p>
        Pueden usarse para procesos de selección, para armado de equipos y sobretodo para desarrollo profesional o rediseño de carrera laboral.
        Son también muy útiles para hacer mapas de personalidad de un equipo y así entender complementariedades y diferencias.
        En contextos dinámicos donde la diversidad es clave, entender las diferencias es el primer paso para respetarlas y fortalecerlas.
      </p>
      <p>
        Sigamos en contacto.<br />
        Seguinos en <a href="https://www.instagram.com/creactivistas/" style={{color: '#00d090', fontSize: '1.1rem'}}>@creactivistas</a>
      </p>
    </div>
  )
}
export async function getStaticProps(context) {
  return {
    props: {}
  }
}

export default SiteIndex