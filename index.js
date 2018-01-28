// Read in JSON -------------------------------//
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function addColorsEntryToResults(result, colors) {
  if (colors.length === 2) {
    result.push(colors);
  }
  return result;
}

alert('hi');
//usage:
window.onload = function() {
  readTextFile("gradients.json", function(text){
      var data = JSON.parse(text);
      var result = [];
      for (var i = 0; i < data.length; i++) {
        result = addColorsEntryToResults(result, data[i]['colors']);
      }
      alert('hi again');

      var colorsIdx = 0;
      (function() {
        setInterval(function(){
          changeBackgroundGradient(data[colorsIdx]);
          alert('Loop Works');
          //alert(data[colorsIdx]);
        }, 1000);
      })();
      alert('hi once more');
      // alert(data[0]['name']);
  });

}


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
