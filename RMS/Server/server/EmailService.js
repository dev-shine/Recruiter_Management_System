let db = require('./pghelper');
let mailer = require('nodemailer');
var fs = require('fs');
require('string.format');
var constants = require('./../Constants/Constants.js');

// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport(constants.SMTP, {
    service: constants.GMAIL,
    auth: {
        user: constants.EMAILID_TO_SENDMAIL,
        pass: constants.PASSWORD_TO_SENDMAIL
    }
});

let sendMail = (req, res, next) => {
let emailobjects = req.body;
let candidateRecord = req.body.candidates[0];

let unique = [];
var categoryNames = emailobjects.Categories.map(function(item){return item.DisplayName;});
unique = categoryNames.filter(function(item, i, ar){
    return ar.indexOf(item) === i;
});

let tds = '';
let categoryHeaders = '';
for(var x = 0; x < unique.length; x++)
{
  var category = emailobjects.Categories.filter(function(item, i, ar){
    return item.DisplayName=== unique[x];
  });

  let lis = '';
  for(var y = 0; y < category.length; y++)
  {
    let li = '<li>' + '<b>'+ category[y].Question + '</b> : ' + category[y].Answer + ' <br/>' + category[y].remarks + '<br/>' + '</li>';
    lis = lis + li;
  }

  var td = "<td><ul style='list-style-type: none' id=''>" + lis + "</ul></td>"
  tds = tds + td;
  let header = '';
  header = '<th>'+ unique[x] + '</th>';
  categoryHeaders = categoryHeaders + header;
}

var data = fs.readFileSync('email.txt');
var params = {
sr_no : candidateRecord.SRNO,
name : candidateRecord.Name,
rating : candidateRecord.Rating,
result : candidateRecord.Result,
phone_number : candidateRecord.PhoneNumber,
email_id : candidateRecord.EmailId,
interview_date : candidateRecord.InterviewDate,
interview_time : candidateRecord.InterviewTime,
Recommendations : emailobjects.EmailData[0].Recommendations == null ? "" :emailobjects.EmailData[0].Recommendations,
Receiver_Name :  emailobjects.EmailData[0].PersonName,
Categories : tds,
CategoryHeaders : categoryHeaders
}

    let mail = {
        from: emailobjects.from,
        to: emailobjects.EmailData[0].ToEmail,
        cc : emailobjects.EmailData[0].CCMails,
        subject: emailobjects.subject,
        text: emailobjects.text,
        html: data.toString().format(params)
    }

      //console.log(mail);
      smtpTransport.sendMail(mail);
      res.send('1');
      //.then(() => res.send('1'));
};

let sendCompositeMail = (req, res, next) => {
  //console.log(req.body);
    let emailobjects = req.body;
   var rowArray = '';
   var heads = [];
for (var row = 0; row < emailobjects.length; row++) {
var categoryNames = emailobjects[row].Categories.map(function(item){return item.DisplayName;});
  //heads = heads.push(categoryNames);
  heads = heads.concat(categoryNames);
}

let unique = [];
//var categoryNames = emailobjects[row].Categories.map(function(item){return item.DisplayName;});
unique = heads.filter(function(item, i, ar){
    return ar.indexOf(item) === i;
});

   for (var row = 0; row < emailobjects.length; row++) {
// ////Do code for merging the Mail Template.
   let candidateRecord = emailobjects[row].candidates[0];
   let category_data = '';
// ----------------------------------------------------------------------------

   let tds = '';
   var categoryHeaders = '';
   for(var x = 0; x < unique.length; x++)
   {
     var category = emailobjects[row].Categories.filter(function(item, i, ar){
       return item.DisplayName=== unique[x];
     });



     let lis = '';
     for(var y = 0; y < category.length; y++)
     {
       let li = '<li>' + '<b>'+ category[y].Question + '</b> : ' + category[y].Answer + ' <br/>' + category[y].remarks + '<br/>' + '</li>';
       lis = lis + li;
     }
    //  var td = '';
    //  if(category.length == 0)
    //  {
    //    td = '<td><ul style='list-style-type: none' id=''>N.AVAILABLE</ul></td>'
    //  }
    //  else {
    //    td = '<td><ul style='list-style-type: none' id=''>' + lis + '</ul></td>'
    //  }
     var td = "<td><ul style='list-style-type: none' id=''>" + lis + "</ul></td>";
     tds = tds + td;
     let header = '';
     header = '<th>'+ unique[x] + '</th>';
     categoryHeaders = categoryHeaders + header;
   }

  // ------------------------------------------------------------------------------------

//         /////Read the tableTemplate File.
             var tableRows = fs.readFileSync('TRTemplate.txt');
             var params = {
             sr_no : row + 1,
             name : candidateRecord.Name,
             rating : candidateRecord.Rating,
             result : candidateRecord.Result,
             phone_number : candidateRecord.PhoneNumber,
             email_id : candidateRecord.EmailId,
             interview_date : candidateRecord.InterviewDate,
             interview_time : candidateRecord.InterviewTime,
             Recommendations : emailobjects[row].EmailData[0].Recommendations == null ? '' : emailobjects[row].EmailData[0].Recommendations,
             Receiver_Name :  emailobjects[row].EmailData[0].PersonName,
             CategoryColumns : tds,
             }

            var tablerow = tableRows.toString().format(params);
            rowArray = rowArray + tablerow;
            }

            //console.log('rowArray' + rowArray);
             var tableHeaderParams = {
                  CategoryHeaders : categoryHeaders,
                }
            var tableHeader = fs.readFileSync('TableHeaderTemplate.txt');
            var tableParams = {
                    RowData : rowArray,
                    TableHeader :   tableHeader.toString().format(tableHeaderParams)
            }

            //console.log(tableHeader.toString().format(tableHeaderParams));

            var emailTable = fs.readFileSync('EmailTable.txt');
            var finalTable = emailTable.toString().format(tableParams);
            var emailParams = {
              Receiver_Name :  emailobjects[0].EmailData[0].PersonName,
              Tables : finalTable
            }

              //console.log(finalTable);
            var emaildata = fs.readFileSync('EmailTemplate.txt');
            let mail = {
                from: emailobjects[0].from,
                to: emailobjects[0].EmailData[0].ToEmail,
                cc : emailobjects[0].EmailData[0].CCMails,
                subject: emailobjects[0].subject,
                html: emaildata.toString().format(emailParams)
            }
             //res.send('2');

          smtpTransport.sendMail(mail, function(error, response) {
              if (error) {
                console.log('This is the error log response for send Mail.');
                  console.log(error);
                  //res.send('send composite mail response.');
                   response.send('2');

              } else {
                  console.log('Message sent: ' + response.message);
              }
              smtpTransport.close();
          });
};

exports.sendMailNew = sendMail;
exports.sendCompositeMail = sendCompositeMail;