
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		firstTab: [
			{
				id: 0,
				name: '全部'
			},
			{
				id: 1,
				name: '720°全景'
			},
			{
				id: 2,
				name: '快闪'
			},
			{
				id: 3,
				name: '一镜到底'
			},
			{
				id: 4,
				name: '画中画'
			},
			{
				id: 5,
				name: '微信对话'
			},
			{
				id: 6,
				name: '微信群聊'
			},
			{
				id: 7,
				name: '朋友圈'
			},
			{
				id: 8,
				name: '摇一摇'
			},
			{
				id: 9,
				name: '雷达扫描'
			},
			{
				id: 10,
				name: '锁屏通知'
			},
		],
		secondTab: [{
			id: 0,
			name: '全部'
		}, {
			id: 1,
			name: '免费'
		}, {
			id: 2,
			name: '付费'
		}],
		contentList: [],
		loadingList: [],
		noMoreList: []
	},

	onLoad: function () {
		this.initLoadingList();
		this.getContentList();
	},

	getContentList: function (e) {
		// e ? console.log(e.detail) : '';        
		let firstTabIndex = e ? e.detail.firstTabIndex : 0;
		let secondTabIndex = e ? e.detail.secondTabIndex : 0;
		let firstTabObj = e ? e.detail.firstTabObj : {};
		let secondTabObj = e ? e.detail.secondTabObj : {};
		let scrollPage = e ? e.detail.scrollPage : 0;
		let isReLoad = e ? e.detail.isReLoad : true;
		let currentPage = this.selectComponent('#scroll-tab-view');
		let pageIndex = firstTabIndex;
		let that = this;
		this.setData({
			[`loadingList[${pageIndex}]`]: true
		});
		// 重新加载
		if (isReLoad) {
			this.setData({
				[`contentList[${pageIndex}]`]: [],
			});
		}

		// 如果页面【已经到底了】，则不再加载
		if (this.data.noMoreList[pageIndex] && !isReLoad) {
			return
		}

		console.log(`第${firstTabIndex}个页面，获取一级分类${firstTabIndex}，二级分类${secondTabIndex}的当前页面第${scrollPage}页数据`);

		// 获取数据
		setTimeout(function () {
			let temData = {
				[`loadingList[${pageIndex}]`]: 0,
				[`noMoreList[${pageIndex}]`]: Math.random() < 0.5,
			};
			let res = [{
				name: 'hello world'
			}, {
				name: 'hello wechat'
			}, {
				name: 'hello faisco'
			}, {
				name: 'hello fuhua'
			}, {
				name: 'hello wcd'
			}, {
				name: 'hello everyone'
			}];
			let length = that.data.contentList[pageIndex] ? that.data.contentList[pageIndex].length : 0;
			res.forEach(function (element, index) {
				temData[`contentList[${pageIndex}][${length + index}]`] = element
			});
			// 记录组件的页面状态
			currentPage.changePageStateList(firstTabIndex, secondTabIndex, scrollPage);
			// 请求失败的话，可以记录组件的状态为负数，下次进入的时候isReLoad会被设为true
			// currentPage.changePageStateList(-100, -100, 100);
			that.setData(temData);
		}, 500);


	},

	initLoadingList: function () {
		let arr = [];
		this.data.firstTab.forEach(function () {
			arr.push(0);
		});
		this.data.loadingList = arr.slice();
		this.data.noMoreList = arr.slice();
	}

})