const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5'

type serializableObject = {[key: string]: string | number | undefined}

type currentWeatherResponse = {
  coord: {
    lon: number,
    lat: number
  }
  weather: {
    id: number,
    main: string,
    description: string,
    icon: string
  }[]
  base: string,
  main: {
    temp: number,
    feels_like: number,
    pressure: number,
    humidity: number,
    temp_min: number,
    temp_max: number,
    sea_level: number,
    grnd_level: number,
  },
  visibility: number,
  wind: {
    speed: number,
    deg: number,
    gust: number,
  },
  clouds: {
    all: number,
  }
  rain: {
    '1h': number,
    '3h': number,
  },
  snow: {
    '1h': number,
    '3h': number,
  }
  dt: number
  sys: {
    type: number,
    id: number,
    message: number,
    country: string,
    sunrise: number,
    sunset: number,
  }
  timezone: number,
  id: number,
  name: string,
  cod: number,
}

class currentWrapper {
  private endpoint = '/weather?'
  private requester: OpenWeather["request"]
  constructor(requester: OpenWeather["request"]) {
    this.requester = requester
  }

  private request(endpoint: string, obj: serializableObject, lang?: string) {
    return this.requester(endpoint, obj, lang) as Promise<currentWeatherResponse>
  }

  byCityName(name: string, { state, country , lang }: { state?: string, country?: string, lang?: string }) {
    return this.request(
      this.endpoint,
      {
        q: `${name}${state ? ',' + state : ''}${country ? ',' + country : ''}`
      },
      lang
    )
  }

  byCityId(id: number | number[], lang?: string) {
    const isArray = Array.isArray(id)
    return this.request(
      isArray ? '/group?' : this.endpoint,
      {
        id: `${Array.isArray(id) ? id.join(',') : id}`
      },
      lang
    )
  }

  byGeographic(lat: string, lon: string, lang?: string) {
    return this.request(
      this.endpoint,
      {
        lat,
        lon
      },
      lang
    )
  }

  byZipId(zip: string, { country, lang}:{ country?: string, lang?: string }) {
    return this.request(
      this.endpoint,
      {
        zip: `${zip}${country ? ',' + country : ''}`
      },
      lang
    )
  }

  byRectangle(
    lonLeft: number,
    latBottom: number,
    lonRight: number,
    latTop: number,
    zoom: number,
    {
      cluster,
      lang
    }: {
      cluster?: boolean,
      lang?: string
    }
  ) {
    return this.request(
      '/box/city?',
      {
        bbox: `${lonLeft},${latBottom},${lonRight},${latTop},${zoom}`,
        cluster: `${(cluster !== undefined && cluster ? 'yes' : 'no') || ''}`,
      },
      lang
    )
  }

  byCircle(
    lat: number,
    lon: number,
    {
      cluster,
      cnt,
      lang
    }: {
      cluster?: boolean,
      cnt?: number,
      lang?: string
    }
  ) {
    return this.request(
      '/find?',
      {
        lat,
        lon,
        cluster: `${(cluster !== undefined && cluster ? 'yes' : 'no') || ''}`,
        cnt,
      },
      lang
    )
  }
}

export class OpenWeather {
  private apiKey: string
  public current: currentWrapper
  private lang = 'en'
  constructor(apiKey: string, lang?: string) {
    this.apiKey = apiKey
    if (lang) {
      this.lang = lang
    }
    this.current = new currentWrapper(this.request)
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
      const res = await fetch(`${OPENWEATHER_URL}${endpoint}${this.serializeQueryString(obj)}&appid=${this.apiKey}${lang ? '&lang=' + lang : ''}`)
      return res.json()
    } catch(e) {
      throw e
    }
  }
}
