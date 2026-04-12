CREATE TABLE "public"."Students" (
  "student_id" serial PRIMARY KEY,
  "first_name" varchar(30) NOT NULL,
  "last_name" varchar(30) NOT NULL,
  "date_of_birth" date NOT NULL,
  "email" varchar(50) NOT NULL,
  "phone" varchar(20) NOT NULL,
  "street" varchar(50) NOT NULL,
  "city" varchar(20) NOT NULL,
  "state" char(2) NOT NULL,
  "country" varchar(15) NOT NULL,
  "zip" varchar(10) NOT NULL,
  "enrollment_date" date NOT NULL,
  "degree_level" varchar(10) NOT NULL,
  "degree_major" varchar NOT NULL,
  "major" varchar(35) NOT NULL,
  "student_status" varchar(10) DEFAULT 'active' NOT NULL,
  CHECK (
        zip ~ '^[0-9]{5}$'
        OR zip ~ '^[0-9]{5}-[0-9]{4}$'
    ),
  CHECK (
        phone ~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$'
        OR phone ~ '^[0-9]{3}-[0-9]{3}-[0-9]{4}$'
        OR phone ~ '^[0-9]{10}$'
    )
);

CREATE TABLE "public"."Teachers" (
  "teacher_id" serial PRIMARY KEY,
  "first_name" varchar(30) NOT NULL,
  "last_name" varchar(30) NOT NULL,
  "date_of_birth" date NOT NULL,
  "email" varchar(50) NOT NULL,
  "phone" varchar(20) NOT NULL,
  "hire_date" date DEFAULT CURRENT_DATE NOT NULL,
  "department" varchar(20) NOT NULL,
  "street" varchar(50) NOT NULL,
  "city" varchar(20) NOT NULL,
  "state" char(2) NOT NULL,
  "country" varchar(15) NOT NULL,
  "zip" varchar(10) NOT NULL,
  "teacher_status" varchar(10) DEFAULT 'active' NOT NULL,
  CHECK (
        zip ~ '^[0-9]{5}$'
        OR zip ~ '^[0-9]{5}-[0-9]{4}$'
    ),
  CHECK (
        phone ~ '^\([0-9]{3}\)[0-9]{3}-[0-9]{4}$'
        OR phone ~ '^[0-9]{3}-[0-9]{3}-[0-9]{4}$'
        OR phone ~ '^[0-9]{10}$'
    )
);

CREATE TABLE "public"."Terms" (
  "term_id" serial PRIMARY KEY,
  "term_name" varchar(10) NOT NULL,
  "date_start" date DEFAULT CURRENT_DATE,
  "date_end" date
);

CREATE TABLE "public"."Courses" (
  "course_id" serial PRIMARY KEY,
  "course_code" varchar(10) NOT NULL,
  "course_title" varchar(50) NOT NULL,
  "course_description" text NOT NULL,
  "course_status" varchar(10) DEFAULT 'active' NOT NULL
);

CREATE TABLE "public"."Assignments" (
  "assignment_id" serial PRIMARY KEY,
  "course_id" integer NOT NULL,
  "week_num" integer NOT NULL,
  "assignment_title" varchar(30) NOT NULL,
  "assignment_description" text NOT NULL,
  "max_points" integer NOT NULL,
  "extra_credit" boolean DEFAULT false
);

CREATE TABLE "public"."Term_Courses" (
  "term_course_id" serial PRIMARY KEY,
  "teacher_id" integer,
  "term_id" integer NOT NULL,
  "course_id" integer NOT NULL,
  "num_students" integer DEFAULT 0
);

CREATE TABLE "public"."Student_Course_Enrollments" (
  "enrollment_id" serial PRIMARY KEY,
  "student_id" integer NOT NULL,
  "term_course_id" integer NOT NULL,
  "enrollment_date" date DEFAULT CURRENT_DATE,
  "grade_num" integer DEFAULT 0,
  "grade_let" varchar(2)
);

CREATE TABLE "public"."Student_Course_Assignment_Grades" (
  "grade_id" serial PRIMARY KEY,
  "student_id" integer NOT NULL,
  "term_course_id" integer NOT NULL,
  "assignment_id" integer NOT NULL,
  "completed" boolean DEFAULT false,
  "points_earned" integer NOT NULL,
  "due_date" date NOT NULL,
  "submission_date" date,
  "feedback" text
);

CREATE TABLE "public"."Billings" (
  "billing_id" serial PRIMARY KEY,
  "student_id" integer NOT NULL,
  "amount_due" decimal NOT NULL,
  "amount_paid" decimal DEFAULT 0,
  "due_date" date NOT NULL,
  "payment_date" date,
  "billing_status" varchar(10) DEFAULT 'unpaid' NOT NULL,
  "billing_notes" text
);

CREATE TABLE "public"."Authentications" (
  "auth_id" serial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "role_id" integer NOT NULL,
  "username" varchar unique NOT NULL,
  "password_hash" varchar NOT NULL,
  "password_salt" varchar NOT NULL,
  "last_login" date,
  "failed_logins" integer DEFAULT 0,
  "is_locked" boolean DEFAULT false
);

CREATE TABLE "public"."Roles" (
  "role_id" serial PRIMARY KEY,
  "role_name" varchar(30) NOT NULL,
  "role_description" text NOT NULL,
  "permissions" text NOT NULL
);

ALTER TABLE "public"."Students" ADD CONSTRAINT student_status_values
  CHECK ("student_status" IN ('active', 'inactive', 'suspended', 'graduated'));

ALTER TABLE "public"."Students" ADD CONSTRAINT student_degree_level_values
  CHECK ("degree_level" IN ('Associate', 'Bachelor', 'Master', 'Doctorate'));

ALTER TABLE "public"."Teachers" ADD CONSTRAINT student_status_values
  CHECK ("teacher_status" IN ('active', 'inactive', 'suspended', 'retired', 'fired'));

ALTER TABLE "public"."Courses" ADD CONSTRAINT course_status_values
  CHECK ("course_status" IN ('active', 'inactive', 'dead'));

ALTER TABLE "public"."Billings" ADD CONSTRAINT billing_status_values
  CHECK ("billing_status" IN ('paid', 'unpaid','overdue'));

ALTER TABLE "public"."Assignments" ADD CONSTRAINT assignment_course_id_fkey FOREIGN KEY (course_id)
  REFERENCES "public"."Courses" (course_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Term_Courses" ADD CONSTRAINT term_courses_teacher_id_fkey FOREIGN KEY (teacher_id)
  REFERENCES "public"."Teachers" (teacher_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Term_Courses" ADD CONSTRAINT term_clasess_term_id_fkey FOREIGN KEY (term_id)
  REFERENCES "public"."Terms" (term_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Term_Courses" ADD CONSTRAINT term_clasess_course_id_fkey FOREIGN KEY (course_id)
  REFERENCES "public"."Courses" (course_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Course_Enrollments" ADD CONSTRAINT student_course_enrollments_student_id_fkey FOREIGN KEY (student_id)
  REFERENCES "public"."Students" (student_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Course_Enrollments" ADD CONSTRAINT student_course_enrollments_course_id_fkey FOREIGN KEY (term_course_id)
  REFERENCES "public"."Term_Courses" (term_course_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Course_Assignment_Grades" ADD CONSTRAINT student_course_assignment_grades_student_id_fkey FOREIGN KEY (student_id)
  REFERENCES "public"."Students" (student_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Course_Assignment_Grades" ADD CONSTRAINT student_course_assignment_grades_term_course_id_fkey FOREIGN KEY (term_course_id)
  REFERENCES "public"."Term_Courses" (term_course_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Course_Assignment_Grades" ADD CONSTRAINT student_course_assignment_grades_assignment_id_fkey FOREIGN KEY (assignment_id)
  REFERENCES "public"."Assignments" (assignment_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Billings" ADD CONSTRAINT billings_student_id_fkey FOREIGN KEY (student_id)
  REFERENCES "public"."Students" (student_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Authentications" ADD CONSTRAINT authentications_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES "public"."Students" (student_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Authentications" ADD CONSTRAINT authentications_role_id_fkey FOREIGN KEY (role_id)
  REFERENCES "public"."Roles" (role_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

GRANT ALL ON TABLE "public"."Students" TO api_anon_user;
GRANT ALL ON TABLE "public"."Teachers" TO api_anon_user;
GRANT ALL ON TABLE "public"."Terms" TO api_anon_user;
GRANT ALL ON TABLE "public"."Courses" TO api_anon_user;
GRANT ALL ON TABLE "public"."Assignments" TO api_anon_user;
GRANT ALL ON TABLE "public"."Term_Courses" TO api_anon_user;
GRANT ALL ON TABLE "public"."Student_Course_Enrollments" TO api_anon_user;
GRANT ALL ON TABLE "public"."Student_Course_Assignment_Grades" TO api_anon_user;
GRANT ALL ON TABLE "public"."Billings" TO api_anon_user;
GRANT ALL ON TABLE "public"."Authentications" TO api_anon_user;
GRANT ALL ON TABLE "public"."Roles" TO api_anon_user;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api_anon_user;