$(function(){

	var params = urlParams();
	var timeSlice = params.speed || 200;
	var num = params.n || 3; 
	var _ = enqueue(timeSlice*1.5);

	generate(num);
	reset();

	$('#start-btn').on('click',function(){
		var n,A,B,C ;
		n = reset();
		A = $('#tower1');
		B = $('#tower2');
		C = $('#tower3');

		hanno(n, A, B, C);
	});

	$('#reset-btn').on('click',function(){
		reset();
	});

	function generate(n){

		var _plateArr = [];
		for (var i = 1 ; i <= n; i++) {
			var html = '<div class="plate plate-' + i + '">' + i + '</div>';
			_plateArr.push($(html));
		}
		$('#plate-collection').html(_plateArr);
	}

	function reset(){

		_.clearQueue();

		var $plateCollection = $('#plate-collection');
		var $plates = $plateCollection.find('.plate');

		$('#tower1').empty().html($plates.clone()).css('height',$('#tower1').height());
		$('#tower2').empty().css('height',$('#tower1').height());
		$('#tower3').empty().css('height',$('#tower1').height());

		return $plates.length;
	}

	function urlParams(){
		var dataArr = location.search.replace(/[?]/g,"").replace(/#.*$/g,"").split("&");
		var obj = {};
		dataArr.map(function(el,index){
			var k_v = el.split('=');
			obj[k_v[0]] = k_v[1];
		})
		return obj;
	}

	// 汉诺塔问题递归解法
	function hanno(n,A,B,C){

		if(n==0) return;

		// 把A（1 —— n-1）移到B
		hanno(n-1,A,C,B);
		
		// 把A（n）移到C
		_.action(move.bind(null,A,C));
		
		// 把B（1 —— n-1）移到C
		hanno(n-1,B,A,C);
	}

	function move($tower,$toTower) {
		var $plate = $tower.find('div.plate').eq(0);
		var start,end;
		
		log("move plate #"+ $plate.text() +" from "+ $plate.parent().data('tower') +" to "+ $toTower.data('tower') );	
		
		start = $plate.get(0).getBoundingClientRect();
		$plate.prependTo($toTower);
		end = $plate.get(0).getBoundingClientRect();

		_moveAnimation($plate, start, end, "rotateX(60deg)");
	}

	function log(msg,type){
		$('#console').append("<p class='log'>"+ (new Date().getTime()) + ' > '+ msg +"</p>").scrollTop(100000000);
	}

	// 将一个函数调用队列化
	function enqueue(delay){
		var _actionQueue = [];
		var _timer = null;

		function _doaction(){
			var _action = _actionQueue.shift();
			if(_action){
				_action();
			}else {
				clearInterval(_timer);
				_timer = null;
			}
		}

		return {
			action : function(fn){
				_actionQueue.push(fn);
				if(!_timer) {
					_doaction();
					_timer = setInterval(_doaction,delay);
				}
			},
			clearQueue : function(){
				clearInterval(_timer);
				_timer = null;
				_actionQueue = [];
			}
		}
	}

	// 为在在文档流中的位置变化的dom元素的添加动画
	function _moveAnimation($el,start,end,transbase){
		var reTrans = {
			"transform" : transbase + " translate("+ (start.left - end.left) + "px ," + (start.top - end.top) +"px )",
			"-webkit-transform": transbase + " translate("+ (start.left - end.left) + "px ," + (start.top - end.top) +"px )",
			"transition" : "none",
			"-webkit-transition" : "none",
		}
		var trans = {
			"transform" : transbase + " translate(0, 0)",
			"-webkit-transform" : transbase + " translate(0, 0)",
			"transition" : "transform " + timeSlice + "ms ease-in-out ",
			"-webkit-transition" : "transform " + timeSlice + "ms ease-in-out ",
		}
		
		$el.css(reTrans);
		setTimeout(function(){
			$el.css(trans);
		},16);
	}
	

})

