/*
       Connects to a mock database
*/
var mockData=require('./test_data');
var connection;
function connect(dbsettings,nextFunction) {
        connection={ isConnected:function(){return true;}};
        nextFunction();

}
/*
Execute a procedure 
*/
function execute(procedure_name,params,res,nextFunc){
        nextFunc(mockData.data());
}

exports.connect=connect;
exports.execute=execute;

