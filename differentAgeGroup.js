const {CHOSEN_VACCINE} = require("./constants")

function differentAgeGroupsSameVaccine(data){
    const intersectionResults=[]
    data.centers.forEach((center) => {
        const centerId = center.center_id;
        const pass1 = [];
        const pass2 = [];
  
  
        const result = center.sessions.forEach((session) => {
          if (
            session.min_age_limit < 45 &&
            session.available_capacity_dose2 > 1 &&
            session.vaccine.toLowerCase() === CHOSEN_VACCINE
          ) {
            session.center_name = center.name;
            session.pincode = center.pincode;
            pass1.push(session);
          }
          if (
            session.min_age_limit >= 45 &&
            session.available_capacity_dose2 > 1 &&
            session.vaccine.toLowerCase() === CHOSEN_VACCINE
          ) {
            session.center_name = center.name;
            session.pincode = center.pincode;
            pass2.push(session);
          }
        });
  
        pass1.forEach(item => {
          const p1Date = item.date;
          pass2.forEach(p2Item => {
            const p2Date = p2Item.date;
            const matchingTime = item.slots.filter(value => p2Item.slots.includes(value));
            if(p1Date == p2Date &&  matchingTime.length > 0) {
              intersectionResults.push({
                name: center.name,
                address: center.address,
                pincode: center.pincode,
                date: p1Date,
                centerId,
                time:  matchingTime.join(" ")
              })
            }
  
          })
        })
  
      });

      return intersectionResults
}


module.exports = differentAgeGroupsSameVaccine