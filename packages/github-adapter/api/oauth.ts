import {
  GetOAuthAccessTokenArgs,
  GetOAuthLoginUrlArgs,
} from '../types'

import { RestClient } from '../client/rest'

class OAuthApi {
  static getAccessToken =(args: GetOAuthAccessTokenArgs): Promise<string> => {
    const { clientId, clientSecret, query } = args

    return RestClient.getOAuthAccessToken({ clientId, clientSecret, query })
  }

  static getLoginUrl = (args: GetOAuthLoginUrlArgs): string => RestClient.getOAuthLoginUrl(args)
}

export { OAuthApi }
