const {CHOSEN_VACCINE, CHOSEN_DOSE, DOSE_OBJ} = require("./constants")

function differentAgeGroupsSameVaccine(data) {
  const intersectionResults = [];
  const selecteDose = DOSE_OBJ[CHOSEN_DOSE];
  data.centers.forEach((center) => {
    const centerId = center.center_id;
    const pass1 = [];
    const pass2 = [];

    center.sessions.forEach((session) => {

      const sessionDoseValue = session[selecteDose];
      if (
        session.min_age_limit < 45 &&
        sessionDoseValue > 1 &&
        session.vaccine.toLowerCase() === CHOSEN_VACCINE
      ) {
        session.center_name = center.name;
        session.pincode = center.pincode;
        pass1.push(session);
      }
      if (
        session.min_age_limit >= 45 &&
        sessionDoseValue > 1 &&
        session.vaccine.toLowerCase() === CHOSEN_VACCINE
      ) {
        session.center_name = center.name;
        session.pincode = center.pincode;
        pass2.push(session);
      }
    });

    pass1.forEach((item) => {
      const p1Date = item.date;
      pass2.forEach((p2Item) => {
        const p2Date = p2Item.date;
        const matchingTime = item.slots.filter((value) =>
          p2Item.slots.includes(value)
        );
        if (p1Date == p2Date && matchingTime.length > 0) {
          intersectionResults.push({
            name: center.name,
            address: center.address,
            pincode: center.pincode,
            date: p1Date,
            centerId,
            dose: `18+ doses ${item[selecteDose]} 45+ doses${p2Item[selecteDose]}`,
            time: matchingTime.join(" "),
          });
        }
      });
    });
  });

  return intersectionResults;
}

module.exports = differentAgeGroupsSameVaccine;
