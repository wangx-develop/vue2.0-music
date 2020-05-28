<template>
  <MusicList
    :songs="songs"
    :title="title"
    :bgImage="bgImage"
  ></MusicList>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail, getSongVkey } from '../../api/singer'
import { ERR_OK } from '../../api/config'
import { createSong } from '../../common/js/song'
import MusicList from '../music-list/music-list'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title: function () {
      return this.singer.name
    },
    bgImage: function () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item

        getSongVkey(musicData.songmid).then((res) => {
          const vkey = res
          if (musicData.songmid && musicData.albummid) {
            ret.push(createSong(musicData, vkey))
          }
        }, (err) => {
          console.log(err)
        })
      })

      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
