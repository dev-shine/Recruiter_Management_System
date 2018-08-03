var constants = {
    DATABASE_URL: 'postgres://postgres:abc@123@192.168.1.220:5432/RecruiterManagementSystem',
    SECRET_VALUE: 'ABC',
    OK: 'ok',
    OK_STATUS: 'Ok',
    DEFAULT_DATE: '0001-01-01',
    PASSWORD: 'password',
    SMTP: 'SMTP',
    GMAIL: 'Gmail',
    EMAILID_TO_SENDMAIL: 'test.ansibytecode@gmail.com',
    PASSWORD_TO_SENDMAIL: 'Hetal@123#',
    FORGOTPASSWORD_FROM: 'Hetal Mehta <test.ansibytecode@gmail.com>',
    FORGOTPASSWORD_SUBJECT: 'Recruiter Management System: Reset Password Request',

    //// Answer
    ANSWERGETALL_CACHEKEY : 'AnswerGetAll_CacheKey',

    //// Interview result
    INTERVIEWRESULTGETALL_CACHEKEY : 'InterviewResultGetAll_CacheKey',
    INTERVIEWRESULT_CACHEKEY : 'InterviewResult_',

    //// Interview status
    INTERVIEWSTATUSGETALL_CACHEKEY : 'InterviewStatusGetAll_CacheKey',

    //// Person
    PERSONGETALL_CACHEKEY : 'PersonGetAll_CacheKey',
    PERSON_CACHEKEY : 'Person_',

    //// Interview Schedule
    INTERVIEWSCHEDULEGETALL_CACHEKEY : 'InterviewScheduleGetAll_CacheKey',
    INTERVIEWSCHEDULE_CACHEKEY : 'InterviewSchedule_',
    INTERVIEWSCHEDULEACTIVEGETALL_CACHEKEY : 'InterviewScheduleActiveGetAll_CacheKey',
    INTERVIEWSCHEDULE_INSERT : 'InterviewSchedule Insert',
    INTERVIEWSCHEDULE_UPDATE : 'InterviewSchedule Update',
    INTERVIEWSCHEDULE_DELETE : 'InterviewSchedule Delete',

    //// Question
    QUESTIONGETALL_CACHEKEY : 'QuestionGetAll_CacheKey',
    QUESTION_CACHEKEY : 'Question_',
    QUESTIONCATEGORYFORQUESTIONS_CACHEKEY : 'QuestionCategoryForQuestions_CacheKey',
    GETRESPONSEDATA_CACHEKEY : 'GetResponseData_CacheKey',
    GETSQLDATA_CACHEKEY : 'GetSQLData_CacheKey',
    GETSQLDATAWITHCATEGORY_CACHEKEY : 'GetSQLDataWithCategory_CacheKey',
    GETMULTIPLECATEGORIES_CACHEKEY : 'GetMultipleCategories_CacheKey',
    GETSQLDATAMULTIPLE_CACHEKEY : 'GetSQLDataMultiple_CacheKey',
    GETADODATA_CACHEKEY: 'GetADOData_CacheKey',
    GETADODATAMULTIPLE_CACHEKEY: 'GetADODataMultiple_CacheKey',
    GETMAILDATA_CACHEKEY: 'GetMailData_CacheKey',
    GETMAILDATAMULTIPLE_CACHEKEY: 'GetMailDataMultiple_CacheKey',
    GETALLQUESTIONANDRESPONSEDATA_CACHEKEY: 'GetAllQuestionAndResponseData_CacheKey',

    //// Question category
    QUESTIONCATEGORYGETALL_CACHEKEY : 'QuestionCategoryGetAll_CacheKey',
    QUESTIONCATEGORY_CACHEKEY : 'QuestionCategory_',
    GETACTIVECATEGORIES_CACHEKEY : 'GetActiveCategories_CacheKey',
    GETALLACTIVECATEGORIES_CACHEKEY : 'GetAllActiveCategories_CacheKey'
};

module.exports = constants;