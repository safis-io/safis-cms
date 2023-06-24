import * as React from 'react'
import safisLogo from '../images/icon.png'
import * as styles from './index.module.sass'
import Login from './components/Login'
import '@fontsource/inter'

const IndexPage: React.FC = (props) => (
  <main className={styles.pageStyles}>
    <title>Hi Safis</title>
    <img className={styles.logoStyles} alt="Safis Logo" src={safisLogo} />
    <h1 className={styles.headingStyles}>Hello Safis</h1>
    <Login/>
  </main>
)

export default IndexPage
