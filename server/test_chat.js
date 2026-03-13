fetch('http://localhost:5000/chat', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'hello', transactions: [], budgetLimit: 5000 })
})
.then(res => res.json())
.then(data => console.log('SUCCESS', data))
.catch(err => console.error('ERROR:', err));
