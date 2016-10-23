// 作为入口文件
define(function (require, exports, module) {

	// 获取图片模型集合
	var ImgCollection =  require('modules/collection/img')

	// 引入进来两个视图
	var List = require('modules/list/list');
	var Layer = require('modules/layer/layer');

	// 实例化图片集合类
	var imgCollection = new ImgCollection();

	// 实例化两个视图类
	var list = new List({
		el: $('#app'),
		collection: imgCollection
	});
	var layer = new Layer({
		el: $('#app'),
		// 当我们进入大图页时候，要根据hash的id获取对应模型实例化对象，因此要添加集合实例化对象，在这个集合实例化对象中寻找模型实例化对象
		collection: imgCollection
	})
	
	// 定义路由
	var Router = Backbone.Router.extend({
		routes: {
			'layer/:id': 'showLayer',
			'*other': 'showList'
		},
		showLayer: function (id) {
			// 隐藏列表页显示大图页
			$("#app .list").hide()
			$('#app .layer').show()
			layer.render(id)
		},
		showList: function () {
			// 展示列表页
			// list.render()
			// 隐藏大图页，展示列表页
			$('#app .list').show();
			$('#app .layer').hide();
		}
	})

	// 实例化视图
	var router = new Router();

	// 将启动的业务逻辑放在接口中，这样在外部引入这个模块的时候可以控制项目是否启动
	module.exports = function () {
		// 启动路由
		Backbone.history.start();
	}
})