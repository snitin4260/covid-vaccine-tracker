function outputToHumanReadableMessage(input, format='text') {
   let finalText='';
   let finalHtml=''

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