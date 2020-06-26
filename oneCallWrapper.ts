import { OpenWeather, serializableObject } from './mod.ts'

type exclude = Array<'current' | 'minutely' | 'hourly' | 'daily'>

type oneCallWeatherResponse = {
  lat: number,
  lon: number,
  timezone: string,
  timezone_offset: number,

  current: {
    dt: number,
    sunrise: number,
    sunset: number,
    temp: number,
    feels_like: number,
    pressure: number,
    humidity: number,
    dew_point: number,
    clouds: number,
    uvi: number,
    visibility: number,
    wind_speed: number,
    wind_gust: number,
    wind_deg: number,
    rain: {
      '1h': number,
    },
    snow: {
      '1h': number,
    },
    weather: {
      id: number,
      main: number,
      description: string,
      icon: number,
    }
  },

  minutely: {
    dt: number,
    precipitation: number,
  }[],

  hourly: {
    dt: number,
    temp: number,
    feels_like: number,
    pressure: number,
    humidity: number,
    dew_point: number,
    clouds: number,
    visibility: number,
    wind_speed: number,
    wind_gust: number,
    wind_deg: number,
    rain: {
      '1h': number,
    },
    snow: {
      '1h': number,
    },
    weather: {
      id: number,
      main: string,
      description: string,
      icon: string,
    }
  }[]

  daily: {
    dt: number,
    sunrise: number,
    sunset: number,
    temp: {
      morn: number,
      day: number,
      eve: number,
      night: number,
      min: number,
      max: number,
    }
    feels_like: {
      morn: number,
      day: number,
      eve: number,
      night: number,
    }
    pressure: number,
    humidity: number,
    dew_point: number,
    wind_speed: number,
    wind_gust: number,
    wind_deg: number,
    clouds: number,
    uvi: number,
    visibility: number,
    rain: number,
    snow: number,
    weather: {
      id: number,
      main: string,
      description: string,
      icon: string,
    }
  }[]
}

export class oneCallWrapper {
  private endpoint = '/onecall?'
  private requester: OpenWeather["request"]
  constructor(requester: OpenWeather["request"]) {
    this.requester = requester
  }

  private request(endpoint: string, obj: serializableObject, lang?: string) {
    return this.requester(endpoint, obj, lang) as Promise<oneCallWeatherResponse>
  }

  current(lat: string, lon: string, { exclude , lang }: { exclude?: exclude, lang?: string }) {
    return this.request(
      this.endpoint,
      {
        lat,
        lon,
        exclude: Array.isArray(exclude) ? exclude.join(',') : undefined
      },
      lang
    )
  }

  historycal(lat: string, lon: string, dt: number, lang?: string) {
    return this.request(
      this.endpoint,
      {
        lat,
        lon,
        dt,
      },
      lang
    )
  }
}