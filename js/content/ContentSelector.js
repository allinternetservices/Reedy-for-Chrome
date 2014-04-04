

(function(app) {
	
	function updateHlighter() {
		if ($current) {
			var offset = app.offset($current);
			hlStyle.left = offset.left+'px';
			hlStyle.top = offset.top+'px';
			hlStyle.width = offset.width+'px';
			hlStyle.height = offset.height+'px';
			
			if (!isHLighterAttached) {
				$body.appendChild($hlighter);
				isHLighterAttached = true;
			}
		}
		else {
			removeHlighter();
		}
	}
	
	function removeHlighter() {
		try {
			$body.removeChild($hlighter);
		}
		catch(e) { }
		
		isHLighterAttached = false;
	}
	
	function traverseHlighter(expanse) {
		var $parents, isOffsetChanged;
		
		if (!$source || !($parents = app.parents($source)).length) return;
		
		if (expanse) {
			traverseOffset++;
			isOffsetChanged = true;
		}
		else {
			traverseOffset--;
			isOffsetChanged = true;
		}
		
		if (isOffsetChanged) {
			traverseOffset = Math.max(Math.min(traverseOffset, $parents.length-1), 0);
			$current = traverseOffset
				? $parents[traverseOffset-1]
				: $source;
			
			updateHlighter();
		}
	}
	
	
	function onMouseMove(e) {
		clearTimeout(timeout);
		traverseOffset = 0;
		
		timeout = setTimeout(function() {
			$current = $source = e.target;
			updateHlighter();
		}, 100);
	}
	
	function onMouseDown(e) {
		clearTimeout(timeout);
		traverseOffset = 0;
		
		if ($current && !e.button) {
			app.stopEvent(e);
			runReaderAndExit();
			app.event('Content selector', 'Choose', 'Mouse');
		}
	}
	
	function onContextMenu(e) {
		clearTimeout(timeout);
		traverseOffset = 0;
		
		app.stopEvent(e);
		app.stopContentSelection();
		app.event('Content selector', 'Stop', 'Mouse');
	}
	
	function onKeyDown(e) {
		switch (e.keyCode) {
			case 27: // esc
				app.stopEvent(e);
				clearTimeout(timeout);
				app.stopContentSelection();
				app.event('Content selector', 'Stop', 'Shortcut (Esc)');
				break;
			case 13: // enter
				app.stopEvent(e);
				clearTimeout(timeout);
				runReaderAndExit();
				app.event('Content selector', 'Choose', 'Shortcut (Enter)');
				break;
			case 38: // up
			case 107: // numpad +
			case 187: // +
				app.stopEvent(e);
				clearTimeout(timeout);
				traverseHlighter(true);
				app.event('Content selector', 'Traverse', 'Key ('+e.keyCode+')');
				break;
			case 40: // down
			case 109: // numpad -
			case 189: // -
				app.stopEvent(e);
				clearTimeout(timeout);
				traverseHlighter(false);
				app.event('Content selector', 'Traverse', 'Key ('+e.keyCode+')');
				break;
		}
	}
	
	
	function runReaderAndExit() {
		if ($current) {
			app.startReader($current.innerText.trim());
		}
		app.stopContentSelection();
	}
	
	
	
	var isStarted = false,
		isHLighterAttached = false,
		$body = document.body,
		$hlighter = app.createElement('div', 'e-FastReader-hlighter'),
		hlStyle = $hlighter.style,
		$source, $current,
		traverseOffset, timeout;
	
	
	app.startContentSelection = function() {
		if (isStarted) return;
		isStarted = true;
		
		hlStyle.left =
		hlStyle.top =
		hlStyle.width =
		hlStyle.height = 0;
		
		
		app.on($body, 'mousemove', onMouseMove);
		app.on($body, 'mousedown', onMouseDown);
		app.on($body, 'contextmenu', onContextMenu);
		
		app.on(window, 'keydown', onKeyDown);
		
		
		// Makes the browser fire the `mousemove` event
		var scrollLeft = window.pageXOffset,
			scrollTop = window.pageYOffset;
		window.scrollTo(scrollLeft+1, scrollTop+1);
		window.scrollTo(scrollLeft-1, scrollTop-1);
		window.scrollTo(scrollLeft, scrollTop);
	}
	
	app.stopContentSelection = function() {
		if (!isStarted) return;
		isStarted = false;
		
		app.off($body, 'mousemove', onMouseMove);
		app.off($body, 'mousedown', onMouseDown);
		app.off($body, 'contextmenu', onContextMenu);
		
		app.off(window, 'keydown', onKeyDown);
		
		removeHlighter();
		
		$current = $source = null;
	}
	
	
	
})(window.fastReader);
