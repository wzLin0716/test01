/*
 * This function calculates a measurement for how precise the eye tracker currently is which is displayed to the user
 * 此函數計算眼動儀當前顯示給用戶的精確度
 */
function calculatePrecision(past50Array) {
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();

  // Retrieve the last 50 gaze prediction points 檢索最後 50 個注視預測點
  var x50 = past50Array[0];
  var y50 = past50Array[1];

  // Calculate the position of the point the user is staring at 計算用戶注視點的位置
  var staringPointX = windowWidth / 2;
  var staringPointY = windowHeight / 2;

  var precisionPercentages = new Array(50);
  calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
  var precision = calculateAverage(precisionPercentages);

  // Return the precision measurement as a rounded percentage 以四捨五入的百分比返回精度測量值
  return Math.round(precision);
};

/*
 * Calculate percentage accuracy for each prediction based on distance of the prediction point from the centre point (uses the window height as lower threshold 0%)
 * 根據預測點與中心點的距離計算每個預測的百分比準確度（使用窗口高度作為下限閾值 0%）
 */
function calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
  for (x = 0; x < 50; x++) {
    // Calculate distance between each prediction and staring point 計算每個預測和起點之間的距離
    var xDiff = staringPointX - x50[x];
    var yDiff = staringPointY - y50[x];
    var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

    // Calculate precision percentage 計算精度百分比
    var halfWindowHeight = windowHeight / 2;
    var precision = 0;
    if (distance <= halfWindowHeight && distance > -1) {
      precision = 100 - (distance / halfWindowHeight * 100);
    } else if (distance > halfWindowHeight) {
      precision = 0;
    } else if (distance > -1) {
      precision = 100;
    }

    // Store the precision 存儲精度
    precisionPercentages[x] = precision;
  }
}

/*
 * Calculates the average of all precision percentages calculated
 * 計算所有計算的精度百分比的平均值
 */
function calculateAverage(precisionPercentages) {
  var precision = 0;
  for (x = 0; x < 50; x++) {
    precision += precisionPercentages[x];
  }
  precision = precision / 50;
  return precision;
}