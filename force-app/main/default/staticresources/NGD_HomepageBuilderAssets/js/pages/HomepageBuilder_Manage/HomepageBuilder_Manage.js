//$(window).load(function() {
//    angular.element(document.getElementsByClassName('grid-stack')).scope().processGridContent($(".grid-stack-item"));
//});


// var savedGridData;
//
// window.onbeforeunload = confirmExit;
// function confirmExit(){
// 	var currentGridData = JSON.stringify(getGridData());
// 	if(currentGridData!=savedGridData)
// 	return "Are you sure?<br/>Unsaved layout change will be lost";
// }





// function getGridData(){
// 	var serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function(el) {
// 		el = $(el);
// 		var node = el.data('_gridstack_node');
// 		var content=node.el.find('.widget-content').html();//widget content
// 		var number;
// 		if(content){
// 			var preview =node.el.find('.widget-preview').text();
// 			number =node.el.find('.widget-number').text();
// 			return {
// 					x: node.x,
// 					y: node.y,
// 					width: node.width,
// 					height: node.height,
// 					number : number,
// 					preview: preview,
// 					content: content
// 			};
// 		}
// 		else{
// 			number =node.el.find('.widget-number').text();
// 			return {
// 				x: node.x,
// 				y: node.y,
// 				width: node.width,
// 				height: node.height,
// 				number : number
// 			};
// 		}
// 	}, this);
// 	return serialized_data;
// }

function registerMouseEvent() {
/*
    setTimeout(function() {
        $(".ui-draggable-handle").mouseover(function(e) {
            $(e.currentTarget).css({
                "background-color": "#00396b",
                "color": "white"
            });

			$(e.currentTarget).find("a").css({
                "color": "white"
            });

        });

        $(".ui-draggable-handle").mouseleave(function(e) {
            $(e.currentTarget).css({
                "background-color": "#EEF1F6",
                //"color": "#16325C"
				"color": "#333"
            });

			 $(e.currentTarget).find("a").css({
                "color": "#333"
            });
        });

        $(".ui-resizable-handle").mouseover(function(e) {
            $(e.currentTarget).siblings(".grid-stack-item-content").css({
                "background-color": "#00396b",
                "color": "white",
                "box-shadow": "5px 5px 10px"
            });

			$(e.currentTarget).siblings(".grid-stack-item-content").find("a").css({
                "color": "white"
            });

        });

        $(".ui-resizable-handle").mouseleave(function(e) {
            $(e.currentTarget).siblings(".grid-stack-item-content").css({
                "background-color": "#EEF1F6",
                //"color": "#16325C"
				"color": "#333"
            });

			 $(e.currentTarget).siblings(".grid-stack-item-content").find("a").css({
                "color": "#333"
            });

        });

    }, 1);
	*/
}
