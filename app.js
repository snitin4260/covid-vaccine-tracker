const express = require("express");
const app = express();
const port = 9000;
require('dotenv').config()
const fetch = require("node-fetch");
const notifier = require("node-notifier");
var cron = require("node-cron");
const { format } = require("date-fns");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const COVISHIELD = "covishield";
const COVAXIN = "covaxin";

const chosenVaccine = COVISHIELD;

let alreadySentCenters = [];

function checkVaccines() {
  console.log(
    "Executed at",
    `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
  );
  async function test() {
    const response = await fetch(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=571&date=${format(
        new Date(),
        "dd-MM-yyyy"
      )}`
    );
    const final = await response.json();
    const sessionRes = [];

    const finalResult = final.centers.filter((center) => {
      const result = center.sessions.filter((session) => {
        if (
          session.min_age_limit < 45 &&
          session.available_capacity_dose2 > 1 &&
          session.vaccine.toLowerCase() === chosenVaccine
        ) {
          session.center_name = center.name;
          session.pincode = center.pincode;
          sessionRes.push(session);
          return session;
        }

        return false;
      });

      if (result.length > 0) return result;

      return false;
    });

    return sessionRes;
  }

  const final = test();

  final.then((resul) => {
    console.log(resul);
    let pincodes = [];
    resul.map((r) => pincodes.push(r.pincode));
    let uniqPin = new Set(pincodes);
    let uniqArrayPincodes = Array.from(uniqPin);
    const msg = {
      to: "snitin9489@gmail.com", // Change to your recipient
      from: "snitin8994@gmail.com", // Change to your verified sender
      subject: `${chosenVaccine.toUpperCase()} Vaccine Alert`,
      text: `Vaccine is available at pincodes: ${uniqArrayPincodes.join(" ")}`,
      html: `<p>Vaccine is available at pincodes: ${uniqArrayPincodes.join(
        " "
      )}</p>`,
    };

    if (resul.length > 0) {
      notifier.notify({
        title: `${chosenVaccine.toUpperCase()} Vaccine Alert`,
        message: `${uniqArrayPincodes.join(" ")}`,
        sound: true,
      });

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
}

app.get("/", (req, res) => {
  const response = fetch(
    `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=571&date=${format(
      new Date(),
      "dd-MM-yyyy"
    )}`
  )
    .then((res) => res.json())
    .then((resu) => res.send(resu));
});

cron.schedule("* * * * *", function () {
  checkVaccines();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
