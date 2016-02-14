var eraser={'on':false,'rectWidth':'20','lineWidth':'1'};

var Canvas = function(domId){
    this.canvas = document.querySelector('#'+domId);
    this.ctx= this.canvas.getContext('2d');
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    this.imgDataObj=[];
    this.drawSurface='';
    this.mousedown={};
    this.isDown =false;
    this.pageIndex=0;
    this.canvasSwitch=0;
    this.strokeStyle = '#000000';
    this.lineWidth = 0.5;
}

Canvas.prototype={
    constructor:this,
    init:function(){
        this.canvas.style.cursor='crosshair';
        this.drawSurface='';
        this.clearCanvas();
        this.saveDrawSurface();
    },
    newCanvas:function(){
        this.canvas.style.cursor='crosshair';
        this.drawSurface='';
        this.imgDataObj.length=0;
        this.mousedown={};
        this.isDown = false;
        this.pageIndex=0;
        this.canvasSwitch =0;
        this.clearCanvas();
        this.saveDrawSurface();
    },
    drawLine:function(loc){
        this.ctx.beginPath();
        this.ctx.moveTo(this.mousedown.x,this.mousedown.y);
        this.ctx.lineTo(loc.x,loc.y);
        this.ctx.lineWidth = strokeWidth.value;
        this.ctx.strokeStyle = strokeStyle.value;
        this.ctx.stroke();
        this.ctx.closePath();
    },
    drawCircle:function(loc,r){
        var radius = r;
        this.ctx.beginPath();
        this.ctx.arc(loc.x,loc.y,radius,0,Math.PI*2);
        this.ctx.strokeStyle ='red';
        this.ctx.fillStyle='red';
        this.ctx.stroke();
    },
    doEraser:function(loc,eraser){
        var x =(loc.x-eraser.rectWidth/2).toFixed();
        var y =(loc.y-eraser.rectWidth/2).toFixed();
        this.ctx.lineWidth = eraser.lineWidth;
        this.ctx.strokeStyle='black';
        this.ctx.clearRect(x,y,eraser.rectWidth,eraser.rectWidth);
    },
    showEraser:function(loc,eraser){
        var x =(loc.x-eraser.rectWidth/2).toFixed();
        var y =(loc.y-eraser.rectWidth/2).toFixed();
        this.ctx.lineWidth = eraser.lineWidth;
        this.ctx.strokeStyle='black';
        this.ctx.strokeRect(x,y,eraser.rectWidth,eraser.rectWidth);
    },
    nextPage:function(){
        this.imgDataObj[this.pageIndex]=this.drawSurface;
        this.pageIndex++;
        if(this.pageIndex>this.imgDataObj.length-1){
            //clearCanvas
            this.init();
        }else{
            this.ctx.putImageData(this.imgDataObj[this.pageIndex],0,0);
        }
        this.saveDrawSurface();
    },
    prePage:function(){
        //saveCurrentCanvas
        this.imgDataObj[this.pageIndex]=this.drawSurface;
        if(this.pageIndex>0){
            this.pageIndex--;
            this.ctx.putImageData(this.imgDataObj[this.pageIndex],0,0);
        }else{
            alert('已经到首页了');
        }
        this.saveDrawSurface();
        this.saveDrawSurface();
    },
    pageTo:function(pageIndex){
        this.imgDataObj[this.pageIndex]=this.drawSurface;
        this.pageIndex=(pageIndex-1);
        if(this.pageIndex>=0 && this.pageIndex<this.imgDataObj.length){
            this.ctx.putImageData(this.imgDataObj[this.pageIndex],0,0);
        }else{
            alert('no Page found');
        }
        this.saveDrawSurface();
    },
    newPage:function(){
        this.imgDataObj[this.pageIndex]=this.drawSurface;
        this.init();
        var total=this.imgDataObj.length;
        this.pageIndex=total;
        this.saveDrawSurface();
    },
    updateMousedown:function(loc){
        this.mousedown.x=loc.x;
        this.mousedown.y=loc.y;
    },
    saveDrawSurface:function(){
        this.drawSurface=this.ctx.getImageData(0,0,this.width,this.height);
    },
    restoreDrawSurface:function(){
        this.ctx.putImageData(this.drawSurface,0,0);
    },
    clearCanvas:function(){
        this.ctx.clearRect(0,0,this.width,this.height);
    },
    switchOn:function(){
        return this.canvasSwitch == 1;
    }
}

//end internal prototype
function init(canvasId){
    var canvas = new Canvas(canvasId);
    var lfx=canvas.canvas.offsetLeft; //canvas 左上角坐标
    var lfy=canvas.canvas.offsetTop;
    var mouseupCount = 0;
    var mouseUp = document.createEvent('HTMLEvents');
    var mouseDown = document.createEvent('HTMLEvents');
    var mouseMove = document.createEvent('HTMLEvents');
    var paper,paperWidth,paperHeight,paperRatio,canvasRatio,xRatio,yRatio,eW,eH;
    var startTime;
    
    this.mirrorCanvas = function(){
        paperWidth=((paper.x2-paper.x1)/100).toFixed();
        paperHeight=((paper.y2-paper.y1)/100).toFixed();
        paperRatio =paperWidth/paperHeight;//paper 宽高比
        canvasRatio =canvas.width/canvas.height;//canvas 宽高比
        xRatio=(paperRatio>=canvasRatio)?canvas.width/paperWidth:canvas.height/paperHeight;
        yRatio=xRatio;
        eW=(paperRatio>=canvasRatio)?canvas.width:canvas.height*paperRatio;
        eH=eW/paperRatio;
    }

    canvas.canvas.addEventListener('mousedown',downHandler,false);
    canvas.canvas.addEventListener('mousemove',moveHandler,false);
    canvas.canvas.addEventListener('mouseup',upHandler,false);
    canvas.canvas.addEventListener('mouseout',outHandler,false);

    function downHandler(e){
        if(canvas.switchOn()){
            canvas.isDown=true;
            var loc ={
                'x': e.newClientX,
                'y': e.newClientY
            }
            canvas.restoreDrawSurface();
            canvas.updateMousedown(loc);
            canvas.saveDrawSurface();
        }
    }

    function moveHandler(e){
        if(canvas.switchOn()){
            var loc ={
                'x': e.newClientX,
                'y': e.newClientY
            }
            if(!eraser.on){
                if(canvas.isDown){
                    canvas.restoreDrawSurface();
                    canvas.drawLine(loc);
                    canvas.updateMousedown(loc);
                    canvas.saveDrawSurface();
                }else{
                    canvas.restoreDrawSurface();
                    canvas.drawCircle(loc,5);
                }
            }else{
                if(canvas.isDown){
                    //eraser
                    canvas.restoreDrawSurface();
                    canvas.doEraser(loc,eraser);
                    canvas.saveDrawSurface();
                }else{
                    //showEraser
                    canvas.restoreDrawSurface();
                    canvas.showEraser(loc,eraser);
                }
            }
            e.preventDefault();
        }
    }

    function upHandler(e){
        if(canvas.switchOn()){
            var loc ={
                'x': e.newClientX,
                'y': e.newClientY
            }
            canvas.isDown = false;
            canvas.restoreDrawSurface();
            //detect drawModel and switch accordingly
            if(eraser.on){
                canvas.showEraser(loc,eraser);
            }else{ // markPoint model
                canvas.drawCircle(loc,5);
            }
        }
    }

    function outHandler(){
        //clear markPoints or rect if there's any
        if(canvas.switchOn()){
            canvas.isDown=false;
            canvas.clearCanvas();
            canvas.restoreDrawSurface();
        }
    }


    this.selectPaper = function(paperSize){
        if(paperSize == 'a4'){
            paper={
                'x1':'-5000',
                'y1':'2000',
                'x2':'5000',
                'y2':'14000'
            }
        }else if(paperSize =='b5'){//182*257
            paper={
                'x1':'-4000',
                'y1':'2000',
                'x2':'4000',
                'y2':'12000'
            }
        }else if(paperSize == 'a5'){//148*210
            paper={
                'x1':'-3200',
                'y1':'2000',
                'x2':'3200',
                'y2':'10200'
            }
        }else{
            alert('请选择纸张大小');
            return;
        }
        document.removeEventListener('penWriting',this.drawOnCanvas,false);
        this.mirrorCanvas();
        document.addEventListener('penWriting',this.drawOnCanvas,false);
    }
    this.newCanvas=function(){
        canvas.newCanvas();
    }
    this.pageTo = function(pageIndex){
        canvas.pageTo(pageIndex);
    }
    this.newPage = function(){
        canvas.newPage();
    }
    this.prePage = function(){
        canvas.prePage();
    }
    this.nextPage = function(){
        canvas.nextPage();
    }
    this.turnOn=function(){
        canvas.turnOn();
        startTime = (new Date()).getTime();
    }
    this.turnOff = function(){
        canvas.turnOff();
    }
    this.drawOnCanvas = function(e){
        function transPt(pt,lfx,lfy){
            var x= (((pt.x-paper.x1)/100-lfx)*xRatio).toFixed();
            var y= (((pt.y-paper.y1)/100-lfy)*yRatio).toFixed();
            var type = pt.type;
            var diffTime = (new Date()).getTime()-startTime;
            return {
                'action':type,
                'clientX': x,
                'clientY': y,
                't':diffTime,
                'x': (x/eW).toFixed(4)*10000,//x_per
                'y':(y/eH).toFixed(4)*10000//y_per
            }
        }
        if(canvas.switchOn()){
            var obj = e.detail;
            var pos = transPt(obj, lfx, lfy);
            if (obj.type == '3') {
                if (mouseupCount == 0) {
                    if (obj.x >= paper.x1 && obj.x <= paper.x2 && obj.y >= paper.y1 && obj.y <= paper.y2) {
                        mouseMove.newClientX = pos.clientX;
                        mouseMove.newClientY = pos.clientY;
                        mouseMove.initEvent('mousemove', false, false);
                        canvas.canvas.dispatchEvent(mouseMove);
                        var pt={
                            'action':'0',
                            't':pos.t,
                            'x':pos.x,
                            'y':pos.y
                        };
                    }
                } else {
                    mouseUp.newClientX = pos.clientX;
                    mouseUp.newClientY = pos.clientY;
                    mouseUp.initEvent('mouseup', false, false);
                    canvas.canvas.dispatchEvent(mouseUp);
                    mouseupCount = 0; //mouseup
                    var pt={
                        'action':pos.action,
                        't':pos.t,
                        'x':pos.x,
                        'y':pos.y
                    };
                }
            } else if(obj.type=='2'){
                if (obj.x >= paper.x1 && obj.x <= paper.x2 && obj.y >= paper.y1 && obj.y <= paper.y2) {
                    mouseMove.newClientX = pos.clientX;
                    mouseMove.newClientY = pos.clientY;
                    mouseMove.initEvent('mousemove', false, false);
                    canvas.canvas.dispatchEvent(mouseMove);
                    var pt ={
                        'action':pos.action,
                        't':pos.t,
                        'x':pos.x,
                        'y':pos.y
                    }
                }
            } else {
                mouseDown.newClientX = pos.clientX;
                mouseDown.newClientY = pos.clientY;
                mouseDown.initEvent('mousedown', false, false);
                canvas.canvas.dispatchEvent(mouseDown);
                var pt ={
                    'action':pos.action,
                    't':pos.t,
                    'x':pos.x,
                    'y':pos.y
                }
                mouseupCount=1;
            }
        }
    }
    

    
    this.setStrokeColor = function(strokeColor){
        canvas.setStrokeColor(strokeColor);
    }
    
    this.init = function(){
        paper={'x1':'-5000',
            'y1':'2000',
            'x2':'5000',
            'y2':'14000'};
        this.mirrorCanvas();
        document.addEventListener('wenba_penWriting',this.drawOnCanvas,false);
    }
    
}


}