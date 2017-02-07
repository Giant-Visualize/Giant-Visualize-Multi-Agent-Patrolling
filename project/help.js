// window.onload = function () {
// var paper = Raphael("holder");

// var map = paper.set();
//     map.push(
//         paper.rect(10,10,50,50),
//         paper.rect(10,60,50,50),
//         paper.rect(10,110,50,50)
//     );

//     map.attr({fill: "#000", "fill-opacity": 0});
//     map[0].click(function(){
//         this.cx = this.cx || 300;
//         this.animate({cx: this.cx, fill: this.cx - 100 ? "hsb(.6, .75, .75)" : "#000", "fill-opacity": +!!(this.cx - 100)}, 1000);
//     });

// };
// window.onload = function(){
//     console.log("hello");
// };

    function init() {
        var x = parseInt(document.getElementById("x").value);
        var y = parseInt(document.getElementById("y").value);
        console.log(typeof(x));
        console.log(Number.isInteger(x));
        if(Number.isInteger(x)&& Number.isInteger(y) && x>0 && y>0 && x<16 && y<16){
        var paper = Raphael("holder",1280,1280);
        var map = paper.set();
        for(var i = 0; i<x;i++){
            for(var j = 0; j<y;j++){
                map.push(paper.rect((((1280-x*50)/2)+i*50),(100+j*50),50,50));
            }
        }
        map.attr({fill: "#000", "fill-opacity": 0});
        map.click(function(){
        this.cx = this.cx || 300;
        this.animate({cx: this.cx, fill: this.cx - 100 ? "hsb(.6, .75, .75)" : "#000", "fill-opacity": +!!(this.cx - 100)}, 400);
        });
    }
	else{
	alert('Please type in right number', 'ERROR');
	}
    };

