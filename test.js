var HID = require('node-hid');
var devices = HID.devices();
var device = new HID.HID(devices.find(x=> x.product === 'Logitech Dual Action').path);
var five = require("johnny-five");
const { debounce } = require('lodash');

var board = new five.Board();

board.on("ready", function() {
    //creating the servos
    var servo = {
        small: new five.Servo({
            pin: 11, 
            type: "continuous"
        }),
        med: new five.Servo({
            pin: 10, 
            type: "continuous"
        }),
        large: new five.Servo({
            pin: 9, 
            type: "continuous"
        })
    }
    
    var crane = 0.5

    let timeout;
    
    const onData = (data) => {
        const medVal = truncate(1-(Array.from(data)[1]/255), 2)
        console.log('medVal', medVal)
        servo.med.cw(medVal)

        const largeVal = truncate(1-(Array.from(data)[2]/255), 2)
        console.log('largeVal', largeVal)
        servo.large.cw(largeVal)

        if (Array.from(data)[4] == 72) {
            crane += 0.05
            console.log('CRANE', crane)
            servo.small.cw(crane)
        } else if (Array.from(data)[4] == 40) {
            crane -= 0.05
            console.log('CRANE', crane)
            servo.small.cw(crane)
        }
    }
    device.on("data", (data) => {
        if (!timeout) {
            onData(data)
            timeout = setTimeout(() => {
                timeout = undefined
            }, 100)
        }
    })
});

function truncate(value, digits) {
    const mult = Math.pow(10, digits)
    const val = Math.floor(mult * value) / mult
    return val
}

// function handle(e) {
//     console.log('ERROR', e)
// }

// process.on('uncaughtException', handle)
// process.on('unhandledRejection', handle)

//125,0 up [1,2]
//125, 255 down
//225, 125 right [3,4]
//0, 125 left
//array[4]==72 close
//'==40 open

// a
// <Buffer 80 83 87 7f 28 00 00 ff>
// <Buffer 80 83 87 7f 08 00 00 ff>
// b
// <Buffer 80 83 87 7f 48 00 00 ff>
// <Buffer 80 83 87 7f 08 00 00 ff>
// y
// <Buffer 80 83 87 7f 88 00 00 ff>
// <Buffer 80 83 87 7f 08 00 00 ff>
// x
// <Buffer 80 83 87 7f 18 00 00 ff>
// <Buffer 80 83 87 7f 08 00 00 ff>

// {
//     vendorId: 1133,
//     productId: 49686,
//     path: 'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/XHC1@14/XHC1@14000000/HS08@14300000/Logitech Dual Action@14300000/IOUSBHostInterface@0/AppleUserUSBHostHIDDevice',
//     serialNumber: 'E8BA4E56',
//     manufacturer: 'Logitech',
//     product: 'Logitech Dual Action',
//     release: 1044,
//     interface: 0,
//     usagePage: 1,
//     usage: 4
//   }