--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

-- Started on 2017-11-02 10:50:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12387)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2267 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 217 (class 1255 OID 84786)
-- Name: answergetall(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION answergetall() RETURNS TABLE("Answer" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT 
	"Answer"."Answer"
    FROM 
	"Answer"
	ORDER BY "Answer"."SortOrder" ASC;
	

    
END;
$$;


ALTER FUNCTION public.answergetall() OWNER TO postgres;

--
-- TOC entry 218 (class 1255 OID 84787)
-- Name: getadodata(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getadodata(interviewid bigint) RETURNS TABLE("Question" text, "Answer" text, remarks text)
    LANGUAGE plpgsql
    AS $$
BEGIN
     RETURN QUERY
  SELECT
           
           "Questions"."Question",
           "Answer"."Answer",
           "Response"."Remarks" as "remarks"
            FROM  ("Questions" NATURAL JOIN "Response" NATURAL JOIN "Answer")
            WHERE 
            (
              "Response"."InterviewId" = InterviewId
              AND 
              "Questions"."QuestionCategoryId" = 2
            );
   

END;
$$;


ALTER FUNCTION public.getadodata(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 220 (class 1255 OID 84788)
-- Name: getadodatamultiple(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getadodatamultiple(interviewid text) RETURNS TABLE("Question" text, "Answer" text, remarks text, "InterviewId" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
     RETURN QUERY
  SELECT
           
           "Questions"."Question",
           "Answer"."Answer",
           "Response"."Remarks" as "remarks",
           "Response"."InterviewId" as "InterviewId"
           
            FROM  ("Questions" NATURAL JOIN "Response" NATURAL JOIN "Answer")
            WHERE 
            (
              "Response"."InterviewId" in (SELECT CAST ( regexp_split_to_table(interviewid, E',') AS bigint ))
              --InterviewId
              AND 
              "Questions"."QuestionCategoryId" = 2
            );
   

END;
$$;


ALTER FUNCTION public.getadodatamultiple(interviewid text) OWNER TO postgres;

--
-- TOC entry 216 (class 1255 OID 84789)
-- Name: getallquestionandresponsedata(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getallquestionandresponsedata(interviewid bigint) RETURNS TABLE("RowNumber" bigint, "QuestionId" bigint, "Question" text, type text, remarks text, "IsUpdate" boolean, "QuestionCategoryId" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN  
    RETURN QUERY
       SELECT 
	ROW_NUMBER() OVER (Partition By "Questions"."QuestionCategoryId" ORDER BY "Questions"."SortOrder", "Questions"."Question" ASC) AS "RowNumber",
	"Questions"."QuestionId",
	"Questions"."Question",
	(CASE WHEN ("Answer"."Answer" != '') THEN "Answer"."Answer" ELSE 'N.A' END) AS type,
	(CASE WHEN ("Response"."Remarks" != '') THEN "Response"."Remarks" ELSE 'N/A' END) AS remarks,
	(CASE WHEN ("Response"."IsUpdate") THEN "Response"."IsUpdate" ELSE false END) AS "IsUpdate",
	"Questions"."QuestionCategoryId"
FROM "Questions" 
LEFT JOIN "Response" ON "Questions"."QuestionId" = "Response"."QuestionId" and "Response"."InterviewId" = Interviewid
LEFT JOIN "Answer" ON "Response"."AnswerId" = "Answer"."AnswerId"
WHERE "Questions"."IsDelete" = False AND "Questions"."IsActive" = True;
END;
$$;


ALTER FUNCTION public.getallquestionandresponsedata(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 219 (class 1255 OID 84790)
-- Name: getinterviewresult(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getinterviewresult() RETURNS TABLE(interviewresultid bigint, interviewresult text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
        SELECT 
		"InterviewResultId" as "InterviewResultId","InterviewResult" as "InterviewResult" 
        FROM 
		"InterviewResult"
	ORDER BY
		"InterviewResult";
END;
$$;


ALTER FUNCTION public.getinterviewresult() OWNER TO postgres;

--
-- TOC entry 221 (class 1255 OID 84791)
-- Name: getinterviewstatus(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getinterviewstatus() RETURNS TABLE(interviewstatusid bigint, interviewstatus text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
        SELECT "InterviewStatusId", "InterviewStatus" FROM "InterviewStatus";
END;
$$;


ALTER FUNCTION public.getinterviewstatus() OWNER TO postgres;

--
-- TOC entry 222 (class 1255 OID 84792)
-- Name: getmaildata(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getmaildata(interviewid bigint) RETURNS TABLE("ToEmail" text, "PersonName" text, "Recommendations" text, "CCMails" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY
SELECT (SELECT "EmailId" FROM "Person" WHERE "PersonId" = InterviewSchedule."ToEmail") AS "ToEmail",
(SELECT "Person"."PersonName" FROM "Person" WHERE "PersonId" = InterviewSchedule."ToEmail")AS "PersonName", 
InterviewSchedule."Recommendations",
(SELECT string_agg(CAST("EmailId" as VARCHAR), ',')FROM
(SELECT "EmailId" FROM "Person" WHERE "PersonId" IN (SELECT CAST ( regexp_split_to_table((

SELECT 
CASE WHEN "CCEmail" = '' THEN NULL
            WHEN "CCEmail" IS NULL THEN NULL
            ELSE "CCEmail"
END
 FROM InterviewSchedule WHERE "InterviewId" = interviewid

--select "CCEmail" FROM InterviewSchedule WHERE "InterviewId" = interviewid
), E',') AS BIGINT )))AS emaildemo) AS "CCMails"
FROM InterviewSchedule 
WHERE InterviewSchedule."InterviewId" = interviewid;
   

END;
$$;


ALTER FUNCTION public.getmaildata(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 223 (class 1255 OID 84793)
-- Name: getmaildatamultiple(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getmaildatamultiple(interviewid bigint) RETURNS TABLE("ToEmail" text, "PersonName" text, "CCMails" text, "InterviewId" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY
SELECT (SELECT "EmailId" FROM "Person" WHERE "PersonId" = InterviewSchedule."ToEmail") AS "ToEmail",
InterviewSchedule."InterviewId",
(SELECT "Person"."PersonName" FROM "Person" WHERE "PersonId" = InterviewSchedule."ToEmail")AS "PersonName", 
(SELECT string_agg(CAST("EmailId" as VARCHAR), ',')FROM
(SELECT "EmailId" FROM "Person" WHERE "PersonId" IN (SELECT CAST ( regexp_split_to_table((select "CCEmail" FROM InterviewSchedule WHERE "InterviewId" = interviewid), E',') AS BIGINT )))AS emaildemo) AS "CCMails"
FROM InterviewSchedule 
WHERE 
InterviewSchedule."InterviewId"  in (SELECT CAST ( regexp_split_to_table(interviewid, E',') AS bigint ));
--InterviewSchedule."InterviewId" = interviewid;
   

END;
$$;


ALTER FUNCTION public.getmaildatamultiple(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 224 (class 1255 OID 84794)
-- Name: getmaildatamultiple(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getmaildatamultiple(interviewid text) RETURNS TABLE("ToEmail" text, "PersonName" text, "InterviewId" bigint, "Recommendations" text, "CCMails" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY
SELECT (SELECT "EmailId" FROM "Person" WHERE "PersonId" = InterviewSchedule."ToEmail") AS "ToEmail",
(SELECT "Person"."PersonName" FROM "Person" WHERE "PersonId" = InterviewSchedule."ToEmail")AS "PersonName",
InterviewSchedule."InterviewId" as "InterviewId",
InterviewSchedule."Recommendations" as "Recommendations",
(select (select string_agg("EmailId", ', ') from
(SELECT * FROM "Person")table2
INNER JOIN
(SELECT CAST ( regexp_split_to_table((
 CASE WHEN InterviewSchedule."CCEmail" = '' THEN null
            WHEN InterviewSchedule."CCEmail" is null THEN null
            ELSE InterviewSchedule."CCEmail"
       END
), E',') AS bigint ))table1
ON (table2."PersonId" = table1.regexp_split_to_table)) as mail) as "CCEmail"
FROM InterviewSchedule 
WHERE InterviewSchedule."InterviewId"  in (SELECT CAST ( regexp_split_to_table(interviewid, E',') AS bigint ));
END;
$$;


ALTER FUNCTION public.getmaildatamultiple(interviewid text) OWNER TO postgres;

--
-- TOC entry 225 (class 1255 OID 84795)
-- Name: getmultiplecategories(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getmultiplecategories(interviewid text) RETURNS TABLE("Question" text, "Answer" text, remarks text, "InterviewId" bigint, "QuestionCategoryName" text, "DisplayName" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
     RETURN QUERY
  
           
SELECT
"Questions"."Question",
"Answer"."Answer",
"Response"."Remarks",
"Response"."InterviewId",
"QuestionCategory"."QuestionCategoryName",
"QuestionCategory"."DisplayName"
FROM "Response"  
INNER JOIN "Questions" on "Response"."QuestionId" = "Questions"."QuestionId"
INNER JOIN "Answer" on "Response"."AnswerId" = "Answer"."AnswerId"
INNER JOIN "QuestionCategory" ON "Questions"."QuestionCategoryId" = "QuestionCategory"."QuestionCategoryId"
WHERE "Response"."InterviewId" in (SELECT CAST ( regexp_split_to_table(interviewid, E',') AS bigint ));
   

END;
$$;


ALTER FUNCTION public.getmultiplecategories(interviewid text) OWNER TO postgres;

--
-- TOC entry 267 (class 1255 OID 84947)
-- Name: getpersonwiseinterviewcount(text, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getpersonwiseinterviewcount(personid text, interviewstatusid bigint) RETURNS TABLE("RowNumber" bigint, "PersonName" text, "InterviewCount" bigint, "InterviewStatusCount" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  CASE WHEN(PersonId = '0' AND InterviewStatusId = 0) THEN
    RETURN QUERY
	SELECT  
	  ROW_NUMBER() OVER (ORDER BY "Person"."PersonName") AS "RowNumber",
	  "Person"."PersonName",
	  Count(interviewschedule."InterviewId") AS "InterviewCount"	,
	  Count(interviewschedule."InterviewStatusId") AS "InterviewStatusCount"		
	FROM "Person"
	  LEFT OUTER JOIN interviewschedule ON "Person"."PersonId" = interviewschedule."ToEmail"
	WHERE 
	  interviewschedule."IsDelete" = False
	Group by "Person"."PersonName";
	

  WHEN(PersonId != '0' AND InterviewStatusId = 0) THEN
    RETURN QUERY
	SELECT 
	  ROW_NUMBER() OVER (ORDER BY "Person"."PersonName") AS "RowNumber",
	  "Person"."PersonName", 
	  Count(interviewschedule."InterviewId") AS "InterviewCount",
	  Count(interviewschedule."InterviewStatusId") AS "InterviewStatusCount"
	FROM 
	  "Person"
	  LEFT OUTER JOIN interviewschedule ON interviewschedule."ToEmail" = "Person"."PersonId"
	  LEFT OUTER JOIN "InterviewStatus" ON "InterviewStatus"."InterviewStatusId" = interviewschedule."InterviewStatusId"
	WHERE 
	  "Person"."PersonId" IN(SELECT CAST ( regexp_split_to_table(PersonId, E',') AS bigint ))
	  AND interviewschedule."IsDelete" = False
	Group by "Person"."PersonName";
	
	
  WHEN(PersonId = '0' AND InterviewStatusId != 0) THEN
    RETURN QUERY
	SELECT 
	  ROW_NUMBER() OVER (ORDER BY "Person"."PersonName") AS "RowNumber",
	  "Person"."PersonName", 
	  Count(interviewschedule."InterviewId") AS "InterviewCount",
	  Count(interviewschedule."InterviewStatusId") AS "InterviewStatusCount"
	FROM 
	  "Person"
	  LEFT OUTER JOIN interviewschedule ON interviewschedule."ToEmail" = "Person"."PersonId"
	  LEFT OUTER JOIN "InterviewStatus" ON "InterviewStatus"."InterviewStatusId" = interviewschedule."InterviewStatusId"
	WHERE 
	  interviewschedule."InterviewStatusId" = InterviewStatusId
	  AND interviewschedule."IsDelete" = False
	Group by "Person"."PersonName";
  ELSE
    RETURN QUERY
	SELECT 
	  ROW_NUMBER() OVER (ORDER BY "Person"."PersonName") AS "RowNumber",
	  "Person"."PersonName", 
	  Count(interviewschedule."InterviewId") AS "InterviewCount",
	  Count(interviewschedule."InterviewStatusId") AS "InterviewStatusCount"
	FROM 
	  "Person"
	  LEFT OUTER JOIN interviewschedule ON interviewschedule."ToEmail" = "Person"."PersonId"
	  LEFT OUTER JOIN "InterviewStatus" ON "InterviewStatus"."InterviewStatusId" = interviewschedule."InterviewStatusId"
	WHERE 
	  "Person"."PersonId" IN(SELECT CAST ( regexp_split_to_table(PersonId, E',') AS bigint ))
	  AND interviewschedule."InterviewStatusId" = InterviewStatusId
	  AND interviewschedule."IsDelete" = False
	Group by "Person"."PersonName";
	
END CASE;
END;
$$;


ALTER FUNCTION public.getpersonwiseinterviewcount(personid text, interviewstatusid bigint) OWNER TO postgres;

--
-- TOC entry 227 (class 1255 OID 84797)
-- Name: getresponsecountofinterviewquestions(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getresponsecountofinterviewquestions(interviewid bigint) RETURNS TABLE("Count" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
     RETURN QUERY
select Count(*) as "Count" from "Response" where "InterviewId" = interviewid;
   

END;
$$;


ALTER FUNCTION public.getresponsecountofinterviewquestions(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 84798)
-- Name: getresponsedata(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getresponsedata(interviewid bigint) RETURNS TABLE("RowNumber" bigint, "QuestionId" bigint, "Question" text, type text, remarks text, "IsUpdate" boolean, "QuestionCategoryId" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN    
	IF EXISTS (SELECT * FROM "Response" where "InterviewId" = InterviewId) THEN
		RETURN QUERY
			SELECT 
				ROW_NUMBER() OVER (Partition By "Questions"."QuestionCategoryId" ORDER BY "Questions"."SortOrder", "Questions"."Question" ASC) AS "RowNumber",
				"Questions"."QuestionId",
				"Questions"."Question",
				"Answer"."Answer" as type,
				"Response"."Remarks" as "remarks",
				"Response"."IsUpdate",
				"Questions"."QuestionCategoryId"
			FROM  
				"Questions" 
			INNER JOIN "Response" ON "Questions"."QuestionId" = "Response"."QuestionId"
			INNER JOIN "Answer" ON  "Answer"."AnswerId" = "Response"."AnswerId"
			WHERE 
				"Response"."InterviewId" = interviewid
			ORDER BY 
				"Questions"."SortOrder", "Questions"."Question" ASC;
	ELSE 
		RETURN QUERY
			SELECT 
				ROW_NUMBER() OVER (Partition By "Questions"."QuestionCategoryId" ORDER BY "Questions"."SortOrder", "Questions"."Question" ASC) AS "RowNumber",
				"Questions"."QuestionId",
				"Questions"."Question",
				CAST ( 'N.A' AS text ) as "type",
				CAST ('N/A' AS text) as "remarks",
				false As "IsUpdate",
				"Questions"."QuestionCategoryId"
			FROM 
				"Questions"
			WHERE 
				"Questions"."IsDelete" = False AND "Questions"."IsActive" = True
			ORDER BY 
				"Questions"."SortOrder", "Questions"."Question" ASC;

	END IF;
END;
$$;


ALTER FUNCTION public.getresponsedata(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 229 (class 1255 OID 84799)
-- Name: getsqldata(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsqldata(interviewid bigint) RETURNS TABLE("Question" text, "Answer" text, remarks text)
    LANGUAGE plpgsql
    AS $$
BEGIN
     RETURN QUERY
  SELECT
           
           "Questions"."Question",
           "Answer"."Answer",
           "Response"."Remarks" as "remarks"
            FROM  ("Questions" NATURAL JOIN "Response" NATURAL JOIN "Answer")
            WHERE 
            (
              "Response"."InterviewId" = InterviewId
              AND 
              "Questions"."QuestionCategoryId" = 1
            );
   

END;
$$;


ALTER FUNCTION public.getsqldata(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 230 (class 1255 OID 84800)
-- Name: getsqldatamultiple(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsqldatamultiple(interviewid text) RETURNS TABLE("Question" text, "Answer" text, remarks text, "InterviewId" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
     RETURN QUERY
  SELECT
           
           "Questions"."Question",
           "Answer"."Answer",
           "Response"."Remarks" as "remarks",
           "Response"."InterviewId" as "InterviewId"
           
            FROM  ("Questions" NATURAL JOIN "Response" NATURAL JOIN "Answer")
            WHERE 
            (
              "Response"."InterviewId" in (SELECT CAST ( regexp_split_to_table(interviewid, E',') AS bigint ))
              --InterviewId
              AND 
              "Questions"."QuestionCategoryId" = 1
            );
   

END;
$$;


ALTER FUNCTION public.getsqldatamultiple(interviewid text) OWNER TO postgres;

--
-- TOC entry 226 (class 1255 OID 84801)
-- Name: getsqldatawithcategory(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION getsqldatawithcategory(interviewid bigint) RETURNS TABLE("Question" text, "Answer" text, remarks text, "QuestionCategoryName" text, "DisplayName" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
     RETURN QUERY



SELECT
"Questions"."Question",
"Answer"."Answer",
"Response"."Remarks",
"QuestionCategory"."QuestionCategoryName",
"QuestionCategory"."DisplayName"
FROM "Response"  
INNER JOIN "Questions" on "Response"."QuestionId" = "Questions"."QuestionId"
INNER JOIN "Answer" on "Response"."AnswerId" = "Answer"."AnswerId"
INNER JOIN "QuestionCategory" ON "Questions"."QuestionCategoryId" = "QuestionCategory"."QuestionCategoryId"
WHERE "Response"."InterviewId" = interviewid;
   

END;
$$;


ALTER FUNCTION public.getsqldatawithcategory(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 231 (class 1255 OID 84802)
-- Name: interviewresultupdate(text, text, bigint, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewresultupdate(recommendations text, interviewscore text, interviewresultid bigint, interviewid bigint) RETURNS TABLE(status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Status text := 'Ok'; 
BEGIN    
  UPDATE InterviewSchedule SET "Recommendations" = Recommendations, "InterviewScore" = InterviewScore, "InterviewResultId" = InterviewResultId WHERE "InterviewId" = InterviewId;
    RETURN QUERY SELECT Status;
END;
$$;


ALTER FUNCTION public.interviewresultupdate(recommendations text, interviewscore text, interviewresultid bigint, interviewid bigint) OWNER TO postgres;

--
-- TOC entry 232 (class 1255 OID 84803)
-- Name: interviewresumedelete(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewresumedelete(interviewid bigint) RETURNS TABLE(status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Status text := 'Ok';
BEGIN
    UPDATE InterviewSchedule SET "Resume" = null WHERE InterviewSchedule."InterviewId" = interviewid;
      RETURN QUERY SELECT Status;
END;
$$;


ALTER FUNCTION public.interviewresumedelete(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 84804)
-- Name: interviewscheduledelete(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewscheduledelete(interviewid bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN    
  UPDATE InterviewSchedule SET "IsDelete" = 'True' WHERE "InterviewId" = interviewid;
END;
$$;


ALTER FUNCTION public.interviewscheduledelete(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 239 (class 1255 OID 84805)
-- Name: interviewschedulegetall(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewschedulegetall() RETURNS TABLE("RowNumber" bigint, "InterviewId" bigint, "PositionName" text, "Name" text, "PhoneNumber" text, "AlternatePhoneNumber" text, "EmailId" text, "Experience" text, "ModeofInterview" text, "ToEmail" bigint, "CCEmail" text, "ScheduleDate" text, "SCHDATE" date, "ScheduleTime" text, "IsResponseAvailable" boolean, "ReportShared" text, "IsInvoiced" text, "IsArchived" text, "IsActive" text, "Resume" text, "InterviewScore" text, "InterviewResult" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY

SELECT 
ROW_NUMBER() OVER (ORDER BY InterviewSchedule."ScheduleDate" DESC) AS "RowNumber",
InterviewSchedule."InterviewId",
InterviewSchedule."PositionName",
InterviewSchedule."FirstName" || ' ' || InterviewSchedule."LastName" AS "Name",
InterviewSchedule."PhoneNumber",
InterviewSchedule."AlternatePhoneNumber",
InterviewSchedule."EmailId",
InterviewSchedule."Experience",
InterviewSchedule."ModeofInterview",      
InterviewSchedule."ToEmail",
InterviewSchedule."CCEmail" ,
to_char(InterviewSchedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
InterviewSchedule."ScheduleDate" AS "SCHDATE",
to_char(InterviewSchedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",
 (
SELECT EXISTS (SELECT TRUE FROM "Response" WHERE "Response"."InterviewId" = InterviewSchedule."InterviewId")
   ) "IsResponseAvailable",
CASE WHEN InterviewSchedule."ReportShared" = TRUE THEN 'Yes' ELSE 'No' END AS "ReportShared",
CASE WHEN InterviewSchedule."IsInvoiced" = TRUE THEN 'Yes' ELSE 'No' END AS "IsInvoiced",
CASE WHEN InterviewSchedule."IsArchived" = TRUE THEN 'Yes' ELSE 'No' END AS "IsArchived",
CASE WHEN InterviewSchedule."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
InterviewSchedule."Resume",
InterviewSchedule."InterviewScore",
"InterviewResult"."InterviewResult"
FROM InterviewSchedule 
LEFT OUTER JOIN 
"InterviewResult"
ON InterviewSchedule."InterviewResultId" = "InterviewResult"."InterviewResultId"
WHERE InterviewSchedule."IsDelete" = False ORDER BY "SCHDATE" DESC;   

END;
$$;


ALTER FUNCTION public.interviewschedulegetall() OWNER TO postgres;

--
-- TOC entry 266 (class 1255 OID 84946)
-- Name: interviewschedulegetbyid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewschedulegetbyid(interviewid bigint) RETURNS TABLE("InterviewId" bigint, "PositionName" text, "FirstName" text, "LastName" text, "PhoneNumber" text, "AlternatePhoneNumber" text, "EmailId" text, "Experience" text, "ModeofInterview" text, "InterviewStatusId" bigint, "InterviewScore" text, "InterviewResult" text, "ToEmail" bigint, "CCEmail" text, "ScheduleDate" text, "SCHDATE" text, "ScheduleTime" time without time zone, "SCHTIME" text, "ReportShared" boolean, "IsInvoiced" boolean, "IsArchived" boolean, "IsActive" boolean, "Resume" text, "CCMailsId" text, "IsResponseAvailable" boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
	SELECT InterviewSchedule."InterviewId",
	InterviewSchedule."PositionName", 
	InterviewSchedule."FirstName", 
	InterviewSchedule."LastName", 
	InterviewSchedule."PhoneNumber", 
	InterviewSchedule."AlternatePhoneNumber", 
	InterviewSchedule."EmailId", 
	InterviewSchedule."Experience", 
	InterviewSchedule."ModeofInterview", 
	InterviewSchedule."InterviewStatusId", 
	InterviewSchedule."InterviewScore",
	"InterviewResult"."InterviewResult",
	InterviewSchedule."ToEmail", 
	InterviewSchedule."CCEmail",
	to_char(InterviewSchedule."ScheduleDate", 'YYYY-MM-DD') AS "ScheduleDate", 
	to_char(InterviewSchedule."ScheduleDate", 'DD/MM/YYYY') AS "SCHDATE",
	InterviewSchedule."ScheduleTime", 
	to_char(InterviewSchedule."ScheduleTime"::Time, 'HH12:MI AM') AS "SCHTIME",
	InterviewSchedule."ReportShared",
        InterviewSchedule."IsInvoiced",
	InterviewSchedule."IsArchived",
	InterviewSchedule."IsActive",
	InterviewSchedule."Resume", 
	"Person"."CCMailsId",
	(
		SELECT EXISTS (SELECT TRUE FROM "Response" WHERE "Response"."InterviewId" = InterviewSchedule."InterviewId")
	) "IsResponseAvailable" 
FROM 
	interviewschedule 
INNER JOIN "Person" ON interviewschedule."ToEmail" = "Person"."PersonId"
LEFT OUTER JOIN "InterviewResult" ON InterviewSchedule."InterviewResultId" = "InterviewResult"."InterviewResultId"
WHERE 
	interviewschedule."InterviewId" = interviewid;
END;
$$;


ALTER FUNCTION public.interviewschedulegetbyid(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 254 (class 1255 OID 84807)
-- Name: interviewschedulegetbypersonanddate(date, date, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewschedulegetbypersonanddate(fromdate date, todate date, toemail bigint) RETURNS TABLE("RowNumber" bigint, "InterviewId" bigint, "PositionName" text, "Name" text, "PersonName" text, "PhoneNumber" text, "AlternatePhoneNumber" text, "EmailId" text, "Experience" text, "ModeofInterview" text, "SCHDATE" date, "ScheduleDate" text, "ScheduleTime" text, "InterviewResult" text, "ToEmail" bigint, "InterviewResultId" bigint, "ReportShared" boolean, "IsActive" boolean, "IsDelete" boolean, "PersonId" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN    
	IF(fromDate::text = '0001-01-01') THEN
		fromDate := NULL;
	END IF;
	IF(toDate::text = '0001-01-01') THEN
		toDate := NULL;
	END IF;
	CASE WHEN(fromDate IS NOT NULL AND toDate IS NOT NULL AND toEmail != 0) THEN            
		RETURN QUERY
		SELECT
		    ROW_NUMBER() OVER (ORDER BY interviewschedule."FirstName") AS "RowNumber",
		    interviewschedule."InterviewId",
		    interviewschedule."PositionName",
		    interviewschedule."FirstName" || ' ' || interviewschedule."LastName" AS "Name",
		    "Person"."PersonName",
		    interviewschedule."PhoneNumber",
		    interviewschedule."AlternatePhoneNumber",
		    interviewschedule."EmailId",
		    interviewschedule."Experience",
		    interviewschedule."ModeofInterview",
		    interviewSchedule."ScheduleDate" AS "SCHDATE",
		    to_char(interviewschedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
		    to_char(interviewschedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",  
		    "InterviewResult"."InterviewResult",
		    interviewschedule."ToEmail",
		    interviewschedule."InterviewResultId",
		    interviewschedule."ReportShared",
		    interviewschedule."IsActive",
		    interviewschedule."IsDelete",
		    "Person"."PersonId"
		    FROM  (interviewschedule LEFT OUTER JOIN "InterviewResult" ON "InterviewResult"."InterviewResultId" = interviewschedule."InterviewResultId" 
				INNER JOIN "Person" ON "Person"."PersonId" = interviewschedule."ToEmail")
		    WHERE 
		    (
			((interviewschedule."ScheduleDate" BETWEEN fromDate AND toDate)
			AND (interviewschedule."ToEmail" IS NULL OR interviewschedule."ToEmail" = toEmail)
			AND interviewschedule."IsDelete" = False)
		    );		
	WHEN(fromDate IS NULL AND toDate IS NULL AND toEmail != 0) THEN
		RETURN QUERY
		SELECT
		    ROW_NUMBER() OVER (ORDER BY interviewschedule."FirstName") AS "RowNumber",
		    interviewschedule."InterviewId",
		    interviewschedule."PositionName",
		    interviewschedule."FirstName" || ' ' || interviewschedule."LastName" AS "Name",
		    "Person"."PersonName",
		    interviewschedule."PhoneNumber",
		    interviewschedule."AlternatePhoneNumber",
		    interviewschedule."EmailId",
		    interviewschedule."Experience",
		    interviewschedule."ModeofInterview",
		    interviewSchedule."ScheduleDate" AS "SCHDATE",
		    to_char(interviewschedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
		    to_char(interviewschedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",  
		    "InterviewResult"."InterviewResult",
		    interviewschedule."ToEmail",
		    interviewschedule."InterviewResultId",
		    interviewschedule."ReportShared",
		    interviewschedule."IsActive",
		    interviewschedule."IsDelete",
		    "Person"."PersonId"
		    FROM  (interviewschedule LEFT OUTER JOIN "InterviewResult" ON "InterviewResult"."InterviewResultId" = interviewschedule."InterviewResultId" 
				INNER JOIN "Person" ON "Person"."PersonId" = interviewschedule."ToEmail")
		    WHERE 
		    (
			((interviewschedule."ToEmail" IS NULL OR interviewschedule."ToEmail" = toEmail)
			AND interviewschedule."IsDelete" = False)
		    );
	WHEN(fromDate IS NOT NULL AND toDate IS NOT NULL AND toEmail = 0) THEN
		RETURN QUERY
		SELECT
		    ROW_NUMBER() OVER (ORDER BY interviewschedule."FirstName") AS "RowNumber",
		    interviewschedule."InterviewId",
		    interviewschedule."PositionName",
		    interviewschedule."FirstName" || ' ' || interviewschedule."LastName" AS "Name",
		    "Person"."PersonName",
		    interviewschedule."PhoneNumber",
		    interviewschedule."AlternatePhoneNumber",
		    interviewschedule."EmailId",
		    interviewschedule."Experience",
		    interviewschedule."ModeofInterview",
		    interviewSchedule."ScheduleDate" AS "SCHDATE",
		    to_char(interviewschedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
		    to_char(interviewschedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",  
		    "InterviewResult"."InterviewResult",
		    interviewschedule."ToEmail",
		    interviewschedule."InterviewResultId",
		    interviewschedule."ReportShared",
		    interviewschedule."IsActive",
		    interviewschedule."IsDelete",
		    "Person"."PersonId"
		    FROM  (interviewschedule LEFT OUTER JOIN "InterviewResult" ON "InterviewResult"."InterviewResultId" = interviewschedule."InterviewResultId" 
				INNER JOIN "Person" ON "Person"."PersonId" = interviewschedule."ToEmail")
		    WHERE 
		    (
			((interviewschedule."ScheduleDate" BETWEEN fromDate AND toDate)			
			AND interviewschedule."IsDelete" = False)
		    );
	ELSE
		RETURN QUERY
		SELECT
		    ROW_NUMBER() OVER (ORDER BY interviewschedule."FirstName") AS "RowNumber",
		    interviewschedule."InterviewId",
		    interviewschedule."PositionName",
		    interviewschedule."FirstName" || ' ' || interviewschedule."LastName" AS "Name",
		    "Person"."PersonName",
		    interviewschedule."PhoneNumber",
		    interviewschedule."AlternatePhoneNumber",
		    interviewschedule."EmailId",
		    interviewschedule."Experience",
		    interviewschedule."ModeofInterview",
		    interviewSchedule."ScheduleDate" AS "SCHDATE",
 		    to_char(interviewschedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
		    to_char(interviewschedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",  
		    "InterviewResult"."InterviewResult",
		    interviewschedule."ToEmail",
		    interviewschedule."InterviewResultId",
		    interviewschedule."ReportShared",
		    interviewschedule."IsActive",
		    interviewschedule."IsDelete",
		    "Person"."PersonId"
		    FROM  (interviewschedule LEFT OUTER JOIN "InterviewResult" ON "InterviewResult"."InterviewResultId" = interviewschedule."InterviewResultId" 
				INNER JOIN "Person" ON "Person"."PersonId" = interviewschedule."ToEmail")
		    WHERE 
		    (
			interviewschedule."IsDelete" = False
		    );
		END CASE;
END;
$$;


ALTER FUNCTION public.interviewschedulegetbypersonanddate(fromdate date, todate date, toemail bigint) OWNER TO postgres;

--
-- TOC entry 268 (class 1255 OID 93150)
-- Name: interviewschedulegetdatewiseformonthlyreport(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewschedulegetdatewiseformonthlyreport(month integer, year integer) RETURNS TABLE("RowNumber" bigint, "InterviewDate" text, "Date" text, "InterviewCount" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
		SELECT ROW_NUMBER() OVER (ORDER BY InterviewSchedule."ScheduleDate" ASC) AS "RowNumber",
		to_char(InterviewSchedule."ScheduleDate", 'DD') AS "InterviewDate",
		to_char(InterviewSchedule."ScheduleDate", 'DD/MM/yyyy') AS "Date",
		COUNT(distinct interviewschedule."InterviewId") as InterviewCount from interviewschedule 
		WHERE EXTRACT(MONTH FROM InterviewSchedule."ScheduleDate") = Month
		AND EXTRACT(Year FROM InterviewSchedule."ScheduleDate") = Year 
		AND interviewschedule."IsDelete" = false
		GROUP BY interviewschedule."ScheduleDate"
		UNION ALL
		SELECT null AS "RowNumber",
		'' AS "InterviewDate",
		'Total' as "INTERVIEWDATE",  COUNT(distinct interviewschedule."InterviewId") as InterviewCount from interviewschedule 
		WHERE EXTRACT(MONTH FROM InterviewSchedule."ScheduleDate") = Month
		AND EXTRACT(Year FROM InterviewSchedule."ScheduleDate") = Year 
		AND interviewschedule."IsDelete" = false
		HAVING COUNT(distinct interviewschedule."InterviewId") > 0 ;
END;
$$;


ALTER FUNCTION public.interviewschedulegetdatewiseformonthlyreport(month integer, year integer) OWNER TO postgres;

--
-- TOC entry 255 (class 1255 OID 84809)
-- Name: interviewschedulegetresumedetailbyid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewschedulegetresumedetailbyid(interviewid bigint) RETURNS TABLE("Resume" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT InterviewSchedule."Resume" FROM InterviewSchedule 
	WHERE InterviewSchedule."InterviewId" = interviewid;
END;
$$;


ALTER FUNCTION public.interviewschedulegetresumedetailbyid(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 215 (class 1255 OID 35507)
-- Name: interviewscheduleinsert(text, text, text, text, text, date, time without time zone, text, text, text, bigint, bigint, text, boolean, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewscheduleinsert(firstname text, lastname text, phonenumber text, alternatephonenumber text, emailid text, scheduledate date, scheduletime time without time zone, positionname text, experience text, modeofinterview text, interviewstatusid bigint, toemail bigint, ccemail text, isactive boolean, resume text) RETURNS TABLE("InterviewId" bigint, "PositionName" text, "Name" text, "PhoneNumber" text, "AlternatePhoneNumber" text, "EmailId" text, "Experience" text, "ModeofInterview" text, "ToEmail" bigint, "CCEmail" text, "ScheduleDate" text, "SCHDATE" date, "ScheduleTime" text, "ReportShared" text, "IsActive" text, "Resume" text, "InterviewScore" text, "InterviewResult" text, status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict'; 
BEGIN

		 IF EXISTS(SELECT InterviewSchedule."InterviewId" FROM InterviewSchedule WHERE InterviewSchedule."EmailId"= emailid AND interviewschedule."ScheduleDate"= scheduledate) THEN
			
			RETURN QUERY
				SELECT cast(1 as bigint),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast(0 as bigint),
				cast('' as text),
				cast('' as text),
				CURRENT_DATE,
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				 conflict;
		ELSE
			
			INSERT INTO interviewschedule("FirstName",
				"LastName",
				"PhoneNumber",
				"AlternatePhoneNumber",
				"EmailId",
				"ScheduleDate",
				"ScheduleTime",
				"PositionName",
				"Experience",
				"ModeofInterview",
				"InterviewStatusId",
				"ToEmail",
				"CCEmail",
				"IsActive",
				"Resume")
			VALUES
				(FirstName
				,LastName
				,PhoneNumber
				,AlternatePhoneNumber
				,EmailId
				,ScheduleDate
				,ScheduleTime
				,PositionName
				,Experience
				,ModeofInterview
				,InterviewStatusId
				,ToEmail
				,CCEmail
				,IsActive
				,Resume);

			RETURN QUERY
				SELECT 
InterviewSchedule."InterviewId",
InterviewSchedule."PositionName",
InterviewSchedule."FirstName" || ' ' || InterviewSchedule."LastName" AS "Name",
InterviewSchedule."PhoneNumber",
InterviewSchedule."AlternatePhoneNumber",
InterviewSchedule."EmailId",
InterviewSchedule."Experience",
InterviewSchedule."ModeofInterview",      
InterviewSchedule."ToEmail",
InterviewSchedule."CCEmail" ,
to_char(InterviewSchedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
InterviewSchedule."ScheduleDate" AS "SCHDATE",
to_char(InterviewSchedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",
CASE WHEN InterviewSchedule."ReportShared" = TRUE THEN 'Yes' ELSE 'No' END AS "ReportShared",
CASE WHEN InterviewSchedule."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
InterviewSchedule."Resume",
InterviewSchedule."InterviewScore",
"InterviewResult"."InterviewResult",
Ok
FROM InterviewSchedule 
LEFT OUTER JOIN 
"InterviewResult"
ON InterviewSchedule."InterviewResultId" = "InterviewResult"."InterviewResultId"
WHERE InterviewSchedule."InterviewId" = currval('interviewschedule_interviewid_seq') ;

		END IF;


		 
END;
$$;


ALTER FUNCTION public.interviewscheduleinsert(firstname text, lastname text, phonenumber text, alternatephonenumber text, emailid text, scheduledate date, scheduletime time without time zone, positionname text, experience text, modeofinterview text, interviewstatusid bigint, toemail bigint, ccemail text, isactive boolean, resume text) OWNER TO postgres;

--
-- TOC entry 256 (class 1255 OID 84810)
-- Name: interviewscheduleinsert(text, text, text, text, text, date, time without time zone, text, text, text, bigint, bigint, text, boolean, text, boolean, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewscheduleinsert(firstname text, lastname text, phonenumber text, alternatephonenumber text, emailid text, scheduledate date, scheduletime time without time zone, positionname text, experience text, modeofinterview text, interviewstatusid bigint, toemail bigint, ccemail text, isactive boolean, resume text, isinvoiced boolean, isarchived boolean) RETURNS TABLE("InterviewId" bigint, "PositionName" text, "Name" text, "PhoneNumber" text, "AlternatePhoneNumber" text, "EmailId" text, "Experience" text, "ModeofInterview" text, "ToEmail" bigint, "CCEmail" text, "ScheduleDate" text, "SCHDATE" date, "ScheduleTime" text, "ReportShared" text, "IsActive" text, "IsInvoiced" text, "IsArchived" text, "Resume" text, "InterviewScore" text, "InterviewResult" text, status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict'; 
BEGIN

		 IF EXISTS(SELECT InterviewSchedule."InterviewId" FROM InterviewSchedule WHERE InterviewSchedule."EmailId"= emailid AND interviewschedule."ScheduleDate"= scheduledate) THEN
			
			RETURN QUERY
				SELECT cast(1 as bigint),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast(0 as bigint),
				cast('' as text),
				cast('' as text),
				CURRENT_DATE,
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				 conflict;
		ELSE
			
			INSERT INTO interviewschedule("FirstName",
				"LastName",
				"PhoneNumber",
				"AlternatePhoneNumber",
				"EmailId",
				"ScheduleDate",
				"ScheduleTime",
				"PositionName",
				"Experience",
				"ModeofInterview",
				"InterviewStatusId",
				"ToEmail",
				"CCEmail",
				"IsActive",
				"Resume",
				"IsInvoiced",
				"IsArchived")
			VALUES
				(FirstName
				,LastName
				,PhoneNumber
				,AlternatePhoneNumber
				,EmailId
				,ScheduleDate
				,ScheduleTime
				,PositionName
				,Experience
				,ModeofInterview
				,InterviewStatusId
				,ToEmail
				,CCEmail
				,IsActive
				,Resume
				,IsInvoiced
				,IsArchived);

			RETURN QUERY
				SELECT 
InterviewSchedule."InterviewId",
InterviewSchedule."PositionName",
InterviewSchedule."FirstName" || ' ' || InterviewSchedule."LastName" AS "Name",
InterviewSchedule."PhoneNumber",
InterviewSchedule."AlternatePhoneNumber",
InterviewSchedule."EmailId",
InterviewSchedule."Experience",
InterviewSchedule."ModeofInterview",      
InterviewSchedule."ToEmail",
InterviewSchedule."CCEmail" ,
to_char(InterviewSchedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
InterviewSchedule."ScheduleDate" AS "SCHDATE",
to_char(InterviewSchedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",
CASE WHEN InterviewSchedule."ReportShared" = TRUE THEN 'Yes' ELSE 'No' END AS "ReportShared",
CASE WHEN InterviewSchedule."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
CASE WHEN InterviewSchedule."IsInvoiced" = TRUE THEN 'Yes' ELSE 'No' END AS "IsInvoiced",
CASE WHEN InterviewSchedule."IsArchived" = TRUE THEN 'Yes' ELSE 'No' END AS "IsArchived",
InterviewSchedule."Resume",
InterviewSchedule."InterviewScore",
"InterviewResult"."InterviewResult",
Ok
FROM InterviewSchedule 
LEFT OUTER JOIN 
"InterviewResult"
ON InterviewSchedule."InterviewResultId" = "InterviewResult"."InterviewResultId"
WHERE InterviewSchedule."InterviewId" = currval('interviewschedule_interviewid_seq') ;

		END IF;


		 
END;
$$;


ALTER FUNCTION public.interviewscheduleinsert(firstname text, lastname text, phonenumber text, alternatephonenumber text, emailid text, scheduledate date, scheduletime time without time zone, positionname text, experience text, modeofinterview text, interviewstatusid bigint, toemail bigint, ccemail text, isactive boolean, resume text, isinvoiced boolean, isarchived boolean) OWNER TO postgres;

--
-- TOC entry 257 (class 1255 OID 84811)
-- Name: interviewscheduleupdate(text, text, text, text, text, date, time without time zone, text, text, text, bigint, bigint, text, boolean, text, bigint, boolean, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewscheduleupdate(firstname text, lastname text, phonenumber text, alternatephonenumber text, emailid text, scheduledate date, scheduletime time without time zone, positionname text, experience text, modeofinterview text, interviewstatusid bigint, toemail bigint, ccemail text, isactive boolean, resume text, interviewid bigint, isinvoiced boolean, isarchived boolean) RETURNS TABLE("InterviewId" bigint, "PositionName" text, "Name" text, "PhoneNumber" text, "AlternatePhoneNumber" text, "EmailId" text, "Experience" text, "ModeofInterview" text, "ToEmail" bigint, "CCEmail" text, "ScheduleDate" text, "SCHDATE" date, "ScheduleTime" text, "ReportShared" text, "IsActive" text, "IsInvoiced" text, "IsArchived" text, "Resume" text, "InterviewScore" text, "InterviewResult" text, status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok'; 
DECLARE Exist integer;
DECLARE conflict text := 'conflict';  
BEGIN

			SELECT count(*) into Exist
			FROM   interviewschedule
			WHERE  interviewschedule."EmailId"= emailid AND interviewschedule."ScheduleDate"= scheduledate AND interviewschedule."InterviewId" != interviewid;

		IF (Exist > 0) THEN
		
			RETURN QUERY 
				SELECT 
				cast(1 as bigint),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast(0 as bigint),
				cast('' as text),
				cast('' as text),
				CURRENT_DATE,
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				 conflict;

		ELSE
			UPDATE InterviewSchedule SET 
				"FirstName" = FirstName
				,"LastName" = LastName
				,"PhoneNumber" = PhoneNumber
				,"AlternatePhoneNumber" = AlternatePhoneNumber
				,"EmailId" = EmailId
				,"ScheduleDate" = ScheduleDate
				,"ScheduleTime" = ScheduleTime
				,"PositionName" = PositionName
				,"Experience" = Experience
				,"ModeofInterview" = ModeofInterview
				,"InterviewStatusId" = InterviewStatusId
				,"ToEmail" = ToEmail
				,"CCEmail" = CCEmail
				,"IsActive" = IsActive
				,"Resume" = Resume
				,"IsInvoiced" = IsInvoiced
				,"IsArchived" = IsArchived
			WHERE InterviewSchedule."InterviewId" = InterviewId;
			
			RETURN QUERY 
				SELECT 
				InterviewSchedule."InterviewId",
				InterviewSchedule."PositionName",
				InterviewSchedule."FirstName" || ' ' || InterviewSchedule."LastName" AS "Name",
				InterviewSchedule."PhoneNumber",
				InterviewSchedule."AlternatePhoneNumber",
				InterviewSchedule."EmailId",
				InterviewSchedule."Experience",
				InterviewSchedule."ModeofInterview",      
				InterviewSchedule."ToEmail",
				InterviewSchedule."CCEmail" ,
				to_char(InterviewSchedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
				InterviewSchedule."ScheduleDate" AS "SCHDATE",
				to_char(InterviewSchedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",
				CASE WHEN InterviewSchedule."ReportShared" = TRUE THEN 'Yes' ELSE 'No' END AS "ReportShared",				
				CASE WHEN InterviewSchedule."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
				CASE WHEN InterviewSchedule."IsInvoiced" = TRUE THEN 'Yes' ELSE 'No' END AS "IsInvoiced",
				CASE WHEN InterviewSchedule."IsArchived" = TRUE THEN 'Yes' ELSE 'No' END AS "IsArchived",
				InterviewSchedule."Resume",
				InterviewSchedule."InterviewScore",
				"InterviewResult"."InterviewResult",
				Ok
				FROM InterviewSchedule 
				LEFT OUTER JOIN 
				"InterviewResult"
				ON InterviewSchedule."InterviewResultId" = "InterviewResult"."InterviewResultId"
				WHERE InterviewSchedule."InterviewId" = InterviewId ;
	END IF;

END;
$$;


ALTER FUNCTION public.interviewscheduleupdate(firstname text, lastname text, phonenumber text, alternatephonenumber text, emailid text, scheduledate date, scheduletime time without time zone, positionname text, experience text, modeofinterview text, interviewstatusid bigint, toemail bigint, ccemail text, isactive boolean, resume text, interviewid bigint, isinvoiced boolean, isarchived boolean) OWNER TO postgres;

--
-- TOC entry 241 (class 1255 OID 84812)
-- Name: interviewsharedreportupdate(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION interviewsharedreportupdate(interviewid bigint) RETURNS TABLE("InterviewId" bigint, "PositionName" text, "Name" text, "PhoneNumber" text, "AlternatePhoneNumber" text, "EmailId" text, "Experience" text, "ModeofInterview" text, "ToEmail" bigint, "CCEmail" text, "ScheduleDate" text, "SCHDATE" date, "ScheduleTime" text, "ReportShared" text, "IsActive" text, "IsInvoiced" text, "IsArchived" text, "Resume" text, "InterviewScore" text, "InterviewResult" text)
    LANGUAGE plpgsql
    AS $$
DECLARE Status text := 'Ok'; 
BEGIN    
  UPDATE InterviewSchedule SET "ReportShared" = 'True' WHERE InterviewSchedule."InterviewId" = interviewId;
    RETURN QUERY 
	SELECT 
		InterviewSchedule."InterviewId",
		InterviewSchedule."PositionName",
		InterviewSchedule."FirstName" || ' ' || InterviewSchedule."LastName" AS "Name",
		InterviewSchedule."PhoneNumber",
		InterviewSchedule."AlternatePhoneNumber",
		InterviewSchedule."EmailId",
		InterviewSchedule."Experience",
		InterviewSchedule."ModeofInterview",      
		InterviewSchedule."ToEmail",
		InterviewSchedule."CCEmail" ,
		to_char(InterviewSchedule."ScheduleDate", 'DD/MM/YYYY') AS "ScheduleDate",
		InterviewSchedule."ScheduleDate" AS "SCHDATE",
		to_char(InterviewSchedule."ScheduleTime"::Time, 'HH12:MI AM') AS "ScheduleTime",
		CASE WHEN InterviewSchedule."ReportShared" = TRUE THEN 'Yes' ELSE 'No' END AS "ReportShared",
		CASE WHEN InterviewSchedule."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
		CASE WHEN InterviewSchedule."IsInvoiced" = TRUE THEN 'Yes' ELSE 'No' END AS "IsInvoiced",
		CASE WHEN InterviewSchedule."IsArchived" = TRUE THEN 'Yes' ELSE 'No' END AS "IsArchived",
		InterviewSchedule."Resume",
		InterviewSchedule."InterviewScore",
		"InterviewResult"."InterviewResult"
	
		FROM InterviewSchedule 
		LEFT OUTER JOIN 
		"InterviewResult"
		ON InterviewSchedule."InterviewResultId" = "InterviewResult"."InterviewResultId"
		WHERE InterviewSchedule."InterviewId" = interviewId;
END;
$$;


ALTER FUNCTION public.interviewsharedreportupdate(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 238 (class 1255 OID 84813)
-- Name: persongetall(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION persongetall() RETURNS TABLE("PersonId" bigint, "PersonName" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT "Person"."PersonId", "Person"."PersonName" || ' <' || "EmailId" || '>' AS "PersonName" FROM "Person";
END;
$$;


ALTER FUNCTION public.persongetall() OWNER TO postgres;

--
-- TOC entry 240 (class 1255 OID 84814)
-- Name: persongetbyid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION persongetbyid(personvalue bigint) RETURNS TABLE("PersonId" bigint, "PersonName" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY
SELECT "Person"."PersonId", "Person"."PersonName" || ' <' || "EmailId" || '>' AS "PersonName" from "Person" WHERE "Person"."PersonId" IN (SELECT CAST ( regexp_split_to_table((Select p."CCMailsId" From "Person" as p Where p."PersonId" = PersonValue ), E',') AS bigint));

END;
$$;


ALTER FUNCTION public.persongetbyid(personvalue bigint) OWNER TO postgres;

--
-- TOC entry 242 (class 1255 OID 84815)
-- Name: questioncategoryactivegetall(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategoryactivegetall() RETURNS TABLE("QuestionCategoryId" bigint, "QuestionCategoryName" text, "IsDelete" boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
	SELECT 
	  "QuestionCategory"."QuestionCategoryId",
	  "QuestionCategory"."QuestionCategoryName",
	  "QuestionCategory"."IsDelete"
	FROM 
	  "QuestionCategory"	
	WHERE
	  "QuestionCategory"."IsDelete" = false
	  AND "QuestionCategory"."IsActive" = true
	ORDER BY 
	   "QuestionCategory"."QuestionCategoryName";
END;
$$;


ALTER FUNCTION public.questioncategoryactivegetall() OWNER TO postgres;

--
-- TOC entry 243 (class 1255 OID 84816)
-- Name: questioncategorydelete(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategorydelete(id bigint) RETURNS TABLE(status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict'; 
BEGIN  

			IF EXISTS(
				 SELECT "Questions"."QuestionId" FROM "Questions" 
				 WHERE "Questions"."QuestionCategoryId"= id 
				 AND "Questions"."IsDelete" = FALSE
				 ) THEN			
			RETURN QUERY				
				SELECT conflict;
			ELSE  
				UPDATE "QuestionCategory" SET "IsDelete" = 'True' WHERE "QuestionCategoryId" = id;
				RETURN QUERY				
					SELECT Ok;
			END IF;
END;
$$;


ALTER FUNCTION public.questioncategorydelete(id bigint) OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 84817)
-- Name: questioncategorygetall(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategorygetall() RETURNS TABLE("RowNumber" bigint, "QuestionCategoryId" bigint, "QuestionCategoryName" text, "DisplayName" text, "SortOrder" integer, "IsActive" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY

SELECT 
ROW_NUMBER() OVER (ORDER BY "QuestionCategory"."QuestionCategoryName" ASC) AS "RowNumber",
"QuestionCategory"."QuestionCategoryId",
"QuestionCategory"."QuestionCategoryName",
"QuestionCategory"."DisplayName",
"QuestionCategory"."SortOrder",
CASE WHEN "QuestionCategory"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive"
FROM "QuestionCategory"
WHERE "QuestionCategory"."IsDelete" = False
ORDER BY "SortOrder", "QuestionCategoryName"  ASC;   
END;
$$;


ALTER FUNCTION public.questioncategorygetall() OWNER TO postgres;

--
-- TOC entry 259 (class 1255 OID 84818)
-- Name: questioncategorygetallactivecategory(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategorygetallactivecategory(interviewid bigint) RETURNS TABLE("RowNumber" bigint, "QuestionCategoryId" bigint, "QuestionCategoryName" text, "DisplayName" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    
       IF EXISTS (SELECT * FROM "Response" where "InterviewId" = InterviewId) THEN
	 RETURN QUERY
		 SELECT 
			ROW_NUMBER() OVER (ORDER BY "QuestionCategory"."SortOrder" ASC) AS "RowNumber",
			"QuestionCategory"."QuestionCategoryId",
			"QuestionCategory"."QuestionCategoryName",
			"QuestionCategory"."DisplayName"
			FROM "QuestionCategory"
			INNER JOIN "Questions" ON  "QuestionCategory"."QuestionCategoryId" = "Questions"."QuestionCategoryId"
			INNER JOIN "Response" ON "Questions"."QuestionId" = "Response"."QuestionId"
			WHERE "QuestionCategory"."IsDelete" = False 
			--AND "QuestionCategory"."IsActive" = True
			AND "Questions"."IsDelete" = False 
			--AND "Questions"."IsActive" = True
			AND "Response"."InterviewId" = InterviewId
			GROUP BY "QuestionCategory"."QuestionCategoryId"
			ORDER BY "QuestionCategory"."SortOrder" , "QuestionCategory"."QuestionCategoryName" ASC;		    
	ELSE 
	 RETURN QUERY
		SELECT 
			ROW_NUMBER() OVER (ORDER BY "QuestionCategory"."SortOrder" ASC) AS "RowNumber",
			"QuestionCategory"."QuestionCategoryId",
			"QuestionCategory"."QuestionCategoryName",
			"QuestionCategory"."DisplayName"
			FROM "QuestionCategory"
			INNER JOIN "Questions" ON  "QuestionCategory"."QuestionCategoryId" = "Questions"."QuestionCategoryId"
			WHERE "QuestionCategory"."IsDelete" = False AND "QuestionCategory"."IsActive" = True
			AND "Questions"."IsDelete" = False AND "Questions"."IsActive" = True
			GROUP BY "QuestionCategory"."QuestionCategoryId"
			ORDER BY "QuestionCategory"."SortOrder" , "QuestionCategory"."QuestionCategoryName" ASC;
END IF;
END;
$$;


ALTER FUNCTION public.questioncategorygetallactivecategory(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 260 (class 1255 OID 84819)
-- Name: questioncategorygetallforquestions(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategorygetallforquestions() RETURNS TABLE("QuestionCategoryId" bigint, "QuestionCategoryName" text, "DisplayName" text, "IsDelete" boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
	SELECT 
		"QuestionCategory"."QuestionCategoryId",
		"QuestionCategory"."QuestionCategoryName",
		"QuestionCategory"."DisplayName",
		"QuestionCategory"."IsDelete"
	FROM 
		"QuestionCategory"
	INNER JOIN 
		"Questions" ON  "QuestionCategory"."QuestionCategoryId" = "Questions"."QuestionCategoryId"
	WHERE 
		"QuestionCategory"."IsDelete" = False AND "QuestionCategory"."IsActive" = True
		AND "Questions"."IsDelete" = False AND "Questions"."IsActive" = True
	GROUP BY 
		"QuestionCategory"."QuestionCategoryId"
	ORDER BY 
		"QuestionCategory"."SortOrder" , "QuestionCategory"."QuestionCategoryName" ASC;

END;
$$;


ALTER FUNCTION public.questioncategorygetallforquestions() OWNER TO postgres;

--
-- TOC entry 261 (class 1255 OID 84820)
-- Name: questioncategorygetbyid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategorygetbyid(categoryid bigint) RETURNS TABLE("QuestionCategoryId" bigint, "QuestionCategoryName" text, "DisplayName" text, "SortOrder" text, "IsActive" boolean, "IsDelete" boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT "QuestionCategory"."QuestionCategoryId", "QuestionCategory"."QuestionCategoryName", "QuestionCategory"."DisplayName",  cast("QuestionCategory"."SortOrder" as text),  "QuestionCategory"."IsActive", "QuestionCategory"."IsDelete"
	
    FROM "QuestionCategory" WHERE "QuestionCategory"."QuestionCategoryId" = categoryid;
END;
$$;


ALTER FUNCTION public.questioncategorygetbyid(categoryid bigint) OWNER TO postgres;

--
-- TOC entry 262 (class 1255 OID 84821)
-- Name: questioncategoryinsert(text, text, integer, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategoryinsert(categoryname text, displayname text, sortorder integer, isactive boolean) RETURNS TABLE("QuestionCategoryId" bigint, "QuestionCategoryName" text, "DisplayName" text, "SortOrder" integer, "IsActive" text, "Status" text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict'; 
BEGIN

		IF EXISTS(SELECT "QuestionCategory"."QuestionCategoryId" FROM "QuestionCategory" WHERE "QuestionCategory"."QuestionCategoryName"= categoryname AND "QuestionCategory"."IsDelete" = false) THEN			
			RETURN QUERY
				SELECT cast(0 as bigint),
				cast('' as text),
				cast('' as text),
				cast(0 as integer),
				cast('' as text),				
				conflict;
		ELSE
			
			INSERT INTO "QuestionCategory"("QuestionCategoryName",
				"DisplayName",
				"SortOrder",
				"IsActive"				
				)
			VALUES
				(categoryname
				,displayname
				,SortOrder
				,IsActive												
				);

			RETURN QUERY
				SELECT 
					"QuestionCategory"."QuestionCategoryId",
					"QuestionCategory"."QuestionCategoryName",
					"QuestionCategory"."DisplayName",
					"QuestionCategory"."SortOrder",
					CASE WHEN "QuestionCategory"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
					Ok
					FROM "QuestionCategory"
					WHERE "QuestionCategory"."QuestionCategoryId" = currval('"QuestionCategory_QuestionCategoryId_seq"') ;

		END IF;
		 
END;
$$;


ALTER FUNCTION public.questioncategoryinsert(categoryname text, displayname text, sortorder integer, isactive boolean) OWNER TO postgres;

--
-- TOC entry 263 (class 1255 OID 84822)
-- Name: questioncategoryupdate(text, text, integer, boolean, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioncategoryupdate(questioncategoryname text, displayname text, sortorder integer, isactive boolean, categoryid bigint) RETURNS TABLE("QuestionCategoryId" bigint, "QuestionCategoryName" text, "DisplayName" text, "SortOrder" integer, "IsActive" text, "Status" text)
    LANGUAGE plpgsql
    AS $$
DECLARE Status text := 'Ok'; 
DECLARE Conflict text := 'Conflict';
BEGIN
	IF EXISTS(
 SELECT "QuestionCategory"."QuestionCategoryId" FROM "QuestionCategory" 
 WHERE "QuestionCategory"."QuestionCategoryName"= questioncategoryname 
 AND "QuestionCategory"."IsDelete" = FALSE
 AND  "QuestionCategory"."QuestionCategoryId" != categoryid
 ) THEN			
			RETURN QUERY
				SELECT cast(0 as bigint),
				cast('' as text),
				cast('' as text),
				cast(0 as integer),
				Conflict;
		ELSE
			
		UPDATE "QuestionCategory" SET 
				"QuestionCategoryName" = questioncategoryname
				,"DisplayName" = displayname
				, "SortOrder" = SortOrder
				,"IsActive" = IsActive
			WHERE "QuestionCategory"."QuestionCategoryId" = categoryid;
			
			RETURN QUERY 
				SELECT 
					"QuestionCategory"."QuestionCategoryId",
					"QuestionCategory"."QuestionCategoryName",
					"QuestionCategory"."DisplayName",
					"QuestionCategory". "SortOrder",
					CASE WHEN "QuestionCategory"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
					Status				
					FROM "QuestionCategory"
					WHERE "QuestionCategory"."QuestionCategoryId" = categoryid ;

		END IF;		
END;
$$;


ALTER FUNCTION public.questioncategoryupdate(questioncategoryname text, displayname text, sortorder integer, isactive boolean, categoryid bigint) OWNER TO postgres;

--
-- TOC entry 264 (class 1255 OID 84823)
-- Name: questiondelete(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questiondelete(questionid bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN    
  UPDATE "Questions" SET "IsDelete" = 'True' WHERE "QuestionId" = QuestionId;
END;
$$;


ALTER FUNCTION public.questiondelete(questionid bigint) OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 84824)
-- Name: questiongetall(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questiongetall() RETURNS TABLE("QuestionId" bigint, "Question" text, "QuestionCategory" text, "IsActive" text, "SortOrder" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT 
	"Questions"."QuestionId",
	"Questions"."Question",
	"QuestionCategory"."QuestionCategoryName" AS "QuestionCategory",
	CASE WHEN "Questions"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
	"Questions"."SortOrder"
    FROM 
	"Questions"
    LEFT OUTER JOIN
	"QuestionCategory"
    ON
	"QuestionCategory"."QuestionCategoryId" = "Questions"."QuestionCategoryId"
    WHERE
	"Questions"."IsDelete" = false
    ORDER BY
	"QuestionCategory"."QuestionCategoryName", "Questions"."SortOrder", "Questions"."Question";
END;
$$;


ALTER FUNCTION public.questiongetall() OWNER TO postgres;

--
-- TOC entry 246 (class 1255 OID 84825)
-- Name: questiongetbyid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questiongetbyid(questionid bigint) RETURNS TABLE("QuestionId" bigint, "Question" text, "QuestionCategoryId" bigint, "IsActive" boolean, "SortOrder" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT 
	"Questions"."QuestionId", 
	"Questions"."Question", 
	"Questions"."QuestionCategoryId",
	"Questions"."IsActive",
	"Questions"."SortOrder"
    FROM 
	"Questions" 
    WHERE 
	"Questions"."QuestionId" = QuestionId;
END;
$$;


ALTER FUNCTION public.questiongetbyid(questionid bigint) OWNER TO postgres;

--
-- TOC entry 247 (class 1255 OID 84826)
-- Name: questioninsert(text, bigint, boolean, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questioninsert(question text, questioncategoryid bigint, isactive boolean, sortorder bigint) RETURNS TABLE("QuestionId" bigint, "Question" text, "QuestionCategoryId" bigint, "IsActive" text, "QuestionCategory" text, "SortOrder" bigint, "Status" text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict';
BEGIN
	IF EXISTS(SELECT "Questions"."QuestionId" FROM "Questions" WHERE "Questions"."Question"= question AND "Questions"."QuestionCategoryId" = questioncategoryid AND "Questions"."IsDelete" = false) THEN			
		RETURN QUERY
			SELECT cast(0 as bigint),
			cast('' as text),
			cast(0 as bigint),
			cast('' as text),
			cast('' as text),				
			cast(0 as bigint),
			conflict;
	ELSE
		INSERT INTO "Questions"("Question",
			"QuestionCategoryId",
			"IsActive",
			"SortOrder")
		VALUES
			(Question
			,QuestionCategoryId
			,IsActive
			,SortOrder);

		RETURN QUERY
			SELECT 
				"Questions"."QuestionId",
				"Questions"."Question",
				"Questions"."QuestionCategoryId",
				CASE WHEN "Questions"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",				
				"QuestionCategory"."QuestionCategoryName" AS "QuestionCategory",
				"Questions"."SortOrder",
				Ok
				FROM "Questions"
				INNER JOIN "QuestionCategory" ON "QuestionCategory"."QuestionCategoryId" = "Questions"."QuestionCategoryId"
				WHERE "Questions"."QuestionId" = currval('"Questions_Sequence"');	
	END IF;
END;
$$;


ALTER FUNCTION public.questioninsert(question text, questioncategoryid bigint, isactive boolean, sortorder bigint) OWNER TO postgres;

--
-- TOC entry 248 (class 1255 OID 84827)
-- Name: questionupdate(bigint, text, bigint, boolean, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION questionupdate(questionid bigint, question text, questioncategoryid bigint, isactive boolean, sortorder bigint) RETURNS TABLE("QuestionId" bigint, "Question" text, "QuestionCategoryId" bigint, "IsActive" text, "QuestionCategory" text, "SortOrder" bigint, "Status" text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict';
BEGIN
	IF EXISTS(SELECT "Questions"."QuestionId" FROM "Questions" WHERE "Questions"."QuestionId" != questionid AND "Questions"."Question"= question AND "Questions"."QuestionCategoryId" = questioncategoryid AND "Questions"."IsDelete" = false) THEN			
		RETURN QUERY
			SELECT cast(0 as bigint),
			cast('' as text),
			cast(0 as bigint),
			cast('' as text),
			cast('' as text),
			cast(0 as bigint),				
			conflict;
	ELSE
		UPDATE "Questions" SET 
			"Question" = Question,
			"QuestionCategoryId" = QuestionCategoryId,
			"IsActive" = IsActive,
			"SortOrder" = SortOrder
		WHERE "Questions"."QuestionId" = QuestionId;
		
		RETURN QUERY 
			SELECT 
				"Questions"."QuestionId",
				"Questions"."Question", 
				"Questions"."QuestionCategoryId",
				CASE WHEN "Questions"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
				"QuestionCategory"."QuestionCategoryName" AS "QuestionCategory",
				"Questions"."SortOrder",	
				Ok
			FROM 
				"Questions" 
			INNER JOIN 
				"QuestionCategory" ON "QuestionCategory"."QuestionCategoryId" = "Questions"."QuestionCategoryId"
			WHERE 
				"Questions"."QuestionId" = QuestionId;
	END IF;
END;
$$;


ALTER FUNCTION public.questionupdate(questionid bigint, question text, questioncategoryid bigint, isactive boolean, sortorder bigint) OWNER TO postgres;

--
-- TOC entry 249 (class 1255 OID 84828)
-- Name: responsedelete(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION responsedelete(interviewid bigint) RETURNS TABLE(status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Status text := 'Ok';
BEGIN
  DELETE from "Response" WHERE "InterviewId"=InterviewId;
    RETURN QUERY SELECT Status;
END;
$$;


ALTER FUNCTION public.responsedelete(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 250 (class 1255 OID 84829)
-- Name: responseinsert(bigint, bigint, bigint, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION responseinsert(questionid bigint, interviewid bigint, answerid bigint, remarks text, isupdate boolean) RETURNS TABLE(status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
BEGIN
  INSERT INTO "Response"
    ("QuestionId", "InterviewId", "AnswerId", "Remarks", "IsUpdate")
  VALUES (QuestionId, InterviewId, AnswerId, Remarks, IsUpdate);
  RETURN QUERY
    SELECT Ok;		 
END;
$$;


ALTER FUNCTION public.responseinsert(questionid bigint, interviewid bigint, answerid bigint, remarks text, isupdate boolean) OWNER TO postgres;

--
-- TOC entry 251 (class 1255 OID 84830)
-- Name: resultgetbyid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION resultgetbyid(interviewid bigint) RETURNS TABLE("Recommendations" text, "InterviewScore" text, "InterviewResultId" bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT InterviewSchedule."Recommendations", InterviewSchedule."InterviewScore", InterviewSchedule."InterviewResultId" FROM InterviewSchedule WHERE "InterviewId" = interviewId;
END;
$$;


ALTER FUNCTION public.resultgetbyid(interviewid bigint) OWNER TO postgres;

--
-- TOC entry 252 (class 1255 OID 84831)
-- Name: userchangepassword(text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION userchangepassword(oldpassword text, newpassword text, email text) RETURNS TABLE(status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict';  
BEGIN

		 IF EXISTS(SELECT "UserId" FROM "Users" WHERE "Email"= Email AND "Password" = OldPassword ) THEN
			
			UPDATE "Users" SET 
				"Password" = NewPassword
			WHERE "Users"."Email" = Email;

			RETURN QUERY
				SELECT Ok ;
		ELSE
			RETURN QUERY
				SELECT conflict ;

		END IF;
		 
END;
$$;


ALTER FUNCTION public.userchangepassword(oldpassword text, newpassword text, email text) OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 84832)
-- Name: userdelete(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION userdelete(userid bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN    
  UPDATE "Users" SET "IsDelete" = 'True' WHERE "UserId" = UserId;
END;
$$;


ALTER FUNCTION public.userdelete(userid bigint) OWNER TO postgres;

--
-- TOC entry 258 (class 1255 OID 84833)
-- Name: userforgotpassword(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION userforgotpassword(email text, password text) RETURNS TABLE(status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict';  
BEGIN

		 IF EXISTS(SELECT "UserId" FROM "Users" WHERE "Email"= Email AND "IsActive" = True AND "IsDelete" = False  ) THEN
			
			UPDATE "Users" SET 
				"Password" = password
			WHERE "Users"."Email" = Email;

			RETURN QUERY
				SELECT Ok ;
		ELSE
			RETURN QUERY
				SELECT conflict ;

		END IF;
		 
END;
$$;


ALTER FUNCTION public.userforgotpassword(email text, password text) OWNER TO postgres;

--
-- TOC entry 265 (class 1255 OID 84834)
-- Name: usergetall(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION usergetall() RETURNS TABLE("RowNumber" bigint, "UserId" bigint, "Name" text, "ContactNumber" text, "Email" text, "IsActive" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN QUERY

SELECT 
ROW_NUMBER() OVER (ORDER BY "Users"."FirstName" ASC) AS "RowNumber",
"Users"."UserId",
"Users"."FirstName" || ' ' || "Users"."LastName" AS "Name",
"Users"."ContactNumber",
"Users"."Email",
CASE WHEN "Users"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive"
FROM "Users"
WHERE "Users"."IsDelete" = False ORDER BY "Name" ASC;   
END;
$$;


ALTER FUNCTION public.usergetall() OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 84835)
-- Name: usergetbyid(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION usergetbyid(userid bigint) RETURNS TABLE("UserId" bigint, "FirstName" text, "LastName" text, "ContactNumber" text, "Email" text, "IsActive" boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
    SELECT "Users"."UserId", "Users"."FirstName", "Users"."LastName", "Users"."ContactNumber", "Users"."Email", "Users"."IsActive"
	-- CASE WHEN "Users"."IsActive" = TRUE 
-- 	  THEN 'True' ELSE 'False' END AS "IsActive"
    FROM "Users" WHERE "Users"."UserId" = UserId;
END;
$$;


ALTER FUNCTION public.usergetbyid(userid bigint) OWNER TO postgres;

--
-- TOC entry 233 (class 1255 OID 84836)
-- Name: usergetlogindetails(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION usergetlogindetails(email text, password text) RETURNS TABLE("UserId" bigint, "Name" text, status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE Blank text := '';
DECLARE conflict text := 'conflict';
DECLARE inactive text := 'inactive';  
BEGIN

		 IF EXISTS(SELECT "Users"."UserId" FROM "Users" WHERE "Users"."Email"= Email AND "Users"."Password" = password ) THEN
			
			IF EXISTS(SELECT "Users"."UserId" FROM "Users" WHERE "Users"."Email"= Email AND "Users"."IsActive" = True AND "Users"."IsDelete" = False ) THEN
			
				RETURN QUERY
					SELECT "Users"."UserId", "Users"."FirstName" || ' ' || "Users"."LastName" AS "Name", Ok FROM "Users" WHERE "Users"."Email"= Email ; 
			ELSE
				RETURN QUERY
					SELECT cast(0 as bigint), Blank,inactive ;
			END IF;
		ELSE
			RETURN QUERY
				SELECT cast(0 as bigint), Blank, conflict ;

		END IF;
		 
END;
$$;


ALTER FUNCTION public.usergetlogindetails(email text, password text) OWNER TO postgres;

--
-- TOC entry 234 (class 1255 OID 84837)
-- Name: userinsert(text, text, text, text, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION userinsert(firstname text, lastname text, contactnumber text, email text, password text, isactive boolean) RETURNS TABLE("UserId" bigint, "Name" text, "ContactNumber" text, "Email" text, "IsActive" text, status text)
    LANGUAGE plpgsql
    AS $$
DECLARE Ok text := 'Ok';
DECLARE conflict text := 'conflict'; 
BEGIN

		 IF EXISTS(SELECT "Users"."UserId" FROM "Users" WHERE "Users"."Email"= Email AND "Users"."IsDelete" = false) THEN			
			RETURN QUERY
				SELECT cast(0 as bigint),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				cast('' as text),
				conflict;
		ELSE
			
			INSERT INTO "Users"("FirstName",
				"LastName",
				"ContactNumber",
				"Email",
				"Password",
				"IsActive")
			VALUES
				(FirstName
				,LastName
				,ContactNumber
				,Email
				,Password
				,IsActive);

			RETURN QUERY
				SELECT 
					"Users"."UserId",
					"Users"."FirstName" || ' ' || "Users"."LastName" AS "Name",
					"Users"."ContactNumber",
					"Users"."Email",
					CASE WHEN "Users"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive",
					Ok
					FROM "Users"
					WHERE "Users"."UserId" = currval('"User_Sequence"') ;

		END IF;
		 
END;
$$;


ALTER FUNCTION public.userinsert(firstname text, lastname text, contactnumber text, email text, password text, isactive boolean) OWNER TO postgres;

--
-- TOC entry 235 (class 1255 OID 84838)
-- Name: userupdate(text, text, text, boolean, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION userupdate(firstname text, lastname text, contactnumber text, isactive boolean, userid bigint) RETURNS TABLE("UserId" bigint, "Name" text, "ContactNumber" text, "Email" text, "IsActive" text)
    LANGUAGE plpgsql
    AS $$
DECLARE Status text := 'Ok'; 
BEGIN
			UPDATE "Users" SET 
				"FirstName" = FirstName
				,"LastName" = LastName
				,"ContactNumber" = ContactNumber
				,"IsActive" = IsActive
			WHERE "Users"."UserId" = UserId;
			
			RETURN QUERY 
				SELECT 
					"Users"."UserId",
					"Users"."FirstName" || ' ' || "Users"."LastName" AS "Name",
					"Users"."ContactNumber",
					"Users"."Email",
					CASE WHEN "Users"."IsActive" = TRUE THEN 'Active' ELSE 'InActive' END AS "IsActive"
					FROM "Users"
					WHERE "Users"."UserId" = UserId ;
END;
$$;


ALTER FUNCTION public.userupdate(firstname text, lastname text, contactnumber text, isactive boolean, userid bigint) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 187 (class 1259 OID 84839)
-- Name: Answer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Answer" (
    "AnswerId" bigint NOT NULL,
    "Answer" text NOT NULL,
    "SortOrder" numeric
);


ALTER TABLE "Answer" OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 84845)
-- Name: InterviewResult; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "InterviewResult" (
    "InterviewResultId" bigint NOT NULL,
    "InterviewResult" text NOT NULL
);


ALTER TABLE "InterviewResult" OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 84851)
-- Name: InterviewSchedule_InterviewId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "InterviewSchedule_InterviewId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "InterviewSchedule_InterviewId_seq" OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 84853)
-- Name: InterviewStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "InterviewStatus" (
    "InterviewStatusId" bigint NOT NULL,
    "InterviewStatus" text NOT NULL
);


ALTER TABLE "InterviewStatus" OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 84859)
-- Name: Person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Person" (
    "PersonId" bigint NOT NULL,
    "PersonName" text NOT NULL,
    "EmailId" text NOT NULL,
    "IsActive" boolean DEFAULT false NOT NULL,
    "CCMailsId" text
);


ALTER TABLE "Person" OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 84866)
-- Name: QuestionCategory_QuestionCategoryId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "QuestionCategory_QuestionCategoryId_seq"
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "QuestionCategory_QuestionCategoryId_seq" OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 84868)
-- Name: QuestionCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "QuestionCategory" (
    "QuestionCategoryId" bigint DEFAULT nextval('"QuestionCategory_QuestionCategoryId_seq"'::regclass) NOT NULL,
    "QuestionCategoryName" text NOT NULL,
    "DisplayName" text,
    "IsDelete" boolean DEFAULT false NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "SortOrder" integer
);


ALTER TABLE "QuestionCategory" OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 84877)
-- Name: Questions_Sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "Questions_Sequence"
    START WITH 99
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Questions_Sequence" OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 84879)
-- Name: Questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Questions" (
    "QuestionId" bigint DEFAULT nextval('"Questions_Sequence"'::regclass) NOT NULL,
    "Question" text NOT NULL,
    "QuestionCategoryId" bigint NOT NULL,
    "IsActive" boolean DEFAULT false,
    "IsDelete" boolean DEFAULT false,
    "SortOrder" bigint NOT NULL
);


ALTER TABLE "Questions" OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 84888)
-- Name: response_responseid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE response_responseid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE response_responseid_seq OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 84890)
-- Name: Response; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Response" (
    "ResponseId" bigint DEFAULT nextval('response_responseid_seq'::regclass) NOT NULL,
    "QuestionId" bigint NOT NULL,
    "InterviewId" bigint NOT NULL,
    "AnswerId" bigint NOT NULL,
    "Remarks" text,
    "IsUpdate" boolean DEFAULT false
);


ALTER TABLE "Response" OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 84898)
-- Name: User_Sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "User_Sequence"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "User_Sequence" OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 84900)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "Users" (
    "UserId" bigint DEFAULT nextval('"User_Sequence"'::regclass) NOT NULL,
    "FirstName" text,
    "LastName" text,
    "ContactNumber" text,
    "Email" text,
    "Password" text,
    "IsActive" boolean,
    "IsDelete" boolean DEFAULT false
);


ALTER TABLE "Users" OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 84908)
-- Name: Users_UserId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Users_UserId_seq" OWNER TO postgres;

--
-- TOC entry 2268 (class 0 OID 0)
-- Dependencies: 200
-- Name: Users_UserId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Users_UserId_seq" OWNED BY "Users"."UserId";


--
-- TOC entry 201 (class 1259 OID 84910)
-- Name: interviewschedule_interviewid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE interviewschedule_interviewid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE interviewschedule_interviewid_seq OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 84912)
-- Name: interviewschedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE interviewschedule (
    "InterviewId" bigint DEFAULT nextval('interviewschedule_interviewid_seq'::regclass) NOT NULL,
    "PositionName" text NOT NULL,
    "FirstName" text NOT NULL,
    "LastName" text NOT NULL,
    "PhoneNumber" text NOT NULL,
    "AlternatePhoneNumber" text,
    "EmailId" text NOT NULL,
    "Experience" text NOT NULL,
    "ModeofInterview" text NOT NULL,
    "InterviewStatusId" bigint NOT NULL,
    "ToEmail" bigint NOT NULL,
    "CCEmail" text,
    "ScheduleDate" date NOT NULL,
    "ScheduleTime" time without time zone NOT NULL,
    "InterviewResultId" bigint,
    "InterviewStartTime" time without time zone,
    "InterviewEndTime" time without time zone,
    "InterviewScore" text,
    "Recommendations" text,
    "CreatedBy" bigint,
    "CreatedDate" timestamp without time zone,
    "ModifiedBy" bigint,
    "ModifiedDate" timestamp without time zone,
    "ReportShared" boolean DEFAULT false NOT NULL,
    "IsDelete" boolean DEFAULT false NOT NULL,
    "Resume" text,
    "IsActive" boolean,
    "IsInvoiced" boolean DEFAULT false,
    "IsArchived" boolean DEFAULT false
);


ALTER TABLE interviewschedule OWNER TO postgres;

--
-- TOC entry 2127 (class 2606 OID 84924)
-- Name: Answer Answer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Answer"
    ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("AnswerId");


--
-- TOC entry 2129 (class 2606 OID 84926)
-- Name: InterviewResult InterviewResult_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "InterviewResult"
    ADD CONSTRAINT "InterviewResult_pkey" PRIMARY KEY ("InterviewResultId");


--
-- TOC entry 2143 (class 2606 OID 84928)
-- Name: interviewschedule InterviewSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY interviewschedule
    ADD CONSTRAINT "InterviewSchedule_pkey" PRIMARY KEY ("InterviewId");


--
-- TOC entry 2131 (class 2606 OID 84930)
-- Name: InterviewStatus InterviewStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "InterviewStatus"
    ADD CONSTRAINT "InterviewStatus_pkey" PRIMARY KEY ("InterviewStatusId");


--
-- TOC entry 2133 (class 2606 OID 84932)
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY ("PersonId");


--
-- TOC entry 2135 (class 2606 OID 84934)
-- Name: QuestionCategory QuestionCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "QuestionCategory"
    ADD CONSTRAINT "QuestionCategory_pkey" PRIMARY KEY ("QuestionCategoryId");


--
-- TOC entry 2137 (class 2606 OID 84936)
-- Name: Questions Questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Questions"
    ADD CONSTRAINT "Questions_pkey" PRIMARY KEY ("QuestionId");


--
-- TOC entry 2139 (class 2606 OID 84938)
-- Name: Response Response_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Response"
    ADD CONSTRAINT "Response_pkey" PRIMARY KEY ("ResponseId");


--
-- TOC entry 2141 (class 2606 OID 84940)
-- Name: Users User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Users"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserId");


--
-- TOC entry 2269 (class 0 OID 0)
-- Dependencies: 202
-- Name: interviewschedule; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE interviewschedule TO PUBLIC;


-- Completed on 2017-11-02 10:50:15

--
-- PostgreSQL database dump complete
--

