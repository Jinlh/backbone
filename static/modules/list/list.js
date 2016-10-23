// 列表页的视图模块文件
define(function (require, exports, module) {
	// 引入css文件
	require('modules/list/list.css')
	
	// 定义列表页视图
	var List = Backbone.View.extend({
		// 绑定事件
		events: {
			'click .search span': 'showSearchView',
			'click .nav .sort': 'showTypeView',
			'click .go-back': 'goTop',
			'click .ico_hea': 'showSearch'
		},
		// 格式化该模板我们需要的数据 {id: 10, url: 'img/01.jpg', style: "width: 100px; height: 200px;"}
		tpl: _.template('<a href="#layer/<%=id%>"><img src="<%=url%>" style="<%=style%>" alt="" /></a>'),
		// 左边容器高度
		leftHeight: 0,
		// 右边容器高度
		rightHeight: 0,
		initialize: function () {
			var me = this;
			// 要创建页面，初始化一些数据

			// 获取数据
			this.getData();

			// 获取图片容器元素
			this.initDom();

			// 监听集合add事件，每当添加一个集合模型对象，我们就要将该模型对象渲染到页面中
			// this.collection.on('add', function () {});
			this.listenTo(this.collection, 'add', function (model, collection) {
				// 通过render方法将model渲染到页面中
				this.render(model)
			});

			// 监听窗口滚动事件
			$(window).on('scroll', function () {
				// 获取body高度与窗口高度，窗口scrollTop高度，以及200的差值
				var h = $('body').height() - $(window).scrollTop() - $(window).height() - 200 < 0;
				// 当h是true，我们加载图片
				if (h) {
					me.getData();
				}
				// 当滚动条顶部距离大于300时候将返回顶部按钮显示
				if ($(window).scrollTop() > 300) {
					me.showGoBack()
				} else {
					me.hideGoBack()
				}
			})
		},
		showGoBack: function () {
			this.$el.find('.go-back').show()
		},
		// 影藏滚动态
		hideGoBack: function () {
			this.$el.find('.go-back').hide()
		},
		// 滚动到页面顶部
		goTop: function () {
			// 滚动顶部
			window.scrollTo(0, 0);
		},
		// 获取数据（将数据添加到集合中）
		getData: function () {
			this.collection.fetchData();
		},
		// 显隐搜索框
		showSearch: function () {
			if(this.$el.find('.search').hasClass('dis-n')) {
				this.$el.find('.search').removeClass('dis-n');
			} else {
				this.$el.find('.search').addClass('dis-n');
			}
			
		},
		// 初始化dom元素
		initDom: function () {
			// 获取两个图片容器元素
			this.leftContainer = this.$el.find('.left-container');
			this.rightContainer = this.$el.find('.right-container');
		},
		/**
		 * 将模型实例化对象的数据渲染到页面中
		 * @model 		模型实例化对象
		 */
		render: function (model) {
			// 获取数据
			var data = {
				id: model.get('id'),
				url: model.get('url'),
				style: 'width: ' + model.get('viewWidth') + 'px; height: ' + model.get('viewHeight') + 'px;'
			}
			// 获取模板方法
			var tpl = this.tpl;
			// 格式化字符串
			var html = tpl(data);
			// 将字符串渲染页面中
			// 如果左边容器高度不大于右边容器高度，此时要向左边添加，否则想右边添加
			if (this.leftHeight <= this.rightHeight) {
				this.renderLeft(model, html);
			} else {
				this.renderRight(model, html);
			}
		},
		/**
		 * 渲染左边容器
		 * @model 	模型实例化对象
		 * @html 	视图字符串
		 */ 
		renderLeft: function (model, html) {
			// 将字符串渲染左边容器内
			this.leftContainer.append(html);
			// 记录高度 6表示下边距的高度
			this.leftHeight += model.get('viewHeight') + 6;
		},
		/**
		 * 渲染右边容器
		 * @model 	模型实例化对象
		 * @html 	视图字符串
		 */
		renderRight: function (model, html) {
			// 将字符串渲染左边容器内
			this.rightContainer.append(html)
			// 记录高度 6表示下边距的高度
			this.rightHeight += model.get('viewHeight') + 6;
		},
		// 获取搜索框内的val值
		getSearchValue: function () {
			return this.$el.find('.search input').val()
		},
		/**
		 * 判断value值是否合法
		 * @return 	是一个boolean表示是否合法，true：合法，false不合法
		 */ 
		checkValue: function (value) {
			// 当结果只有空白符是不合法啊的
			if (/^\s*$/.test(value)) {
				alert('请输入搜索词');
				return false
			}
			return true;
		},
		/**
		 * 根据value值过滤集合
		 * @value 		过滤字符串
		 * @return 		数组
		 */ 
		collectionFilterByKey: function (value, key) {
			var myKey = key || 'title'
			var result = this.collection.filter(function (model) {
				if (myKey === 'type') {
					return model.get(myKey) == value;
				}
				// 返回过滤条件
				return model.get(myKey).indexOf(value) > -1;
			})
			// 将结果返回
			return result;
		},
		/**
		 * 更新视图
		 * @arr 	模型实例化数组
		 */
		resetView: function (arr) {
			var me = this;
			// 清空视图
			this.clearView();
			// 更新视图了，
			arr.forEach(function (model) {
				// 渲染每一个模型实例化对象
				me.render(model)
			})
		},
		/**
		 * 清空原视图
		 **/
		clearView: function () {
			// 清空左视图内容，右视图内容，左容器高度，右容器高度
			this.leftContainer.html('');
			this.rightContainer.html('');
			this.leftHeight = 0;
			this.rightHeight = 0;
		},
		/**
		 * 根据搜索内容渲染页面
		 */
		showSearchView: function () {
			// 获取input的value值
			var value = this.getSearchValue();
			// 判断value值是否合法
			if (!this.checkValue(value)) {
				return ;
			};
			// 过滤字符的首位空白符
			value = value.replace(/^\s+|\s+$/g, '')
			// 根据value值进行集合过滤
			var result = this.collectionFilterByKey(value);
			// 根据result结果重新渲染视图
			this.resetView(result);
		},
		// 获取元素中的data-id属性
		getDomId: function (dom) {
			// return dom.data('id');
			return $(dom).attr('data-id')
		},
		/**
		 * 获取元素id并重新渲染视图
		 */
		showTypeView: function (e) {
			// 获取元素id
			var id = this.getDomId(e.target);
			// 通过id获取模型中的实例化对象
			var result = this.collectionFilterByKey(id, 'type')
			// 根据result渲染视图
			this.resetView(result)
			// console.log(result)
		}

	})

	module.exports = List;

})