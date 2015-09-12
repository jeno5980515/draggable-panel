var DraggablePanel = (function(){ 
    var self = {} ;
    var panel , toggle ;
    var interaction , gesture ;
    var currentPosition ;
    var isOpen ;

    var hasClass = function(ele,cls) {
        return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }

    var addClass = function(ele,cls) {
        if (!hasClass(ele,cls)) 
            ele.className += " " + cls ;
    }

    var removeClass = function(ele,cls) {
        if (hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }

    self.init = function(p,t){
        panel = document.getElementById(p) ;
        toggle = document.getElementById(t) ;
        addClass(panel,"is-closed");
        addClass(panel,"Panel");
        addClass(panel,"js-panel");

        addClass(toggle,"Panel-toggle")
        addClass(toggle,"js-draggable");

        toggle.onmousedown = toggle.ontouchstart = onDragStart ;
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

        addClass(panel,"is-active");
        removeClass(panel,"is-open") ;
        removeClass(panel,"is-closed") ;
        panel.style.top = calcRelativePosition(pointerPosition) ;

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
        panel.style.top = calcRelativePosition(pointerPosition) ;
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
        removeClass(panel,"is-active") ;
        addClass(panel,"is-" + (isOpen ? "open" : "closed"));

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


