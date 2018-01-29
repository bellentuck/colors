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
  window.addEventListener("keypress", keyActions(data), true);
  setInterval(function(){
    colorsIdx++;
    changeBackgroundGradient(data[colorsIdx]);
  }, 3000);
}

function changeBackgroundGradient(colorData) {
  var ctx = document.getElementById('canvas').getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, window.innerHeight, window.innerWidth);
  gradient.addColorStop(0, colorData[0]);
  gradient.addColorStop(1, colorData[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}




// `keyActions` uses currying--i.e., "translating the evaluation of a function
// that takes multiple arguments (or a tuple of arguments) into evaluating a
// sequence of functions, each with a single argument" (Wikipedia).
// Also see: https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function

var keyActions = function(data) {
  return function(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "m":
        changeBackgroundGradient(data[100]);
        break;
      case "n":
        changeBackgroundGradient(data[101]);
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }
}
