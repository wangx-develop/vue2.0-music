<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bg-image="bgImage"
      :songs="songs"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '../music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from '../../api/recommend'
import { ERR_OK } from '../../api/config'
import { getSongVkey } from '../../api/singer'
import { createSong } from '../../common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },

    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  components: {
    MusicList
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(musicData => {
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
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active,
.slide-leave-active {
  transition all 0.3s
}
.slide-enter,
.slide-leave-to {
  transform translate3d(100%, 0, 0)
}
</style>
