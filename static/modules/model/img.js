// 定义img图片模型模块
define(function (require, exports, module) {

	// 获取页面的宽度
	var w = ($(".inner").width() - 6 * 3) / 2;

	// 定义模型类
	var ImgModel = Backbone.Model.extend({
		initialize: function () {
			// 当添加一个模型的时候，我们要处理并获取图片的在页面中的宽和高
			// 当添加一个模型时候，会触发add事件
			this.on('add', function (model) {
				// 为模型添加viewWidth和viewHeight属性
				// 计算viewHeight值 h  = H / W * w
				var h = model.get('height') / model.get('width') * w;
				// 为模型添加viewWidth和ViewHeight
				model.set({
					viewWidth: w,
					viewHeight: h
				})
			})
		}
	})

	// 将模型作为接口暴漏出来
	module.exports = ImgModel;
	// console.log(1111)


	// 测试数据
	// var col = Backbone.Collection.extend({
	// 	model: ImgModel
	// })

	// var c = new col();

	// c.add({
	// 	"title": "精彩建筑摄影作品",
	// 	"url": "img/01.jpg",
	// 	"width": 640,
	// 	"height": 400
	// })
	// console.log(c)
})