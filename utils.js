function outputToHumanReadableMessage(input, format='text') {
   let finalText='';
   let finalHtml=''

   for (let i =0; i< input.length;i++) {
       const item = input[0];
        finalText += `Hospital: ${item.name} pincode: ${item.pincode} date: ${item.date}  slot: ${item.time}\n`,
        finalHtml +=`<p>Hospital: ${item.name} pincode: ${item.pincode} date: ${item.date}  slot: ${item.time}</p> <br>`
    }
    if(format == 'text') {
        return finalText
    }

    return finalHtml;

}

module.exports = {
    outputToHumanReadableMessage
}