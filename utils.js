const {CHOSEN_VACCINE, CHOSEN_DOSE} = require("./constants")

function outputToHumanReadableMessage(input, format='text') {
   let finalText= `${CHOSEN_VACCINE.toUpperCase()} vaccine  DOSE ${CHOSEN_DOSE} alert \n`;
   let finalHtml=`<h1>${CHOSEN_VACCINE.toUpperCase()} vaccine  DOSE ${CHOSEN_DOSE} alert</h1>`

   for (let i =0; i< input.length;i++) {
       const item = input[i];
        finalText += ` pincode: ${item.pincode} Hospital: ${item.name} date: ${item.date}  slot: ${item.time}  dose: ${item.dose}\n`,
        finalHtml +=`<p> pincode: <strong>${item.pincode}</strong> Hospital: ${item.name} date: ${item.date}  slot: ${item.time} dose: ${item.dose}</p> <br>`
    }
    if(format == 'text') {
        return finalText
    }

    return finalHtml;

}


function checkMailAlreadySent(alreadySentCenters) {

}


function addCenterToGlobalList(){    
}




module.exports = {
    outputToHumanReadableMessage
}