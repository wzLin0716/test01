/*
 * Sets store_points to true, so all the occurring prediction points are stored
 * 將 儲存_點 設置為 true，以便存儲所有出現的預測點
 */
function store_points_variable(){
  webgazer.params.storingPoints = true;
}

/*
 * Sets store_points to false, so prediction points aren't stored any more
 * 將 儲存_點 設置為 false，因此預測點不再存儲
 */
function stop_storing_points_variable(){
  webgazer.params.storingPoints = false;
}
