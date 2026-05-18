console.log('🚀 Script started');
const express =require('express');
const sqlite3 =require('sqlite3');
console.log('✅ express loaded'); 
console.log('✅ sqlite3 loaded');
const db =new sqlite3.Database(':memory:');
db.serialize(() => {
db.run('CREATE TABLE test (id INT)', (err) => {
!err ? console.log('✅ SQLite is working correctly') : console.error('❌ Error');
});
});
const app = express(); app.get('/', (_, res) => res.send('OK'));
app.listen(3000, () => console.log('✅ Express server running'));