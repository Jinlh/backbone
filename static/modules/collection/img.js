// 定义集合模块
define(function (require, exports, module) {
	// 集合模块依赖模型，因此要将模型引入进来
	var ImgModel = require('modules/model/img')

	// 定义集合类
	var ImgCollection = Backbone.Collection.extend({
		model: ImgModel,
		// 表示为图片添加的id
		imgId: 1,
		// 现在的需求是要在将data目录下的接口数据请求下来
		/**
		 * 为集合异步请求数据
		 * @fn 		表示请求成功回调函数
		 */
		fetchData: function (fn) {
			var me = this;
			// 发送异步请求
			$.get('data/imageList.json', function (res) {
				// console.log(res)
				if (res && res.errno === 0) {
					// res。data做乱序处理
					res.data.sort(function () {
						return Math.random() > .5 ? 1 : -1;
					})
					// 图片需要根据id进行大图页展示，因此我们要为每个成员添加一个id
					// 遍历data，为每个成员添加id属性
					res.data.map(function (obj) {
						// 为每一个成员添加一个id，并将存储的id加一
						obj.id = me.imgId++;
					})

					// 将res的data属性添加到集合中
					me.add(res.data);
					// console.log(me)
				}
				
			})
		}
	})

	// var ic = new ImgCollection();
	// ic.add({
	// 	"title": "摄影作品鉴赏",
	// 	"url": "img/02.jpg",
	// 	"width": 954,
	// 	"height": 722
	// })
	// console.log(ic)
	// ic.fetchData()

	// 将collection作为接口返回
	module.exports = ImgCollection;
})