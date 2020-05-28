import { commonParams } from './config'
import aixos from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: '0',
    needNewCode: '0',
    format: 'json',
    g_tk: '5381'
  })

  return aixos
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
