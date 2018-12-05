module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
    }
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
      scrollPage: 0
    }],
    // iphoneX不能滚动的bug
    isScroll: true
  },
  attached: function attached() {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function success(res) {
        var clientHeight = res.windowHeight;

        var clientWidth = res.windowWidth;

        var rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 99;
        that.pxPerRpx = res.windowWidth / 750;
        that.setData({
          winHeight: calc
        });
      }
    });
  },


  methods: {
    // 打开二级面板
    showPanel: function showPanel() {
      this.setData({
        isScroll: !this.data.isScroll,
        isShowPanel: !this.data.isShowPanel
      });
    },


    // 隐藏二级面板
    hidePanel: function hidePanel() {
      this.setData({
        isShowPanel: false,
        isScroll: true
      });
    },


    // 水平切换页面的时候，切换一级分类的tab
    switchTab: function switchTab(e) {
      this.setData({
        firstTabIndex: e.detail.current
      });

      var isReload = this.judgeReload(e.detail.current, this.data.secondTabIndex);
      this.fetchData(e.detail.current, this.data.secondTabIndex, 0, isReload);
      this.checkTabPos();
    },


    // 点击顶部的一级分类
    clickNav: function clickNav(e) {
      var cur = e.target.dataset.current;
      if (this.data.firstTabIndex === cur) {
        return false;
      } else {
        this.hidePanel();
        this.setData({
          firstTabIndex: cur
        });
        this.checkTabPos();
      }
      return true;
    },


    // 点击隐藏折叠面板的一级分类tab
    clickPanelFirstTab: function clickPanelFirstTab(e) {
      var cur = e.target.dataset.current;
      if (this.data.firstTabIndex === cur) {
        return false;
      } else {
        this.setData({
          firstTabIndex: cur
        });
      }
      return true;
    },


    // 点击隐藏折叠面板的二级分类tab
    clickPanelSecondTab: function clickPanelSecondTab(e) {
      var cur = e.target.dataset.current;
      if (this.data.secondTabIndex === cur) {
        return false;
      } else {
        this.setData({
          secondTabIndex: cur
        });
        var isReload = this.judgeReload(this.data.firstTabIndex, cur);
        this.fetchData(this.data.firstTabIndex, cur, 0, isReload);
      }
      return true;
    },


    // 检查tab滚动的位置，使active的tab处于中间.160为最大的宽度
    checkTabPos: function checkTabPos() {
      var left = (this.data.firstTabIndex + 1) % 3;
      var cycle = Math.floor((this.data.firstTabIndex + 1) / 3);
      var distance = 160 * left;
      if (cycle > 0) {
        distance = 160 * (left + (cycle - 1) * 3);
      }
      if (cycle > 0) {
        this.setData({
          scrollLeft: distance * this.pxPerRpx
        });
      } else {
        this.setData({
          scrollLeft: 0
        });
      }
    },


    /**
    * 记录页面的状态，方便判断是否需要重载
    * @param {number} firstTabIndex 一级分类tab的index，同时也是当前页面的index
    * @param {number} secondTabIndex 二级分类tab的index
    * @param {number} scrollPage 当前滚动加载的页数
    */
    changePageStateList: function changePageStateList(firstTabIndex, secondTabIndex, scrollPage) {
      var obj = {
        firstTabIndex: firstTabIndex,
        secondTabIndex: secondTabIndex,
        firstTabObj: this.data.firstTab[firstTabIndex],
        secondTabObj: this.data.secondTab[secondTabIndex],
        scrollPage: scrollPage
      };
      var pageIndex = firstTabIndex;
      this.data.pageStateList[pageIndex] = obj;
    },


    /**
    * 与存储pageStateList的旧数据比较，判断是否需要重新加载数据
    * @param {number} newFirstTabIndex 当前页面最新的一级分类tab的index
    * @param {number} newSecondTabIndex 当前页面最新的二级分类的tab的index
    * @return {boolean} 是否需要重新获取数据
    */
    judgeReload: function judgeReload(newFirstTabIndex, newSecondTabIndex) {
      // 第一次获取数据必须加载
      if (!this.data.pageStateList[newFirstTabIndex]) {
        return true;
      }
      // 只有一级分类或者只有二级分类，只用加载第一次，不用判断重载
      if (!this.data.firstTab || !this.data.secondTab) {
        return false;
      }
      var pageIndex = newFirstTabIndex;
      var tabData = this.data.pageStateList[pageIndex];
      var oldFirstTabIndex = tabData.firstTabIndex;
      var oldSecondTabIndex = tabData.secondTabIndex;

      if (oldFirstTabIndex !== newFirstTabIndex || oldSecondTabIndex !== newSecondTabIndex) {
        return true;
      } else {
        return false;
      }
    },


    // 滚动到底部
    scrollToBottom: function scrollToBottom() {
      var tabState = this.data.pageStateList[this.data.firstTabIndex];
      var nextPage = tabState.scrollPage + 1;
      this.fetchData(this.data.firstTabIndex, this.data.secondTabIndex, nextPage, false);
    },


    /**
    * 触发事件，获取数据
    * @param {number} firstTabIndex 一级分类tab的index
    * @param {number} secondTabIndex 二级分类tab的index
    * @param {number} scrollPage 当前滚动加载的页数
    * @param {boolean} isReload 是否需要重新获取数据
    */
    fetchData: function fetchData(firstTabIndex, secondTabIndex, scrollPage, isReload) {
      if (this.data.firstTab && this.data.secondTab) {
        // 同时有一级分类和二级分类
        var firstTabObj = this.data.firstTab[firstTabIndex];
        var secondTabObj = this.data.secondTab[secondTabIndex];
        this.triggerEvent('switchEvent', {
          firstTabIndex: firstTabIndex,
          secondTabIndex: secondTabIndex,
          firstTabObj: firstTabObj,
          secondTabObj: secondTabObj,
          scrollPage: scrollPage,
          isReLoad: isReload
        });
      } else if (this.data.firstTab && !this.data.secondTab) {
        // 只有一级分类
        var _firstTabObj = this.data.firstTab[firstTabIndex];
        this.triggerEvent('switchEvent', {
          firstTabIndex: firstTabIndex,
          secondTabIndex: secondTabIndex,
          firstTabObj: _firstTabObj,
          secondTabObj: null,
          scrollPage: scrollPage,
          isReLoad: isReload
        });
      }
    }
  }
});

/***/ })
/******/ ]);