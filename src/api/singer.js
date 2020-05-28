import jsonp from '../common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}

// 获取歌曲的vkey
export function getSongVkey(songmid) {
  const url = '/api/getMusicVkey'

  let data1 = {
    comm: {
      ct: 24,
      cv: 0,
      format: 'json',
      uin: 491256781
    },
    req: {
      method: 'GetCdnDispatch',
      module: 'CDN.SrfCdnDispatchServer',
      param: {
        calltype: 0,
        guid: '8092576475',
        userip: ''
      }
    },
    req_0: {
      method: 'CgiGetVkey',
      module: 'vkey.GetVkeyServer',
      param: {
        guid: '8092576475',
        loginflag: 1,
        platform: '20',
        songtype: [0],
        uin: '491256781',
        songmid: []
      }
    }
  }
  data1.req_0.param.songmid.push(songmid)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: data1
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data.req_0.data.midurlinfo[0].purl)
    })
}
