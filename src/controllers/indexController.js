
const app = require('../app');
const networkConnection = require('../fabricStartUp');

exports.queryEvent = (req, res) => {
    
    console.log("api called")
    const EventID = req.params.id
    var resArray = [];
    networkConnection
        .execTransaction("EventQuery", true, params = [EventID]).then((result) => {
            if(result)
            res.send([...resArray,JSON.parse(result.toString())]);
        }).catch((error)=>{
            res.send([]);
        });

}

exports.createEvent = (req, res) => {
    
    const EventID = req.body.eventID
    var resArray = [];
    networkConnection
        .execTransaction("CreateEvent", true, params = req.body).then((result) => {
            if(result)
            res.send([...resArray,JSON.parse(result.toString())]);
        }).catch((error)=>{
            res.send([]);
        });

}