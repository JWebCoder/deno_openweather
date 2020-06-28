import { OpenWeather, serializableObject } from './mod.ts'

type climateWeatherResponse = {
  code: string,
  city: {
    id: number,
    name: string,
    coord: {
      lat: number,
      lon: number,
    }
    country: string,
  },
  message: number,
  list: {
    dt: number,
    humidity: number,
    pressure: number,
    temp: {
      average: number,
      average_max: number,
      average_min: number,
      record_max: number,
      record_min: number,
    }
    wind_speed: number,
  }[]
}

export class climateWrapper {
  private endpoint = '/climate/month?'
  private requester: OpenWeather["request"]
  constructor(requester: OpenWeather["request"]) {
    this.requester = requester
  }

  private request(endpoint: string, obj: serializableObject, lang?: string) {
    return this.requester(endpoint, obj, lang) as Promise<climateWeatherResponse>
  }

  byCityName(name: string, { state, country , lang }: { state?: string, country?: string, lang?: string }) {
    return this.request(
      this.endpoint,
      {
        q: `${name}${state ? ',' + state : ''}${country ? ',' + country : ''}`,
      },
      lang
    )
  }

  byCityId(id: number, lang?: string) {
    const isArray = Array.isArray(id)
    return this.request(
      isArray ? '/group?' : this.endpoint,
      {
        id: `${Array.isArray(id) ? id.join(',') : id}`,
      },
      lang
    )
  }

  byGeographic(lat: string, lon: string, lang?: string) {
    return this.request(
      this.endpoint,
      {
        lat,
        lon,
      },
      lang
    )
  }

  byZipId(zip: string, { country, lang}:{ country?: string, lang?: string }) {
    return this.request(
      this.endpoint,
      {
        zip: `${zip}${country ? ',' + country : ''}`,
      },
      lang
    )
  }
}