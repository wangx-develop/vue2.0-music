<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox
        @query="onQueryChange"
        ref="searchBox"
      ></SearchBox>
    </div>
    <div
      ref="shortcutWrapper"
      class="shortcut-wrapper"
      v-show="!query"
    >
      <Scroll
        :refreshDelay="refreshDelay"
        ref="shortcut"
        class="shortcut"
        :data="shortcut"
      >
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.k)"
                class="item"
                v-for="(item, index) in hotkey"
                :key="index"
              >
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div
            class="search-history"
            v-show="searchHistory.length"
          >
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span
                class="clear"
                @click="showConfirm"
              >
                <i class="icon-clear"></i>
              </span>
            </h1>
            <searchList
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteOne"
            ></searchList>
          </div>
        </div>
      </Scroll>
    </div>
    <div
      ref="searchResult"
      class="search-result"
      v-show="query"
    >
      <Suggest
        ref="suggest"
        :query="query"
        @listScroll="blurInput"
        @select="saveSearch"
      ></Suggest>
    </div>
    <confirm
      text="是否清空所有搜索历史"
      confirmBtnText="清空"
      ref="confirm"
      @confirm="clearSearchHistory()"
    ></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '../../base/base/search-box/search-box'
import { getHotKey } from '../../api/search'
import { ERR_OK } from '../../api/config'
import Suggest from '../suggest/suggest'
import { mapActions } from 'vuex'
import searchList from '../../base/base/search-list/search-list'
import confirm from '../../base/base/confirm/confirm'
import Scroll from '../../base/scroll/scroll'
import { playlistMixin, searchMixin } from '../../common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  data () {
    return {
      hotkey: []

    }
  },
  created () {
    this._getHotKey()
  },
  computed: {
    shortcut () {
      return this.hotkey.concat(this.searchHistory)
    }
    // ...mapGetters(['searchHistory'])
  },
  methods: {
    _getHotKey () {
      getHotKey().then(res => {
        this.hotkey = res.data.hotkey.slice(0, 10)
      })
    },

    deleteOne (item) {
      this.deleteSearchHistory(item)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },

    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    searchList,
    confirm,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.search {
  .search-box-wrapper {
    margin 20px
  }
  .shortcut-wrapper {
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut {
      height 100%
      overflow hidden
      .hot-key {
        margin 0 20px 20px 20px
        .title {
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        }
        .item {
          display inline-block
          padding 5px 10px
          margin 0 20px 10px 0
          border-radius 6px
          background $color-highlight-background
          font-size $font-size-medium
          color $color-text-d
        }
      }
      .search-history {
        position relative
        margin 0 20px
        .title {
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-l
          .text {
            flex 1
          }
          .clear {
            extend-click()
            .icon-clear {
              font-size $font-size-medium
              color $color-text-d
            }
          }
        }
      }
    }
  }
  .search-result {
    position fixed
    width 100%
    top 178px
    bottom 0
  }
}
</style>
