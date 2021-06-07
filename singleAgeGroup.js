function singleAgeGroup(data) {
  const result = [];
  data.centers.forEach((center) => {
    const centerId = center.center_id;
    center.sessions.forEach((session) => {
      if (
        session.min_age_limit < 45 &&
        session.available_capacity_dose2 > 1 &&
        session.vaccine.toLowerCase() === chosenVaccine
      ) {
        session.center_name = center.name;
        session.pincode = center.pincode;
        result.push({
          name: center.name,
          address: center.address,
          pincode: center.pincode,
          date: session.date,
          centerId,
          time: session.slots.join(" "),
        });
      }
    });
  });

  return result;
}

module.exports = singleAgeGroup
