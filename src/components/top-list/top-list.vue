<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
      :rank="rank"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '../music-list/music-list'
import { getMusicList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import { mapGetters } from 'vuex'
import { createSong } from '../../common/js/song'
import { getSongVkey } from '../../api/singer'

export default {
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters(['topList'])
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push({
          path: '/rank'
        })
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
          console.log(this.songs)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
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

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active,
.slide-leave-active {
  transition all 0.3s ease
}
.slide-enter,
.slide-leave-to {
  transform translate3d(100%, 0, 0)
}
</style>
