const express = require('express');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 3000;

// Update this with your actual port name
const serialPort = new SerialPort({ path: 'COM3', baudRate: 9600 });

// Handle SerialPort errors
serialPort.on('error', (err) => {
    console.error('Error opening serial port:', err.message);
    process.exit(1); // Exit the process with an error code
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

let latestData = '';

parser.on('data', (data) => {
    console.log('Receiving data:', data);
    latestData = data;
});


app.get('/data', (req, res) => {
    res.send({ data: latestData });
  
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'chart.html'));
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
