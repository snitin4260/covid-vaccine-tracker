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
const differentAgeGroupsSameVaccine = require("./differentAgeGroup")
const singleAgeGroup = require("./singleAgeGroup")
const {CHOSEN_VACCINE, RUN_SINGLE} = require("./constants")


sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("App running")

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

    const  data = await response.json();

    if(!RUN_SINGLE) {
      return differentAgeGroupsSameVaccine(data)
    }
    else {
      return singleAgeGroup(data)

    }

  }

  const final = test();

  final.then((resul) => {
    console.log(resul)


    if (resul.length > 0) {
      notifier.notify({
        title: `${CHOSEN_VACCINE.toUpperCase()} Vaccine Alert`,
        message: outputToHumanReadableMessage(resul),
      });

      const msg = {
        to: "snitin9489@gmail.com", // Change to your recipient
        from: "snitin8994@gmail.com", // Change to your verified sender
        subject: `${CHOSEN_VACCINE.toUpperCase()} Vaccine Alert`,
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

cron.schedule("*/30 * * * *", function () {
  checkVaccines();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
