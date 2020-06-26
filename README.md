# Deno WorldTides API Wrapper

This is a wrapper for the [WorldTides API](https://worldtides.info) to retrieve tidal data

## Usage

```ts
import { Worldtides } from 'https://deno.land/x/worldtides/mod.ts'

const worldtides = new Worldtides({
  key: 'you_api_key'
})

const result = await worldtides.request({
  lat: 33.768321,
  lon: -118.195617,
  stationDistance: 50,
  stations: true,
})

console.log(result)
```

## Possible request properties
  | key | value type |
  |--|--|
  | key | string |
  | heights | boolean |
  | extremes | boolean |
  | date | Date |
  | days | 1,2,3,4,5,6,7
  | datum | datumValues |
  | datums | boolean |
  | lat | number |
  | lon | number |
  | plot | plot, boolean
  | stationDistance | number |
  | stations | boolean |
  | start | number |
  | length | number |
  | step | number |

## Custom types

**plot**

| key | value type |
|--|--|
| width | number |
| height | number |
| fontSize | number |
| grid | 'none', 'course', 'fine' |
| color | string |
| background | string |

**datumValues**

- LAT
- MLLWS
- MLWS
- MHLWS
- MLLW
- MLW
- MHLW
- MLLWN
- MLWN
- MHLWN
- MTL
- MSL
- MLHWN
- MHWN
- MHHWN
- MLHW
- MHW
- MHHW
- MLHWS
- MHWS
- MHHWS
- HAT