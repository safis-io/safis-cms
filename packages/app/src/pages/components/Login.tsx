import React, { useState, useEffect } from 'react'
import {redirectTo, getCookieValue, setCookie} from '../utils'
import * as styles from '../index.module.sass'

const HOME = 'http://localhost:8000'
const SERVER_OUTH_LOGIN = 'http://localhost:3000/oauth/login'

const resetUserCookies = () => {
    const userCookies = ['user', 'access_token', 'returnUrl']
    
    userCookies.forEach((cookie) => {
        setCookie(cookie, HOME, -1)
    })
}

interface user {
    avatarUrl: string;
    username: string;
}

const Login = () => {
    const [user, setUser] = useState<user | undefined>(undefined)
    
    useEffect(() => {
        const userCookie = getCookieValue('user')
        if(userCookie) {
            setUser(JSON.parse(decodeURIComponent(userCookie)))
        }
    } , [])

    const onLogoutClick = () => {
        resetUserCookies()
        redirectTo(HOME)
    }

    const onLoginClick = () => {
        setCookie('returnUrl', HOME, 1)
        redirectTo(SERVER_OUTH_LOGIN)
    }

    return (
        <div className={styles.login}>
          {user && 
            <>
              <div>
                <h3>{user?.username}</h3>
                <img src={user?.avatarUrl}/>
              </div>
              <button type='submit' onClick={onLogoutClick}>Logout</button>
            </>
          }
          {!user && 
            <button type='submit' onClick={onLoginClick}>Login</button>
          }
        </div>
      )
}

export default Login