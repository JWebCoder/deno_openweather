import { OpenWeather, serializableObject } from './mod.ts'

type hourlyWeatherResponse = {
  code: string,
  message: number,
  city: {
    id: number,
    name: string,
    coord: {
      lat: number,
      lon: number,
    },
  },
  country: string,
  population: number,
  timezone: number,
  sunrise: number,
  sunset: number,
  cnt: number
  list: {
    dt: number
    main: {
      temp: number,
      feels_like: number,
      temp_min: number,
      temp_max: number,
      pressure: number,
      sea_level: number,
      grnd_level: number,
      humidity: number,
      temp_kf: number,
    },
    weather: [
      {
        id: number,
        main: string,
        description: string,
        icon: string
      }
    ]
    clouds: {
      all: number,
    }
    wind: {
      speed: number,
      deg: number,
    },
    rain: {
      '1h': number,
    }
    snow: {
      '1h': number,
    }
    sys: {
      pod: 'd',
    }
    dt_txt: string,
  }[]
}

export class hourlyWrapper {
  private endpoint = '/forecast/hourly?'
  private requester: OpenWeather["request"]
  constructor(requester: OpenWeather["request"]) {
    this.requester = requester
  }

  private request(endpoint: string, obj: serializableObject, lang?: string) {
    return this.requester(endpoint, obj, lang) as Promise<hourlyWeatherResponse>
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
}