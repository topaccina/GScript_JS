function getPoolPairsLL() {
  
  
  var url="https://ocean.defichain.com/v0/mainnet/poolpairs"
  var httpRequest=UrlFetchApp.fetch(url);
  var getContext=httpRequest.getContentText();
  var parseData=JSON.parse(getContext);
  var poolId=[];
  var poolSym=[];
  var poolLiq=[];
  var poolAPR=[];
  var poolAB=[];
  var poolBA=[];
  
  var check=Date.now();
  
  
  Logger.log(parseData.data["1"]);

  //for (const [key, value] of Object.entries(parseData)) {
    for (const [key, value] of Object.entries(parseData.data)) {
      poolId.push(`${key}`);
      poolSym.push(parseData.data[`${key}`].symbol);
      poolLiq.push(parseData.data[`${key}`].totalLiquidity.usd);
      poolAPR.push((parseData.data[`${key}`].apr.reward)*100);
      poolAB.push(parseData.data[`${key}`].priceRatio.ab);
      poolBA.push(parseData.data[`${key}`].priceRatio.ba);
    
}
var col=1;
var row=3;
var sh1=SpreadsheetApp.getActiveSpreadsheet().getSheetByName("getPoolPairs");
sh1.getRange(1,1).setValue("Date");
sh1.getRange(1,2).setValue(new Date());
var headers=["ID Pool (A-B)","Pool Symbol","Liquidity(USD)",	"APR(pct)","Price Ratio A-B",	"Price Ratio B-A"];
for(index in headers){
  sh1.getRange(row,parseInt(col)+parseInt(index)).setValue(headers[index]);
  //Logger.log(index);
}

row++;
col=1;
for(var i=0;i<=poolId.length-1;i++){
  sh1.getRange(row+i,col).setValue(poolId[i]);
  sh1.getRange(row+i,col+1).setValue(poolSym[i]);
  sh1.getRange(row+i,col+2).setValue(poolLiq[i]);
  sh1.getRange(row+i,col+3).setValue(poolAPR[i]);
  sh1.getRange(row+i,col+4).setValue(poolAB[i]);
  sh1.getRange(row+i,col+5).setValue(poolBA[i]);
}



}
