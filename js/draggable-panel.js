var DraggablePanel = (function(){ 
    var self = {} ;
    var panel , toggle , panelTop , panelBottom;
    var interaction , gesture ;
    var currentPosition ;
    var isOpen ;
    var panelTopHeight ;
    var border ;
    var borderHeight ;

    var setPanelOpen = function(){
        if ( border === null )
            panel.style.top = 0 ;
        else {
            panel.style.top = border.clientHeight + "px" ;
        }
    }

    var setPanelClose = function(){
        panel.style.top = (window.innerHeight - panelTopHeight) + "px";
    }


    self.init = function(p,para){
        document.addEventListener('DOMContentLoaded', function() {
            panel = document.getElementById(p) ;
            panel.style.position = "absolute" ;
            panel.style.bottom = panel.style.left = 0 ;
            panel.style.width = "100%" ;
            toggle = document.getElementById(para.toggle) ;
            panelTop = document.getElementById(para.top) ;
            panelBottom = document.getElementById(para.bottom) ;
            panelTopHeight = panelTop.clientHeight ;
            border = document.getElementById(para.border) ; 
            if ( border === null )
                borderHeight = 0 ;
            else {
                borderHeight = border.clientHeight;
            }
            console.log(borderHeight);
            setPanelClose();
            panel.style.overflow = "hidden" ;
            
            toggle.onmousedown = toggle.ontouchstart = onDragStart ;
        });
    }
    var getPosition = function(e){
        return e.pageY;
    }
    var startInteraction = function(y){
        var targetOffset = panel.offsetParent.offsetTop;
        var pointerOffset = y - panel.offsetTop ;
        interaction = {
            offset: targetOffset + pointerOffset,
            time: Date.now()
        };
    }
    var startGesture = function(position, direction){
        gesture = {
            direction: direction,
            position: position,
            time: Date.now()
        };
    }
    var onDragStart = function(e){
        e.preventDefault();
        var pointerPosition = getPosition(e);
        startInteraction(pointerPosition);
        startGesture(pointerPosition);
        panel.style.top = calcRelativePosition(pointerPosition) + "px" ;

        window.onmouseup = window.ontouchend = onDragEnd ;
        window.onmousemove = window.ontouchmove = onDragMove ;
    }

    var onDragMove = function(e){
        var pointerPosition = getPosition(e);
        var direction = pointerPosition < currentPosition ? "up" : "down";

        if (direction !== gesture.direction) {
            startGesture(pointerPosition, direction);
        }

        currentPosition = pointerPosition;
        panel.style.top = calcRelativePosition(pointerPosition) + "px";
    }

    var onDragEnd = function(e){
        var now = Date.now();
        var velocity = calcVelocity(gesture, {
            position: currentPosition,
            time: now
        });

        if ((now - interaction.time) < 100) {
            isOpen = !isOpen;
        } else if (velocity > 0.05) {
            isOpen = gesture.direction == "up";
        } else {
            isOpen = currentPosition <= (window.innerHeight / 2);
        }

        panel.style.top = "" ;
        if ( isOpen ){
            setPanelOpen() ;
        }
        else {
            setPanelClose();
        }

        interaction = gesture = null;
      
        window.onmouseup = window.ontouchend = window.onmousemove = window.ontouchmove = function(){;} ;
    }

    var calcRelativePosition = function(position) {
        return position - interaction.offset;
    };

    var calcVelocity = function(startGesture, endGesture) {
        var distance = (100 / window.innerHeight) * (startGesture.position - endGesture.position);
        var time = endGesture.time - startGesture.time;
        return Math.abs(distance / time);
    };

    return self ;
})();


