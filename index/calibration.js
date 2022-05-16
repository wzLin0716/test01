var PointCalibrate = 0;
var CalibrationPoints={};

/**
 * Clear the canvas and the calibration button.
 * 清除畫布和校準按鈕。
 */
function ClearCanvas(){
  $(".Calibration").hide();
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Show the instruction of using calibration at the start up screen.
 * 在啟動屏幕上顯示使用校準的說明。
 */
function PopUpInstruction(){
  ClearCanvas();
  swal({
    title:"校準",//Calibration
    text: "請點擊屏幕上的 9 個點中的每一個。 您必須點擊每個點 5 次，直到它由紅變黃。 這將校準您的眼球運動。",
    buttons:{
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowCalibrationPoint();
  });

}
/**
  * Show the help instructions right at the start.
  * 在開始時顯示幫助說明。
  */
function helpModalShow() {
    $('#helpModal').modal('show');
}

/**
 * Load this function when the index page starts. 索引頁啟動時加載此函數。
 * This function listens for button clicks on the html page checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
 * 此函數偵聽 html 頁面上的按鈕點擊檢查所有按鈕是否已被點擊 5 次，然後繼續測量精度
 */
$(document).ready(function(){
  ClearCanvas();
  helpModalShow();
     $(".Calibration").click(function(){ // click event on the calibration buttons 校準按鈕上的單擊事件

      var id = $(this).attr('id');

      if (!CalibrationPoints[id]){ // initialises if not done 如果未完成則初始化
        CalibrationPoints[id]=0;
      }
      CalibrationPoints[id]++; // increments values 遞增值

      if (CalibrationPoints[id]==5){ //only turn to yellow after 5 clicks 僅在點擊 5 次後變為黃色
        $(this).css('background-color','yellow');
        $(this).prop('disabled', true); //disables the button 禁用按鈕
        PointCalibrate++;
      }else if (CalibrationPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        //單擊時逐漸增加校準點的不透明度，以向用戶提供一些指示。
        var opacity = 0.2*CalibrationPoints[id]+0.2;
        $(this).css('opacity',opacity);
      }

      //Show the middle calibration point after all other points have been clicked. 單擊所有其他點後顯示中間校準點。
      if (PointCalibrate == 8){
        $("#Pt5").show();
      }

      if (PointCalibrate >= 9){ // last point is calibrated 最後一點已校準
            //using jquery to grab every element in Calibration class and hide them except the middle point.
            //使用 jquery 來抓取 Calibration 類中的每個元素並將它們隱藏起來，除了中間點。
            $(".Calibration").hide();
            $("#Pt5").show();

            // clears the canvas 清除畫布
            var canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            // notification for the measurement process 測量過程通知
            swal({
              title: "Calculating measurement",
              text: "在接下來的 5 秒內，請不要移動鼠標並盯著中間的點。 這將使我們能夠計算預測的準確性。",
              closeOnEsc: false,
              allowOutsideClick: false,
              closeModal: true
            }).then( isConfirm => {

                // makes the variables true for 5 seconds & plots the points 使變量為真 5 秒並繪製點
                $(document).ready(function(){

                  store_points_variable(); // start storing the prediction points 開始存儲預測點

                  sleep(5000).then(() => {
                      stop_storing_points_variable(); // stop storing the prediction points 停止存儲預測點
                      var past50 = webgazer.getStoredPoints(); // retrieve the stored points 檢索存儲的點
                      var precision_measurement = calculatePrecision(past50);
                      var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                      document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar. 在導航欄中顯示準確性。
                      swal({
                        title: "您的準確度衡量標準是" + precision_measurement + "%",
                        allowOutsideClick: false,
                        buttons: {
                          cancel: "Recalibrate",
                          confirm: true,
                        }
                      }).then(isConfirm => {
                          if (isConfirm){
                            //clear the calibration & hide the last middle button 清除校準並隱藏最後一個中間按鈕
                            ClearCanvas();
                          } else {
                            //use restart function to restart the calibration 使用重啟功能重新開始校準
                            document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
                            webgazer.clearData();
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                          }
                      });
                  });
                });
            });
          }
    });
});

/**
 * Show the Calibration Points 顯示校準點
 */
function ShowCalibrationPoint() {
  $(".Calibration").show();
  $("#Pt5").hide(); // initially hides the middle button 最初隱藏中間按鈕
}

/**
* This function clears the calibration buttons memory 此功能清除校準按鈕內存
*/
function ClearCalibration(){
  // Clear data from WebGazer 從 WebGazer 清除數據

  $(".Calibration").css('background-color','red');
  $(".Calibration").css('opacity',0.2);
  $(".Calibration").prop('disabled',false);

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
// sleep 函數，因為 java 沒有，來自 http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
