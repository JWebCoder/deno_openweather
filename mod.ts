import { currentWrapper } from './currentWrapper.ts'
import { hourlyWrapper } from './hourlyWrapper.ts'
import { oneCallWrapper } from './oneCallWrapper.ts'

const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5'

export type serializableObject = {[key: string]: string | number | undefined}

export class OpenWeather {
  private apiKey: string
  public current: currentWrapper
  public hourly: hourlyWrapper
  public oneCall: oneCallWrapper
  private lang = 'en'
  constructor(apiKey: string, lang?: string) {
    this.apiKey = apiKey
    if (lang) {
      this.lang = lang
    }
    this.current = new currentWrapper(this.request)
    this.hourly = new hourlyWrapper(this.request)
    this.oneCall = new oneCallWrapper(this.request)
  }

  public setApiKey(key: string) {
    this.apiKey = key
  }

  private serializeQueryString(obj: serializableObject): string {
    return Object.entries(obj).filter(([key, value]) => value === undefined).map(
      ([key, value]) => {
        return `${key}=${encodeURIComponent(value as string | number)}`
      }
    ).join('&')
  }

  private async request(endpoint: string, obj: serializableObject, lang?: string) {
    try {
      const res = await fetch(`${OPENWEATHER_URL}${endpoint}${this.serializeQueryString(obj)}&appid=${this.apiKey}&lang=${lang || this.lang}`)
      return res.json()
    } catch(e) {
      throw e
    }
  }
}
