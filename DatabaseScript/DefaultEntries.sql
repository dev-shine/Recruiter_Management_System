-- Insertion of the default data

--Answers
INSERT INTO public."Answer"("AnswerId", "Answer", "SortOrder")VALUES (1,'Below Avg.' ,1);
INSERT INTO public."Answer"("AnswerId", "Answer", "SortOrder")VALUES (2,'Average',2 );
INSERT INTO public."Answer"("AnswerId", "Answer", "SortOrder")VALUES (3,'Good',3);
INSERT INTO public."Answer"("AnswerId", "Answer", "SortOrder")VALUES (4,'Excellent',4 );
INSERT INTO public."Answer"("AnswerId", "Answer", "SortOrder")VALUES (5,'N.A', 5);

-- InterviewResult

INSERT INTO public."InterviewResult"("InterviewResultId", "InterviewResult")VALUES (4,'May Be Selected');
INSERT INTO public."InterviewResult"("InterviewResultId", "InterviewResult")VALUES (3,'Pending');
INSERT INTO public."InterviewResult"("InterviewResultId", "InterviewResult")VALUES (2,'Selected');
INSERT INTO public."InterviewResult"("InterviewResultId", "InterviewResult")VALUES (1,'Rejected');

---  InterviewStatus

INSERT INTO public."InterviewStatus"("InterviewStatusId", "InterviewStatus")VALUES (1,'Confirmed');
INSERT INTO public."InterviewStatus"("InterviewStatusId", "InterviewStatus")VALUES (2,'Pending');
INSERT INTO public."InterviewStatus"("InterviewStatusId", "InterviewStatus")VALUES (3,'Selected');
INSERT INTO public."InterviewStatus"("InterviewStatusId", "InterviewStatus")VALUES (4,'May be selected');
INSERT INTO public."InterviewStatus"("InterviewStatusId", "InterviewStatus")VALUES (5,'Rejected');
INSERT INTO public."InterviewStatus"("InterviewStatusId", "InterviewStatus")VALUES (6,'Scheduled');

---Persons

INSERT INTO public."Person"("PersonId", "PersonName", "EmailId", "IsActive", "CCMailsId")VALUES (1,'Hetal.Mehta','hetal.mehta123@gmail.com',TRUE,'2,3');
INSERT INTO public."Person"("PersonId", "PersonName", "EmailId", "IsActive", "CCMailsId")VALUES (2,'John.Smith','john.smith@gmail.com',TRUE,'3');
INSERT INTO public."Person"("PersonId", "PersonName", "EmailId", "IsActive", "CCMailsId")VALUES (3,'Peter.Parker','peter.parker@gmail.com',TRUE,'1');


---User 

INSERT INTO public."Users"("UserId", "FirstName", "LastName", "ContactNumber", "Email", "Password", "IsActive", "IsDelete")VALUES (1,'Hetal','Mehta','7845125689','hetal.mehta@gmail.com','123456789',TRUE,FALSE);

    

























