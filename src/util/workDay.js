const moment = require("moment");
moment().format(); 

const workDay = (wdStart, wdEnd, spacious) => {   
    // const [timeSlots, setTimeSlots] = useState([]);
    // const createTimeSlots = (fromTime, toTime) => {
    let startTime = moment(wdStart, 'HH:mm');
    let endTime = moment(wdEnd, 'HH:mm');
    if (endTime.isBefore(startTime)) {
        endTime(1, 'day');
    }
    let arr = [];
    while (startTime < endTime) {
        arr.push(new moment(startTime).format('HH:mm'));
        // startTime.add(30, 'minutes');
        startTime.add(spacious, 'minutes');
    }
    return arr;

};
//     useEffect(() => {
//         // setTimeSlots(createTimeSlots('08:00', '16:00'));
//         // let slots = createTimeSlots('08"00', '17:00');
//         let slots = createTimeSlots(wdStart, wdEnd);
        
//     }, []);
   
//  }
     
 module.exports = { workDay };