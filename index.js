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
    idx: 0,
    autoChange: false,    // use `setInterval` & `clearInterval`
    autoChangeId: null,
    autoChangeInterval: 1200
  };
  window.addEventListener('keydown', keyActions(state), true);
}


var keyActions = function(state) {
  return function(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

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
      case 'ArrowLeft':
        if (state.autoChange) {
          clearInterval(state.autoChangeId);
          state.autoChangeInterval += 200;
          state.autoChangeId = setInterval(
            changeBackgroundGradientRandomly(state), state.autoChangeInterval);
        } else {
          state.idx -= 1;
          dealWithCornerIndices(state);
          changeBackgroundGradient(state.gradientsList[state.idx]);
        }
        break;
      case 'ArrowRight':
        if (state.autoChange) {
          clearInterval(state.autoChangeId);
          state.autoChangeInterval -= 200;
          state.autoChangeId = setInterval(
            changeBackgroundGradientRandomly(state), state.autoChangeInterval);
        } else {
          state.idx += 1;
          dealWithCornerIndices(state);
          changeBackgroundGradient(state.gradientsList[state.idx]);
        }
        break;
      case 'f':
        // TODO: fade in
        break;
      case 'j':
        // TODO: fade out
        break;
      case "m":
        changeBackgroundGradient(state.gradientsList[100]);
        break;
      case "n":
        changeBackgroundGradient(state.gradientsList[101]);
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
