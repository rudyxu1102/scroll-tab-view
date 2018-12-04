// components/scrollTabView/scrollTabView.js

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {
    firstTab: {
      type: Array
    },
    firstTabTitle: {
      type: String
    },
    secondTab: {
      type: Array
    },
    secondTabTitle: {
      type: String
    },
  },

  data: {
    // 窗口高度
    winHeight: '',
    // 一级分类的当前tab的index
    firstTabIndex: 0,
    // 二级分类的当前tab的index
    secondTabIndex: 0,
    // 一级tab标题的滚动条位置
    scrollLeft: 0,
    // 显示二级面板
    isShowPanel: false,
    // 记录每个页面的状态。
    pageStateList: [{
      // 某一页面的一级分类tab的index
      firstTabIndex: 0,
      // 某一页面的二级分类tab的index
      secondTabIndex: 0,
      // 某一页面的一级分类tab的当前状态，为firstTab数组的元素
      firstTabObj: {},
      // 某一页面的二级分类tab的当前状态，为secondTab数组的元素
      secondTabObj: {},
      // 当前页面的处于滚动的加载的页数（从0开始）
      scrollPage: 0,
    }],
    // iphoneX不能滚动的bug
    isScroll: true
  },
  attached() {
    const that = this
    //  高度自适应
    wx.getSystemInfo({
      success(res) {
        const clientHeight = res.windowHeight


        const clientWidth = res.windowWidth


        const rpxR = 750 / clientWidth
        const calc = clientHeight * rpxR - 99
        that.pxPerRpx = res.windowWidth / 750
        that.setData({
          winHeight: calc
        })
      }
    })
  },

  methods: {
    // 打开二级面板
    showPanel() {
      this.setData({
        isScroll: !this.data.isScroll,
        isShowPanel: !this.data.isShowPanel
      })
    },

    // 隐藏二级面板
    hidePanel() {
      this.setData({
        isShowPanel: false,
        isScroll: true
      })
    },

    // 水平切换页面的时候，切换一级分类的tab
    switchTab(e) {
      this.setData({
        firstTabIndex: e.detail.current
      })

      const isReload = this.judgeReload(e.detail.current, this.data.secondTabIndex)
      this.fetchData(e.detail.current, this.data.secondTabIndex, 0, isReload)
      this.checkTabPos()
    },

    // 点击顶部的一级分类
    clickNav(e) {
      const cur = e.target.dataset.current
      if (this.data.firstTabIndex === cur) {
        return false
      } else {
        this.hidePanel()
        this.setData({
          firstTabIndex: cur
        })
        this.checkTabPos()
      }
      return true
    },

    // 点击隐藏折叠面板的一级分类tab
    clickPanelFirstTab(e) {
      const cur = e.target.dataset.current
      if (this.data.firstTabIndex === cur) {
        return false
      } else {
        this.setData({
          firstTabIndex: cur
        })
      }
      return true
    },

    // 点击隐藏折叠面板的二级分类tab
    clickPanelSecondTab(e) {
      const cur = e.target.dataset.current
      if (this.data.secondTabIndex === cur) {
        return false
      } else {
        this.setData({
          secondTabIndex: cur
        })
        const isReload = this.judgeReload(this.data.firstTabIndex, cur)
        this.fetchData(this.data.firstTabIndex, cur, 0, isReload)
      }
      return true
    },

    // 检查tab滚动的位置，使active的tab处于中间.160为最大的宽度
    checkTabPos() {
      const left = (this.data.firstTabIndex + 1) % 3
      const cycle = Math.floor((this.data.firstTabIndex + 1) / 3)
      let distance = 160 * left
      if (cycle > 0) {
        distance = 160 * (left + ((cycle - 1) * 3))
      }
      if (cycle > 0) {
        this.setData({
          scrollLeft: distance * this.pxPerRpx
        })
      } else {
        this.setData({
          scrollLeft: 0
        })
      }
    },

    /**
		* 记录页面的状态，方便判断是否需要重载
		* @param {number} firstTabIndex 一级分类tab的index，同时也是当前页面的index
		* @param {number} secondTabIndex 二级分类tab的index
		* @param {number} scrollPage 当前滚动加载的页数
		*/
    changePageStateList(firstTabIndex, secondTabIndex, scrollPage) {
      const obj = {
        firstTabIndex,
        secondTabIndex,
        firstTabObj: this.data.firstTab[firstTabIndex],
        secondTabObj: this.data.secondTab[secondTabIndex],
        scrollPage
      }
      const pageIndex = firstTabIndex
      this.data.pageStateList[pageIndex] = obj
    },

    /**
		* 与存储pageStateList的旧数据比较，判断是否需要重新加载数据
		* @param {number} newFirstTabIndex 当前页面最新的一级分类tab的index
		* @param {number} newSecondTabIndex 当前页面最新的二级分类的tab的index
		* @return {boolean} 是否需要重新获取数据
		*/
    judgeReload(newFirstTabIndex, newSecondTabIndex) {
      // 第一次获取数据必须加载
      if (!this.data.pageStateList[newFirstTabIndex]) {
        return true
      }
      // 只有一级分类或者只有二级分类，只用加载第一次，不用判断重载
      if (!this.data.firstTab || !this.data.secondTab) {
        return false
      }
      const pageIndex = newFirstTabIndex
      const tabData = this.data.pageStateList[pageIndex]
      const oldFirstTabIndex = tabData.firstTabIndex
      const oldSecondTabIndex = tabData.secondTabIndex

      if (oldFirstTabIndex !== newFirstTabIndex || oldSecondTabIndex !== newSecondTabIndex) {
        return true
      } else {
        return false
      }
    },

    // 滚动到底部
    scrollToBottom() {
      const tabState = this.data.pageStateList[this.data.firstTabIndex]
      const nextPage = tabState.scrollPage + 1
      this.fetchData(this.data.firstTabIndex, this.data.secondTabIndex, nextPage, false)
    },

    /**
		* 触发事件，获取数据
		* @param {number} firstTabIndex 一级分类tab的index
		* @param {number} secondTabIndex 二级分类tab的index
		* @param {number} scrollPage 当前滚动加载的页数
		* @param {boolean} isReload 是否需要重新获取数据
		*/
    fetchData(firstTabIndex, secondTabIndex, scrollPage, isReload) {
      if (this.data.firstTab && this.data.secondTab) { // 同时有一级分类和二级分类
        const firstTabObj = this.data.firstTab[firstTabIndex]
        const secondTabObj = this.data.secondTab[secondTabIndex]
        this.triggerEvent('switchEvent', {
          firstTabIndex,
          secondTabIndex,
          firstTabObj,
          secondTabObj,
          scrollPage,
          isReLoad: isReload
        })
      } else if (this.data.firstTab && !this.data.secondTab) { // 只有一级分类
        const firstTabObj = this.data.firstTab[firstTabIndex]
        this.triggerEvent('switchEvent', {
          firstTabIndex,
          secondTabIndex,
          firstTabObj,
          secondTabObj: null,
          scrollPage,
          isReLoad: isReload
        })
      }
    }
  }
})
