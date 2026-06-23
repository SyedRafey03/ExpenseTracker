const fetch = require('node-fetch'); // we might not need this if using built-in fetch in node 18+

async function run() {
    for(let i=0; i<10; i++) {
        try {
            const res = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'hello', transactions: [], budgetLimit: 5000 })
            });
            const text = await res.text();
            console.log(`Req ${i}: ${res.status} - ${text.substring(0, 50)}`);
        } catch(e) {
            console.log(`Req ${i}: ERROR ${e.message}`);
        }
    }
}
run();
