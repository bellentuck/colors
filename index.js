$(document).ready(function() {
  makeCanvasFullPage();
  loadInGradients("https://raw.githubusercontent.com/bellentuck/colors/master/gradients.json");
});




function makeCanvasFullPage() {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function loadInGradients(url) {
  $.getJSON(url, function(json) {
    var results = getResultColors(json);
    dealWithColors(results);
  });
}

function getResultColors(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    result = addColorsEntryToResults(result, data[i]['colors']);
  }
  return result;
}

function addColorsEntryToResults(result, colors) {
  if (colors.length === 2) {
    result.push(colors);
  }
  return result;
}




function dealWithColors(data) {
  var colorsIdx = 0;
  var state = {
    gradientsList: data,
    idx: 0,        // which index on the list of gradients are we on?
    //pressedKeys: {},  // which keyboard keys are currently pressed down?
    autoChange: false,    // use `setInterval` & `clearInterval`
    autoChangeId: null,
    autoDrawIds: [],
    autoChangeInterval: 3980,
    timer: null,
    opacity: 1,
    activeCurves: {
      sine: false
    }
  };
  window.addEventListener('keydown', keyDownActions(state), true);
  window.addEventListener('keyup', keyUpActions(state), false);
}


function implementSafetyStandard(state, speed) {
  state.autoChangeInterval = speed > 130 ? speed : 130;
}

var keyUpActions = function(state) {
  return function(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    switch (event.key) {
      case 'ArrowDown':
        if (state.autoChange) {
          state.timer = Date.now() - state.timer;
          let func = changeBackgroundGradientRandomly(state);
          state.autoChangeInterval *= (1 + 20 / state.timer);
          clearInterval(state.autoChangeId);
          state.autoChangeId = setInterval(func, state.autoChangeInterval);
          state.timer = null;
        }
        break;
      case 'ArrowUp':
        if (state.autoChange) {
          state.timer = Date.now() - state.timer;
          let func = changeBackgroundGradientRandomly(state);
          let proposedSpeed = state.autoChangeInterval * (1 - 20 / state.timer);
          implementSafetyStandard(state, proposedSpeed);
          // state.autoChangeInterval *= (1 - 10 / state.timer);
          clearInterval(state.autoChangeId);
          state.autoChangeId = setInterval(func, state.autoChangeInterval);
          state.timer = null;
        }
      default:
        return;
    }
  }
    event.preventDefault();
}

var keyDownActions = function(state) {
  return function(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    // See: https://stackoverflow.com/questions/1828613/check-if-a-key-is-down
    //state.pressedKeys[event.key] = true;

    switch (event.key) {
      case 'a':
        state.autoChange = !state.autoChange;
        if (state.autoChange) {
          state.autoChangeId = setInterval(
            changeBackgroundGradientRandomly(state), state.autoChangeInterval);
        } else {
          clearInterval(state.autoChangeId);
        }
        break;
      case 'ArrowDown':
        if (state.autoChange) {
          state.timer = Date.now();
        } else {
          state.idx -= 1;
          dealWithCornerIndices(state);
          changeBackgroundGradient(state.gradientsList[state.idx]);
        }
        break;
      case 'ArrowUp':
        if (state.autoChange) {
          state.timer = Date.now();
        } else {
          state.idx += 1;
          dealWithCornerIndices(state);
          changeBackgroundGradient(state.gradientsList[state.idx]);
        }
        break;
      case 'ArrowRight': // make more opaque
        state.opacity = state.opacity < .04 ? state.opacity : state.opacity - .04;
        document.getElementById('canvas').style.opacity = state.opacity;
        break;
      case 'ArrowLeft': // make less opaque
        state.opacity = state.opacity > .9 ? state.opacity : state.opacity + .04;
        document.getElementById('canvas').style.opacity = state.opacity;
        break;
      case "s":
        // create sine wave
        if (!state.activeCurves.sine) {
          state.autoDrawIds.push(setInterval(OnDraw(.1,2), 100));
          state.autoDrawIds.push(setInterval(OnDraw(.3), 200));
          state.autoDrawIds.push(setInterval(OnDraw(.5,2), 300));
          state.autoDrawIds.push(setInterval(OnDraw(.7), 400));
          state.autoDrawIds.push(setInterval(OnDraw(.9,2), 500));
          state.activeCurves.sine = true;
        } else {
          clearInterval(state.autoDrawIds.shift());
          if (state.autoDrawIds.length === 0) state.activeCurves.sine = false;
        }
        //state.activeCurves.sine = !state.activeCurves.sine;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }
}

function changeBackgroundGradient(colorData) {
  var ctx = document.getElementById('canvas').getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, window.innerHeight, window.innerWidth);
  gradient.addColorStop(0, colorData[0]);
  gradient.addColorStop(1, colorData[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}


function changeBackgroundGradientRandomly(state) {
  return function() {
    state.idx = getRandomInt(state.gradientsList.length);
    changeBackgroundGradient(state.gradientsList[state.idx]);
  }
}

// `keyActions` and `changeBackgroundGradientRandomly` use currying--
// i.e., "translating the evaluation of a function that takes multiple arguments
// (or a tuple of arguments) into evaluating a sequence of functions, each with
// a single argument" (Wikipedia).
// Also see: https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function




function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function dealWithCornerIndices(state) {
  if (state.idx >= state.gradientsList.length) {
    state.idx = 0;
  } else if (state.idx < 0) {
    state.idx = state.gradientsList.length - 1;
  }
}



// sinewaves

            var time = 0;
			var color = "#D0B1C3";

			function OnDraw(relHeight=0.5, shakinessFactor=2, period=0.05, amplitude=200, direction="left") {
        return function() {
  				time = time + 0.2;
  				var canvas = document.getElementById("canvas");
  				var dataLine = canvas.getContext("2d");
  			  //var value = document.getElementById("lineWidth");

  				//dataLine.clearRect(0, 0, canvas.width, canvas.height);
  				dataLine.beginPath();
  				<!-- dataLine.moveTo(0, canvas.height * relHeight); -->
          if (direction === "left") {
    				for(cnt = -1; cnt <= canvas.width; cnt++) {
    					dataLine.lineTo(cnt, canvas.height * relHeight - (Math.random() * shakinessFactor + Math.cos(time + cnt * period) * amplitude ));
    				}
          } else {
            for(cnt = -1; cnt <= canvas.width; cnt++) {
              dataLine.lineTo(cnt, canvas.height * relHeight - (Math.random() * shakinessFactor + Math.cos(time - cnt * period) * amplitude ));
    				}
          }

  				dataLine.lineWidth = 1;
  				dataLine.strokeStyle = color;
  				dataLine.stroke();
        }
			}
