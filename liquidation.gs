function pageList() {
  Logger.log("pageList");
  var url="https://ocean.defichain.com/v0/mainnet/loans/vaults";
  var request;
  var content;
  var page;
  var pageCursor=[];
  request=UrlFetchApp.fetch(url);
  content=JSON.parse(request.getContentText());
  page=content.page.next;
  pageCursor.push(page);
  while(page){
    try{
      url="https://ocean.defichain.com/v0/mainnet/loans/vaults?page&next="+page;
      request=UrlFetchApp.fetch(url);
      content=JSON.parse(request.getContentText());
      page=content.page.next;
      pageCursor.push(page);
    }catch{
      return pageCursor;
    }
  
  }
    
}

function filterVault(pageCursor){
  Logger.log("filter vault");
  var url;
  var request;
  var parseData;
  var page;
  var vaultIds=[];
  var vaultHIds=[];
  var vaultStatus=[];
  var vaultLoanScheme=[];
  var vaultBatchCount=[];
  var vaultLiqHeight=[];
  var vaultLiqPenalty=[];
  var vaultInfo=[];
  var vaultHLoanScheme=[];
  var vaultHCurrentRatio=[];

  for(pg in pageCursor){
    page=pageCursor[pg];
    url="https://ocean.defichain.com/v0/mainnet/loans/vaults?page&next="+page;
    request=UrlFetchApp.fetch(url);
    parseData=JSON.parse(request.getContentText());
    for(const[key,value] of Object.entries(parseData.data)){
      if(parseData.data[`${key}`].state=="IN_LIQUIDATION"){
        vaultIds.push(parseData.data[`${key}`].vaultId);
        vaultStatus.push(parseData.data[`${key}`].state);
        vaultLoanScheme.push(parseData.data[`${key}`].loanScheme.id);
        vaultBatchCount.push(parseData.data[`${key}`].batchCount);
        vaultLiqHeight.push(parseData.data[`${key}`].liquidationHeight);
        vaultLiqPenalty.push(parseData.data[`${key}`].liquidationPenalty);
      } else if(parseData.data[`${key}`].state=="ACTIVE" & parseInt(parseData.data[`${key}`].loanScheme.minColRatio)>200 
      & parseFloat(parseData.data[`${key}`].informativeRatio)/parseFloat(parseData.data[`${key}`].loanScheme.minColRatio)<=1.5 
      & parseFloat(parseData.data[`${key}`].informativeRatio)/parseFloat(parseData.data[`${key}`].loanScheme.minColRatio)>0) {
          vaultHIds.push(parseData.data[`${key}`].vaultId);
          vaultHLoanScheme.push(parseData.data[`${key}`].loanScheme.id);
          vaultHCurrentRatio.push(parseFloat(parseData.data[`${key}`].informativeRatio)/parseFloat(parseData.data[`${key}`].loanScheme.minColRatio));
          Logger.log(parseFloat(parseData.data[`${key}`].informativeRatio)/parseFloat(parseData.data[`${key}`].loanScheme.minColRatio));
      }  
    }
    
  }
  vaultInfo=[vaultIds,vaultStatus,vaultLoanScheme,vaultBatchCount,vaultLiqHeight,vaultLiqPenalty,vaultHIds,vaultHLoanScheme,vaultHCurrentRatio];
  //Logger.log(vaultInfo);
  return vaultInfo;
}

function printPageList(){
  var pageCursorList=pageList();
  ss=SpreadsheetApp.getActiveSpreadsheet().getSheetByName("test");
  ss.clearContents();
  vaultInfo=filterVault(pageCursorList);
  var vaultIds=vaultInfo[0];
  var vaultStatus=vaultInfo[1];
  var vaultLoanScheme=vaultInfo[2];
  var vaultBatchCount=vaultInfo[3];
  var vaultLiqHeight=vaultInfo[4];
  var vaultLiqPenalty=vaultInfo[5];
  var vaultHIds=vaultInfo[6];
  var vaultHLoanScheme=vaultInfo[7];
  var vaultHCurrentRatio=vaultInfo[8];

  for(i=0;i<=vaultIds.length-1;i++){
    ss.getRange(2+i,1).setValue(vaultIds[i]);
  }
  for(i=0;i<=vaultStatus.length-1;i++){
    ss.getRange(2+i,2).setValue(vaultStatus[i]);
  }
  for(i=0;i<=vaultLoanScheme.length-1;i++){
    ss.getRange(2+i,3).setValue(vaultLoanScheme[i]);
  }
  for(i=0;i<=vaultBatchCount.length-1;i++){
    ss.getRange(2+i,4).setValue(vaultBatchCount[i]);
  }
  for(i=0;i<=vaultLiqHeight.length-1;i++){
    ss.getRange(2+i,5).setValue(vaultLiqHeight[i]);
  }
  for(i=0;i<=vaultLiqPenalty.length-1;i++){
    ss.getRange(2+i,6).setValue(vaultLiqPenalty[i]);
  }
  for(i=0;i<=vaultLoanScheme.length-1;i++){
    ss.getRange(2+i,7).setValue("https://defiscan.live/vaults/"+vaultIds[i]);
  }
  ss=SpreadsheetApp.getActiveSpreadsheet().getSheetByName("testH");
  ss.clearContents();
  for(i=0;i<=vaultHIds.length-1;i++){
    ss.getRange(2+i,1).setValue(vaultHIds[i]);
  }
  for(i=0;i<=vaultHLoanScheme.length-1;i++){
    ss.getRange(2+i,2).setValue(vaultHLoanScheme[i]);
  }
  for(i=0;i<=vaultHCurrentRatio.length-1;i++){
    ss.getRange(2+i,3).setValue(vaultHCurrentRatio[i]);
  }


} 
