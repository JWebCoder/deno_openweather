import { OpenWeather } from './mod.ts'
import {
  assert,
} from "https://deno.land/std@v0.57.0/testing/asserts.ts"
const { test, env } = Deno

const apikey = env.get('apikey')
if (!apikey) {
  throw new Error('missing api key')
}

const openWeather = new OpenWeather(apikey)

test("Get a list of stations in a 50km radius", async () => {
  const result = await openWeather.current.byCityId(420006353)
  assert(result)
})
