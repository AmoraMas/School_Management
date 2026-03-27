CREATE TABLE "public"."Students" (
  "student_id" serial PRIMARY KEY,
  "first_name" varchar(30) NOT NULL,
  "last_name" varchar(30) NOT NULL,
  "date_of_birth" date NOT NULL,
  "email" varchar(50) NOT NULL,
  "phone" varchar(13) NOT NULL,
  "address" text NOT NULL,
  "enrollment_date" date NOT NULL,
  "student_status" varchar(10) DEFAULT 'active' NOT NULL
);

CREATE TABLE "public"."Teachers" (
  "teacher_id" serial PRIMARY KEY,
  "first_name" varchar(30) NOT NULL,
  "last_name" varchar(30) NOT NULL,
  "date_of_birth" date NOT NULL,
  "email" varchar(50) NOT NULL,
  "phone" varchar(13) NOT NULL,
  "hire_date" date DEFAULT CURRENT_DATE NOT NULL,
  "department" varchar(20) NOT NULL,
  "address" text NOT NULL,
  "teacher_status" varchar(10) DEFAULT 'active' NOT NULL
);

CREATE TABLE "public"."Terms" (
  "term_id" serial PRIMARY KEY,
  "term_name" varchar(10) NOT NULL,
  "date_start" date DEFAULT CURRENT_DATE,
  "date_end" date
);

CREATE TABLE "public"."Classes" (
  "class_id" serial PRIMARY KEY,
  "class_code" varchar(10) NOT NULL,
  "class_title" varchar(50) NOT NULL,
  "class_description" text NOT NULL,
  "class_status" varchar(10) DEFAULT 'active' NOT NULL
);

CREATE TABLE "public"."Assignments" (
  "assignment_id" serial PRIMARY KEY,
  "class_id" integer NOT NULL,
  "week_num" integer NOT NULL,
  "assignment_title" varchar(30) NOT NULL,
  "assignment_description" text NOT NULL,
  "max_points" integer NOT NULL
);

CREATE TABLE "public"."Term_Classes" (
  "term_class_id" serial PRIMARY KEY,
  "teacher_id" integer,
  "term_id" integer NOT NULL,
  "num_students" integer DEFAULT 0
);

CREATE TABLE "public"."Student_Class_Enrollments" (
  "enrollment_id" serial PRIMARY KEY,
  "student_id" integer NOT NULL,
  "term_class_id" integer NOT NULL,
  "enrollment_date" date NOT NULL,
  "grade_num" integer DEFAULT 0,
  "grade_Let" varchar(2)
);

CREATE TABLE "public"."Student_Class_Assignment_Grades" (
  "grade_id" serial PRIMARY KEY,
  "student_id" integer NOT NULL,
  "term_class_id" integer NOT NULL,
  "assignment_id" integer NOT NULL,
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
  CHECK ("student_status" IN ('active', 'inactive', 'graduated'));

ALTER TABLE "public"."Teachers" ADD CONSTRAINT student_status_values
  CHECK ("teacher_status" IN ('active', 'inactive', 'graduated'));

ALTER TABLE "public"."Classes" ADD CONSTRAINT class_status_values
  CHECK ("class_status" IN ('active', 'inactive', 'dead'));

ALTER TABLE "public"."Billings" ADD CONSTRAINT billing_status_values
  CHECK ("billing_status" IN ('paid', 'unpaid','overdue'));

ALTER TABLE "public"."Assignments" ADD CONSTRAINT assignment_class_id_fkey FOREIGN KEY (class_id)
  REFERENCES "public"."Classes" (class_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Term_Classes" ADD CONSTRAINT term_classes_teacher_id_fkey FOREIGN KEY (teacher_id)
  REFERENCES "public"."Teachers" (teacher_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Term_Classes" ADD CONSTRAINT term_clasess_term_id_fkey FOREIGN KEY (term_id)
  REFERENCES "public"."Terms" (term_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Class_Enrollments" ADD CONSTRAINT student_class_enrollments_student_id_fkey FOREIGN KEY (student_id)
  REFERENCES "public"."Students" (student_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Class_Enrollments" ADD CONSTRAINT student_class_enrollments_class_id_fkey FOREIGN KEY (term_class_id)
  REFERENCES "public"."Term_Classes" (term_class_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Class_Assignment_Grades" ADD CONSTRAINT student_class_assignment_grades_student_id_fkey FOREIGN KEY (student_id)
  REFERENCES "public"."Students" (student_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Class_Assignment_Grades" ADD CONSTRAINT student_class_assignment_grades_term_class_id_fkey FOREIGN KEY (term_class_id)
  REFERENCES "public"."Term_Classes" (term_class_id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE No ACTION;

ALTER TABLE "public"."Student_Class_Assignment_Grades" ADD CONSTRAINT student_class_assignment_grades_assignment_id_fkey FOREIGN KEY (assignment_id)
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
GRANT ALL ON TABLE "public"."Classes" TO api_anon_user;
GRANT ALL ON TABLE "public"."Assignments" TO api_anon_user;
GRANT ALL ON TABLE "public"."Term_Classes" TO api_anon_user;
GRANT ALL ON TABLE "public"."Student_Class_Enrollments" TO api_anon_user;
GRANT ALL ON TABLE "public"."Student_Class_Assignment_Grades" TO api_anon_user;
GRANT ALL ON TABLE "public"."Billings" TO api_anon_user;
GRANT ALL ON TABLE "public"."Authentications" TO api_anon_user;
GRANT ALL ON TABLE "public"."Roles" TO api_anon_user;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api_anon_user;