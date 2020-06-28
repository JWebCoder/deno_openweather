import { OpenWeather, serializableObject } from './mod.ts'

type dailyWeatherResponse = {
  city: {
    id: number,
    name: string
    coord: {
      lat: number,
      lon: number,
    }
  }
  country: string,
  timezone: number,
  cod: string,
  message: number,
  cnt: number,
  list: {
    dt: number,
    temp: {
      day: number,
      min: number,
      max: number,
      night: number,
      eve: number,
      morn: number,
    },
    feels_like: {
      day: number,
      night: number,
      eve: number,
      morn: number,
    }
    pressure: number,
    humidity: number,
    weather: {
      id: number,
      main: string,
      description: string,
      icon: number,
    }[],
    speed: number,
    deg: number,
    clouds: number,
    rain: number,
    snow: number,
  }[]
}

export class dailyWrapper {
  private endpoint = '/forecast/daily?'
  private requester: OpenWeather["request"]
  constructor(requester: OpenWeather["request"]) {
    this.requester = requester
  }

  private request(endpoint: string, obj: serializableObject, lang?: string) {
    return this.requester(endpoint, obj, lang) as Promise<dailyWeatherResponse>
  }

  byCityName(name: string, cnt: number, { state, country , lang }: { state?: string, country?: string, lang?: string }) {
    return this.request(
      this.endpoint,
      {
        q: `${name}${state ? ',' + state : ''}${country ? ',' + country : ''}`,
        cnt
      },
      lang
    )
  }

  byCityId(id: number | number[], cnt: number, lang?: string) {
    const isArray = Array.isArray(id)
    return this.request(
      isArray ? '/group?' : this.endpoint,
      {
        id: `${Array.isArray(id) ? id.join(',') : id}`,
        cnt,
      },
      lang
    )
  }

  byGeographic(lat: string, lon: string, cnt: number, lang?: string) {
    return this.request(
      this.endpoint,
      {
        lat,
        lon,
        cnt,
      },
      lang
    )
  }

  byZipId(zip: string, cnt: number, { country, lang}:{ country?: string, lang?: string }) {
    return this.request(
      this.endpoint,
      {
        zip: `${zip}${country ? ',' + country : ''}`,
        cnt,
      },
      lang
    )
  }
}