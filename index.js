$(document).ready(function() {
  $.getJSON("https://raw.githubusercontent.com/bellentuck/colors/master/gradients.json", function(json) {
    var results = getResultColors(json);
    console.log(results);
    var colorsIdx = 0;
    alert('test');
    setInterval(function(){
      colorsIdx++;
      changeBackgroundGradient(results[colorsIdx]);
    }, 1000);
  });
});

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


// function changeBackgroundGradient(colorData) {
//    document.body.style.background = 'linear-gradient(90deg, ' + colorData[0] + '10%, ' + colorData[1] + ' 90%)';
// }
function changeBackgroundGradient(colorData) {
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, canvas.height, canvas.width);
  gradient.addColorStop(0, colorData[0]);
  gradient.addColorStop(1, colorData[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(10, 10, canvas.width, canvas.height);
   //document.body.style.background = 'linear-gradient(90deg, ' + colorData[0] + '10%, ' + colorData[1] + ' 90%)';
}

//
//
//
//
//


//       var colorsIdx = 0;
//       (function() {
//         setInterval(function(){
//           changeBackgroundGradient(data[colorsIdx]);
//           alert('Loop Works');
//           //alert(data[colorsIdx]);
//         }, 1000);
//       })();
//       alert('hi once more');
//       // alert(data[0]['name']);
//   });
// })();




// function changeBackgroundGradient(colorData) {
//    document.body.style.background = linear-gradient(90deg, colorData[0] 10%, colorData[1] 90%);
// }

// var data = readInData();
// alert(data[0]);
//--------------------------------------------//




// // after some time, change body.background
// background: linear-gradient(
//   90deg, #EC6F66 10%, #F3A183 90%
// ); /* W3C */
