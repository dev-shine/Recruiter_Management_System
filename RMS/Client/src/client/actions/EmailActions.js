import AppDispatcher from '../dispatcher/AppDispatcher';
import appConstants from '../constants/AppConstants';
import constants from '../constants/Constants';
import axios from 'axios';
var sqlData = [];
var adoData = [];
var mailData = [];

var EmailActions = {
  sendMail: function (mailValues) {
  var mail =  GetEmailData(mailValues);
},

sendCompositeMails : function (globalArray,interviews){
    sendCompositeMailsWithCategory(globalArray,interviews);
    }
}

function GetEmailData(mailValues)
{
  axios.get(appConstants.FIND_QA + mailValues.InterviewId)
  .then(function(categorydata){
      axios.get(appConstants.GET_EMAIL_DATA + mailValues.InterviewId)
    .then(function (maildata) {
    mailData = maildata;
    var mail = GetMailObjectsWithAllCategory(mailValues,categorydata.data,maildata,false);
    axios.post(appConstants.SENDMAIL_URL, mail)
    .then(function (values) {
             AppDispatcher.dispatch({
               actionType: constants.SEND_MAIL,
               text : 1,
               id : mailValues.InterviewId,
               status: 1
             });
           axios({
               url: appConstants.UPDATE_REPORTSHARED + '/' + mailValues.InterviewId,
               method: 'PUT',
               crossOrigin: true,
               headers: {
                   'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
               }
           })
           .then(function (interview) {
                 AppDispatcher.dispatch({
                   actionType: appConstants.UPDATE_REPORTSHARED,
                   text: interview.data,
                   status: 2
                 });
           });
      });
    });
  });
}

function GetMailObjectsWithAllCategory(interviewRecord, categoryData, emailData, isComposite)
  {
      let sql = [];
      let ado = [];
      let categories = [];
      let maildata = [];
      if (isComposite) {
          categories = categoryData.data.filter(a=>a.InterviewId === interviewRecord.InterviewId);
          maildata = emailData.data.filter(x=>x.InterviewId === interviewRecord.InterviewId);
      }
      else {
          categories = categoryData;
          maildata = emailData.data;
      }

      let mail =
        {
            from: constants.FORGOTPASSWORD_FROM,
            to: ' ',
            subject: constants.MAIL_SUBJECT + ' ( '+ new Date().toDateString() + ' )',
            candidates: [{
                SRNO : 1,
                Name : interviewRecord['Name'] == null ? '' : interviewRecord['Name'],
                Rating : interviewRecord['InterviewScore'] == null ? '' : interviewRecord['InterviewScore'] + ' of 10',
                Result : interviewRecord['InterviewResult'] == null ? '' : interviewRecord['InterviewResult'],
                PhoneNumber : interviewRecord['PhoneNumber'] ==  null ? '' : interviewRecord['PhoneNumber'],
                EmailId : interviewRecord['EmailId'] == null ? '' : interviewRecord['EmailId'],
                InterviewDate : interviewRecord['ScheduleDate'] == null ? '' : interviewRecord['ScheduleDate'],
                InterviewTime : interviewRecord['ScheduleTime'] ==  null ? '' : interviewRecord['ScheduleTime'],
            }],
            Categories : categories,
            EmailData : maildata,
            html : ''
        }

      return mail;
  }

function sendCompositeMailsWithCategory(globalArray, propinterviews) {
  var interviews = globalArray;
  if (globalArray.length !== 0) {
      axios.post(appConstants.FIND_QA_MULTIPLE, globalArray)
        .then(function (categoryData) {
        axios.post(appConstants.GET_EMAIL_DATA_MULTIPLE, globalArray)
        .then(function (emaildata_Multiple) {
          mailData = emaildata_Multiple;
          var mailRecords = [];
          var totalInterviewsToSend = [];
          var totalTomails = [];
          var recordsHavingSameToMail = [];
          var interviewRecord = [];

          for (var i = 0 ; i < interviews.length ; i++) {
            interviewRecord = propinterviews.filter(y => y.InterviewId === interviews[i]);
            totalInterviewsToSend.push(interviewRecord[0]);
            totalTomails.push(interviewRecord[0].ToEmail);
          }

          var sorted_arr = totalTomails.slice().sort();
          var resultsOfSimilarRecipients = [];
          for (var i = 0; i < totalTomails.length - 1; i++) {
              if (sorted_arr[i + 1] === sorted_arr[i]) {
                  resultsOfSimilarRecipients.push(sorted_arr[i]);
              }
          }

          var resultsOfSimilarRecipients = resultsOfSimilarRecipients.filter(function(itm, i, resultsOfSimilarRecipients) {
              return i === resultsOfSimilarRecipients.indexOf(itm);
          });

          totalTomails = totalTomails.filter( function( el ) {
              return resultsOfSimilarRecipients.indexOf( el ) < 0;
          } );

          if (totalTomails.length !== 0) {
              ////Do code for single mail  send.
            var totaluniqueRecords = [];
            for (var i = 0; i < totalTomails.length; i++) {
              let interviewUniqueRows = totalInterviewsToSend.filter(y => y.ToEmail === totalTomails[i]); /// Records which has unique Tomails.
              totaluniqueRecords.push(interviewUniqueRows[0]);
            }
              let mailCounts = 0;
              for (var t = 0; t < totaluniqueRecords.length; t++)
              {
                  let mail =  GetMailObjectsWithAllCategory(totaluniqueRecords[t],categoryData,mailData, true);
                  axios.post(appConstants.SENDMAIL_URL, mail)
                  .then(function (values) {
                    mailCounts = mailCounts + 1;
                    axios({
                        url: appConstants.UPDATE_REPORTSHARED + '/' + mail.EmailData[0].InterviewId,
                        method: 'PUT',
                        crossOrigin: true,
                        headers: {
                            'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                        }
                    })
                    .then(function (interview) {
                          AppDispatcher.dispatch({
                            actionType: appConstants.UPDATE_REPORTSHARED,
                            text: interview.data
                          });
                    });
                });
              }
          }

          if (resultsOfSimilarRecipients.length !== 0) {
              //// Do code for composite mail.
              var totalRowsofSimilarRecipients = [];
              for (var i = 0; i < resultsOfSimilarRecipients.length; i++) {
                let interviewrowsComposite =  totalInterviewsToSend.filter(y => y.ToEmail === resultsOfSimilarRecipients[i]); //// Records with similar mail recipients.
                totalRowsofSimilarRecipients.push(interviewrowsComposite);
              }

              for (var record = 0; record < totalRowsofSimilarRecipients.length; record++) {
                    var totalMails = [];
                for (var subrecords = 0; subrecords < totalRowsofSimilarRecipients[record].length; subrecords++) {
                  if (totalRowsofSimilarRecipients[record][subrecords] !== undefined) {
                      let mail = GetMailObjectsWithAllCategory(totalRowsofSimilarRecipients[record][subrecords], categoryData ,mailData, true);
                              totalMails.push(mail);
                              axios({
                                  url: appConstants.UPDATE_REPORTSHARED + '/' + mail.EmailData[0].InterviewId,
                                  method: 'PUT',
                                  crossOrigin: true,
                                  headers: {
                                      'Authorization': appConstants.AUTH_TOKEN + localStorage.jwt
                                  }
                              })
                              .then(function (interview) {
                                    AppDispatcher.dispatch({
                                      actionType: appConstants.UPDATE_REPORTSHARED,
                                      text: interview.data
                                    });
                              });
                        }
                    }
                ////Do code sending mail. Call service for sending mail.

                axios.post(appConstants.SENDMAIL_MULTIPLE_URL, totalMails)
                .then(function (values) {
                });
              }
            }
        });
    });
      AppDispatcher.dispatch({
        actionType: constants.SEND_MAIL,
        text : globalArray.length,
        status: 2
    });
    }
    else {
      {
        AppDispatcher.dispatch({
          actionType: constants.SEND_MAIL,
          text : constants.SEND_MAIL_SUCCESS
        });
      }
    }
  }

module.exports = EmailActions;