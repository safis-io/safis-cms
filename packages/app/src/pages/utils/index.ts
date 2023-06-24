export const redirectTo = (url: string) => (window.location.href = url)

export const getCookieValue = (name: string): string|undefined  => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop()
)

export const setCookie = (name: string, value: string, expireDays: number): void => {
  const date = new Date()
  date.setTime(date.getTime() + (expireDays*24*60*60*1000))
  const expires = "expires="+ date.toUTCString()

  document.cookie = name + "=" + value + ";" + expires + ";path=/"
}

