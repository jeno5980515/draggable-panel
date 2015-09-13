# draggable-panel
A raw JavaScript plugin to add a draggable panel.
## Usage 
```javascript
<div id="header" style="background:grey;height:150px;">Header</div>
<div id="panel" style="background:red;">
	<div id="panelTop" style="background:blue;">Drag me</div>
	<div id="panelBottom" style="background:grey;">Bottom</div>
</div>
<script>
	DraggablePanel.init("panel",{
		toggle : "panelTop" ,
		top : "panelTop" ,
		bottom : "panelBottom" ,
		border : "header"
	});
</script>
```
## Demo  
[Demo](https://rawgit.com/jeno5980515/draggable-panel/master/demo.html  )

## Reference
The code is rewritten form [Draggable panel - JSFiddle](http://jsfiddle.net/i_like_robots/dqLpeo7p/).
