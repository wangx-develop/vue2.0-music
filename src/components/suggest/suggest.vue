<template>
  <Scroll
    ref="suggest"
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    :beforeScroll="beforeScroll"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p
            class="text"
            v-html="getDisplayName(item)"
          ></p>
        </div>
      </li>
      <!-- <Loading v-show="hasMore" title=""></Loading> -->
    </ul>
    <div class="no-result-wrapper">
      <noResult
        v-show="!hasMore && !result.length"
        title="抱歉，暂无搜索结果"
      ></noResult>
    </div>
  </Scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '../../base/scroll/scroll'
import { search } from '../../api/search'
import { ERR_OK } from '../../api/config'
import { createSong } from '../../common/js/song'
import { getSongVkey } from '../../api/singer'
import Loading from '../../base/loading/loading'
import Singer from '../../common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import noResult from '../../base/base/no-result/no-result'

const TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    perpage: {
      type: String,
      default: '20'
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      tmp: [],
      beforeScroll: true
    }
  },
  methods: {
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, this.perpage).then((res) => {
        if (res.code === ERR_OK) {
          let ret = []
          ret = this._genResult(res.data, '1')

          this.result = this.result.concat(ret)

          this.checkMore(res.data)
        }
      })
    },
    search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      this.hasMore = true
      search(this.query, this.page, this.showSinger, this.perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data, '0')
          this.checkMore(res.data)
        }
      })
    },
    checkMore (data) {
      const song = data.song
      if (!song.list.length || song.curnum + song.curpage * this.perpage >= song.totalnum) {
        this.hasMore = false
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })

        this.$router.push({
          path: `/search/${singer.id}`
        })

        this.setSinger({ singer })
      } else {
        this.insertSong(item)
      }

      this.$emit('select')
    },
    listScroll () {
      this.$emit('listScroll')
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    _genResult (data, flag) {
      let ret = []

      if (flag === '0') {
        if (data.zhida && data.zhida.singerid) {
          ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        }
      }

      if (data.song) {
        this._normalizeSongs(data.song.list)
        this.tmp = this.tmp.concat(ret)
      }
    },
    _normalizeSongs (list) {
      list.forEach((musicData) => {
        getSongVkey(musicData.songmid).then((res) => {
          const vkey = res

          if (musicData.songmid && musicData.albummid) {
            this.tmp.push(createSong(musicData, vkey))
          }
        }, (err) => {
          console.log(err)
        })
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query (newQuery) {
      this.tmp = []
      this.search()
    },
    tmp (newValue) {
      this.result = newValue
    }
  },
  components: {
    Scroll,
    Loading,
    noResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.suggest {
  height 100%
  overflow hidden
  .suggest-list {
    padding 0 30px
    .suggest-item {
      display flex
      align-items center
      padding-bottom 20px
    }
    .icon {
      flex 0 0 30px
      width 30px
      [class^='icon-'] {
        font-size 14px
        color $color-text-d
      }
    }
    .name {
      flex 1
      font-size $font-size-medium
      color $color-text-d
      overflow hidden
      .text {
        no-wrap()
      }
    }
  }
  .no-result-wrapper {
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
  }
}
</style>
