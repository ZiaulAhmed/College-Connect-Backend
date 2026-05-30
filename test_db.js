const mongoose = require('mongoose');

const uris = [
  'mongodb+srv://forexample0099_db_user:4123@college.sx2apok.mongodb.net/?appName=college',
  'mongodb+srv://forexample0099_db_user:4123@college.sx2apok.mongodb.net/college_connect?retryWrites=true&w=majority',
  'mongodb+srv://forexample0099_db_user:nko90plm@college.sx2apok.mongodb.net/collegeDB?retryWrites=true&w=majority',
  'mongodb+srv://forexample0099_db_user:4123lm@college.sx2apok.mongodb.net/collegeDB?retryWrites=true&w=majority',
  'mongodb://forexample0099_db_user:4123@ac-4d1y4vw-shard-00-00.sx2apok.mongodb.net:27017,ac-4d1y4vw-shard-00-01.sx2apok.mongodb.net:27017,ac-4d1y4vw-shard-00-02.sx2apok.mongodb.net:27017/?ssl=true&replicaSet=atlas-22hxf9-shard-0&authSource=admin&appName=college'
];

async function testAll() {
  for (const uri of uris) {
    try {
      console.log('Testing:', uri);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('? Connected to', uri);
      process.exit(0);
    } catch (e) {
      console.log('? Failed:', e.message);
    }
  }
  process.exit(1);
}

testAll();
