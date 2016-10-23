// 大图页的视图模块文件
define(function (require, exports, module) {

	// 引入大图页的样式
	require('modules/layer/layer.css')

	var h = $(window).height();
	console.log($('.layer .arrow-btn'))
	// 定义大图页的视图
	var Layer = Backbone.View.extend({
		// 保存图片的id
		imageId: 0,
		imageList: [],
		tpl: _.template($('#tpl_layer').text()),
		// 添加事件
		events: {
			'swipeLeft .layer-container img': "showNextImage",
			'swipeRight .layer-container img': 'showPreImage',
			// 'tap .layer-container img': 'toggleHeader',
			// 'tap .layer .arrow-btn': 'goBack'
			'click .arrow-container span': 'goBackNew'
		},
		// 返回列表页
		// goBack: function () {
		// 	location.hash = '#';
		// 	// this.$el.find('.layer').hide();
		// 	// this.$el.find('.list').show();
		// },
		/**
		 * 点击返回按钮，如果上一次浏览的图片存在则显示该图片，否则进入列表页
		 */
		goBackNew: function () {
			// imageList中最后一个成员表示当前的 图片id，因此将其删除，显示钱一张
			console.log(111);
			this.imageList.pop();
			// 获取要显示的图片id
			var id = this.imageList[this.imageList.length - 1];
			// 判断id是否存在，如果存在，显示该图片，不存在说明是进入时候的图片，因此要进入列表页
			// 屏蔽id是0的时候，出错
			if (id !== undefined) {
				// 获取id对应的模型
				var model = this.collection.get(id);
				// 将该模型显示出来
				this.changeView(model);
			} else {
				location.hash = '#'
			}
		},
		// 点击图片的时候，如果标题显示则将它隐藏，如果表示隐藏则将它显示
		toggleHeader: function () {
			this.$el.find('.layer .header').toggleClass('hide')
		},
		/**
		 * 向右划显示上一张图片
		 */
		showPreImage: function () {
			// 显示上一张图片，要做减操作
			this.imageId--;
			// 根据id获取模型
			var model = this.collection.get(this.imageId);
			// 判断模型是否存在，存在则渲染
			if (model) {
				this.changeView(model)
				this.imageList.push(model.get('id'))
			} else {
				alert('已经是第一张图片了');
				// 此时重置图片id
				this.imageId++;
			}
		},
		/**
		 * 修改视图的
		 * @model 	模型实例化对象
		 */
		changeView: function (model) {
			// 修改图片的src
			var url = model.get('url')
			this.$el.find('.layer-container img').attr('src', url)
			// 修改title
			var title = model.get('title')
			this.$el.find('.layer .header h1').html(title)
		},
		/**
		 * 向左划显示下一张图片
		 */
		showNextImage: function () {
			// 显示下一张图片，因此要做加操作
			this.imageId++;
			// 根据id获取模型
			var model = this.collection.get(this.imageId);
			// 判断model是否存在，存在要渲染
			if (model) {
				this.changeView(model)
				this.imageList.push(model.get('id'))
			} else {
				// 已经是最后一张图片 ，因此要提示并imageId减回来
				alert('已经是最后一张图片');
				this.imageId--;
			}
		},
		render: function (id) {
			// 根据模型的id获取模型
			// this.$el.html('show layer')
			// console.log()
			// 获取数据
			var data = this.collection.get(id);
			if (!data) {
				// alert('请进入列表页')
				// 手动进入列表页
				location.hash = '#';
				return ;
			}
			// 将图片的id保存下来
			this.imageId = data.get('id');
			// 将图片id存储起来
			this.imageList.push(this.imageId)
			// 处理data
			var dealData = {
				url: data.get('url'),
				title: data.get('title'),
				// 添加line-height 让图片垂直居中
				style: 'line-height: ' + h + 'px'
			}
			// 获取模板
			var tpl = this.tpl;
			// 格式化模板
			var html = tpl(dealData)
			// 渲染到页面中
			this.$el.find('.layer').html(html)
		}
	})

	module.exports = Layer;
})