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
  setInterval(function(){
    colorsIdx++;
    changeBackgroundGradient(data[colorsIdx]);
  }, 600);
}

function changeBackgroundGradient(colorData) {
  var ctx = document.getElementById('canvas').getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, window.innerHeight, window.innerWidth);
  gradient.addColorStop(0, colorData[0]);
  gradient.addColorStop(1, colorData[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}
