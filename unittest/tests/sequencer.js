

exports = (function() {
	
	function getTimeLeft(data, fromIndex) {
		for (var i = 0, res = 0; i < data.length; i++) {
			if (i > fromIndex) {
				res += data[i].getComplexity() * timing;
			}
		}
		return res;
	}
	
	function checkSequencer(sequencer, raw, data, index) {
		assert.equal(sequencer.index, index, "[Index] "+raw);
		assert.equal(Math.round(sequencer.getTimeLeft()), getTimeLeft(data, index), "[Time left] "+raw);
	}
	
	
	function check(raw, indexes) {
		var data = parser(raw),
			sequencer = new Sequencer(raw, data), i = -1;
		
		checkSequencer(sequencer, raw, data, 0);
		
		sequencer.toNextToken();
		checkSequencer(sequencer, raw, data, indexes[++i]);
		
		sequencer.toLastToken();
		checkSequencer(sequencer, raw, data, indexes[++i]);
		
		sequencer.toFirstToken();
		checkSequencer(sequencer, raw, data, indexes[++i]);
	}
	
	function checkSent(raw, indexes) {
		var data = parser(raw),
			sequencer = new Sequencer(raw, data), i = -1;
		
		sequencer.toNextSentence();
		checkSequencer(sequencer, raw, data, indexes[++i]);
		
		sequencer.toNextSentence();
		checkSequencer(sequencer, raw, data, indexes[++i]);
		
		sequencer.toPrevSentence();
		checkSequencer(sequencer, raw, data, indexes[++i]);
		
		sequencer.toPrevSentence();
		checkSequencer(sequencer, raw, data, indexes[++i]);
	}
	
	function checkTokenAtIndex(raw) {
		var data = parser(raw),
			sequencer = new Sequencer(raw, data), i;
		
		for (i = 1; i < arguments.length; i++) {
			sequencer.toTokenAtIndex(arguments[i][0]);
			assert.equal(sequencer.index, arguments[i][1], i+": "+raw);
		}
	}
	
	
	var assert = require("../assert.js");
	
	
	var Sequencer = window.reedy.Sequencer,
		parser = window.reedy.parse4,
		wpm = 600, timing = 60000/wpm;
	
	window.reedy.get = function(key) {
		return ({
			wpm: wpm,
			fontSize: 4,
			vPosition: 4,
			darkTheme: false,
			transparentBg: false,
			
			autostart: false,
			focusMode: true,
			gradualAccel: true,
			smartSlowing: true,
			
			entityAnalysis: true,
			hyphenation: true,
			emptySentenceEnd: true,
			
			progressBar: true,
			timeLeft: true
		})[key];
	}
	
	assert.profile("Sequencer");
	
	/////////////////////////////////////////////////////
	
	console.log("==== Part 1");
	
	check("Hello",                                      [0, 0, 0]);
	check("just a word",                                [1, 2, 0]);
	check("Hello! How are you?",                        [1, 3, 0]);
	check("Hello! How are you?\n- I'm fine!",           [1, 5, 0]);
	
	/////////////////////////////////////////////////////
	
	console.log("==== Part 2");
	
	checkSent("Hello",                                  [0, 0, 0, 0]);
	checkSent("just a word",                            [2, 2, 0, 0]);
	checkSent("Hello! How are you?",                    [1, 3, 1, 0]);
	checkSent("Hello! How are you?\n- I'm fine!",       [1, 4, 1, 0]);
	checkSent("Hello! How?\nFine!",                     [1, 2, 1, 0]);
	
	/////////////////////////////////////////////////////
	
	console.log("==== Part 3");
	
	checkTokenAtIndex("Hello",                                  [0,0], [1,0], [10,0]);
	checkTokenAtIndex("Hello! How are you?\n- I'm fine!",       [0,0], [1,0], [6,0], [7,1], [21,4], [50,5]);
	
	/////////////////////////////////////////////////////
	
	return assert.profileEnd();
	
})();
