var basepb = require('./buftest_pb');

console.log(basepb);
var message = new basepb.SearchRequest();
console.log(message);
message.setName("TS");
message.setPassword("123456");
var bytes = message.serializeBinary();
console.log(bytes);
var message2 = basepb.SearchRequest.deserializeBinary(bytes);
console.log(message2);
