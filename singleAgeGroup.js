const {CHOSEN_VACCINE, CHOSEN_DOSE, DOSE_OBJ} = require("./constants")

function singleAgeGroup(data) {
  const result = [];
  const selecteDose = DOSE_OBJ[CHOSEN_DOSE]
  data.centers.forEach((center) => {
    const centerId = center.center_id;
    center.sessions.forEach((session) => {
     const sessionDoseValue = session[selecteDose]
      if (
        session.min_age_limit >= 45 &&
        sessionDoseValue > 1 &&
        session.vaccine.toLowerCase() === CHOSEN_VACCINE
      ) {
        session.center_name = center.name;
        session.pincode = center.pincode;
        result.push({
          name: center.name,
          address: center.address,
          pincode: center.pincode,
          date: session.date,
          dose: sessionDoseValue,
          centerId,
          time: session.slots.join(" "),
        });
      }
    });
  });

  return result;
}

module.exports = singleAgeGroup
