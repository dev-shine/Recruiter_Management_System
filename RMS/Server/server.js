var webpack = require('webpack');
var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var compression = require('compression');
var bodyParser = require('body-parser');
var interviews = require('./server/InterviewSchedule');
var mails = require('./server/EmailService');
var interviewStatus = require('./server/InterviewStatus');
var questionCategory = require('./server/QuestionCategory');
var person = require('./server/Person');
var interviewResult = require('./server/InterviewResult');
var answer = require('./server/Answer');
var questions = require('./server/Question');
var users = require('./server/User');
var config = require('./server/config');
var jwt = require('express-jwt');
var cors = require('cors');

app.use(compression());
app.use('/', express.static(__dirname + '/www'));
app.use('/', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// var httpServer = http.createServer(app,function(req,res){
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('Hello,myNewapplication world! [helloworld sample; iisnode version is ' + process.env.IISNODE_VERSION + ', node version is ' + process.version + ']');
// }).listen(process.env.PORT);

http.createServer(app,function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello,myapplication world! [helloworld sample; iisnode version is ' + process.env.IISNODE_VERSION + ', node version is ' + process.version + ']');
// }).listen(process.env.PORT);
}).listen(process.env.PORT || 3001);

////app.listen(process.env.PORT||7777, function(err) {
    ////if (err) {
////      return console.error(err);
    ////}

////    console.log('Listening at http://localhost:3001/');
/////})

////API security
 var jwtCheck = jwt({
     secret: config.secret
 });

app.use('/api', jwtCheck);

//// Image upload
app.post('/api/imageUpload',function (req, res) {
    var file = __dirname + '/uploads/';
    if (!fs.existsSync(file)){
      fs.mkdirSync(file);
    }
    var hrTime = process.hrtime();
    var tickTime = hrTime[0] * 1000000 + hrTime[1] / 1000;
    var uri = req.body.data_uri;
    var fileSource = req.body.filename;
    var fileNameArray = fileSource.split('.');
    var fileName = fileNameArray[0];
    var extension = fileNameArray[1];
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = uri.match(regex);
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');
    fs.writeFileSync(file + req.body.filename, buffer);
    res.json({result: 'ok'})
});

//// API
//// InterviewSchedule API
app.get('/api/InterviewSchedule', interviews.findAll);
app.get('/ResumeDownload/:id', interviews.downloadResume);
app.get('/api/InterviewSchedule/:id', interviews.findById);
app.get('/api/InterviewResult/:id', interviews.resultById);
app.post('/api/resumeRemove', interviews.resumeRemove);
app.post('/api/InterviewSchedule', interviews.createItem);
app.put('/api/InterviewSchedule', interviews.updateItem);
app.delete('/api/InterviewSchedule/:id', interviews.deleteItem);
app.put('/api/InterviewSchedule/updatereportshared/:id', interviews.updateReportShared);
app.get('/api/InterviewStatus', interviewStatus.findAll);
app.post('/InterviewSchedule/sendmail', mails.sendMailNew);
app.post('/InterviewSchedule/sendcompositemail', mails.sendCompositeMail);
app.post('/api/MonthlyInterviews', interviews.monthlyInterviews);

//// InterviewResult API
app.get('/api/InterviewResult', interviewResult.findAll);

//// User API
app.get('/api/User', users.findAll);
app.get('/api/User/:id', users.findById);
app.post('/api/User', users.createItem);
app.post('/User/LoginDetails', users.loginDetails);
app.post('/api/User/ChangePassword', users.changePassword);
app.post('/User/ForgotPassword', users.forgotPassword);
app.put('/api/User', users.updateItem);
app.delete('/api/User/:id', users.deleteItem);

//// Question API
app.get('/api/QuestionGetAll', questions.questionGetAll);
app.get('/api/QuestionGetById/:id', questions.questionGetById);
app.get('/api/QuestionCategoryGetAll', questions.questionCategoryGetAll);
app.post('/api/QuestionInsert', questions.questionInsert);
app.put('/api/QuestionUpdate', questions.questionUpdate);
app.delete('/api/QuestionDelete/:id', questions.questionDelete);
app.get('/api/Question/:id', questions.findByIdFromAnswer);
app.get('/Question/AnswersSQL/:id', questions.findQuestionAnswersSQL); // Unused
app.get('/Question/AnswersADO/:id', questions.findQuestionAnswersADO); // Unused
app.get('/Question/Answers/:id',questions.findQuestionAnswers);
app.post('/Question/AnswersMultiple',questions.findQuestionAnswersMultiple);
app.get('/Question/EmailData/:id', questions.getEmailData);
app.post('/Question/AnswersSQLMultiple', questions.findQuestionAnswersSQLForMultiple);
app.post('/Question/AnswersADOMultiple', questions.findQuestionAnswersADOForMultiple);
app.post('/Question/EmailDataMultiple', questions.getMultipleEmailData);
app.post('/api/Question', questions.createItem);
app.get('/api/Question/GetAllQuestionAndResponseData/:id', questions.getAllQuestionAndResponseData);

//// Answer API
app.get('/api/Answer', answer.findAll);

////Person API
app.get('/api/Person', person.findAll);
app.post('/api/Person/getInterviewSchedule', person.findByDateAndPerson);
app.get('/api/Person/findByPersonId/:id', person.findByPersonId);
app.post('/api/Person/getPersonWiseInterviewCount', person.getPersonWiseInterviewCount);

///// Question Category
app.get('/api/QuestionCategory', questionCategory.findAll);
app.get('/api/QuestionCategoryActive/:id', questionCategory.getActiveCategories);
app.get('/api/QuestionCategoryActiveGetAll', questionCategory.getAllActiveCategories);
app.post('/api/QuestionCategory', questionCategory.createItem);
app.get('/api/QuestionCategory/:id', questionCategory.findById);
app.put('/api/QuestionCategory', questionCategory.updateItem);
app.delete('/api/QuestionCategory/:id', questionCategory.deleteItem);
