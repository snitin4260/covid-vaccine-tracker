const express = require("express");
const app = express();
const port = process.env.PORT || 3000
require("dotenv").config();
const fetch = require("node-fetch");
const notifier = require("node-notifier");
var cron = require("node-cron");
const { format } = require("date-fns");
const sgMail = require("@sendgrid/mail");
const {outputToHumanReadableMessage } = require("./utils");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const COVISHIELD = "covishield";
const COVAXIN = "covaxin";

const chosenVaccine = COVISHIELD;

let alreadySentCenters = {};

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
    const intersectionResults=[]

    final.centers.forEach((center) => {
      const centerId = center.center_id;
      const pass1 = [];
      const pass2 = [];


      const result = center.sessions.forEach((session) => {
        if (
          session.min_age_limit < 45 &&
          session.available_capacity_dose1 > 1 &&
          session.vaccine.toLowerCase() === chosenVaccine
        ) {
          session.center_name = center.name;
          session.pincode = center.pincode;
          pass1.push(session);
        }
        if (
          session.min_age_limit >= 45 &&
          session.available_capacity_dose1 > 1 &&
          session.vaccine.toLowerCase() === chosenVaccine
        ) {
          session.center_name = center.name;
          session.pincode = center.pincode;
          pass2.push(session);
        }
      });

      // console.log("pass1 for vaccine", pass1)
      // console.log("pass2 for vaccine", pass2)


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
              time:  matchingTime.join(" ")
            })
          }

        })
      })

    });

    return intersectionResults;
  }

  const final = test();

  final.then((resul) => {
    console.log(resul)


    if (resul.length > 0) {
      notifier.notify({
        title: `${chosenVaccine.toUpperCase()} Vaccine Alert`,
        message: outputToHumanReadableMessage(resul),
      });

      const msg = {
        to: "snitin9489@gmail.com", // Change to your recipient
        from: "snitin8994@gmail.com", // Change to your verified sender
        subject: `${chosenVaccine.toUpperCase()} Vaccine Alert`,
        text: outputToHumanReadableMessage(resul),
        html: outputToHumanReadableMessage(resul,"html"),
      };

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

cron.schedule("*/5 * * * *", function () {
  checkVaccines();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
