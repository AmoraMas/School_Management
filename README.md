# School_Management
Project for CTU: Create an online portal to track Teachers, Students, Courses, and Grades.

Steps to reproduce...
1. Download and install Docker to your local machine
2. Download and install git to your local machine
3. Download and install npm to your local machine
4. Clone this git repository

    4.1. cd /path/to/directory/

    4.2. git clone [git project address]
5. Add your .env files

   5.1. .env in root directory
    * #Postgres parameters
    * #Parameters used during the initial database setup
    * POSTGRES_DB = app_db
    * POSTGRES_USER = app_user
    * POSTGRES_PASSWORD = please_change_me
    * 
    * #PostgREST parameters
    * #DB connection string used from PostgREST to PostgreSQL Server
    * PGRST_DB_URI = postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    * PGRST_OPENAPI_SERVER_PROXY_URI = http://127.0.0.1:3001
    * 
    * #List with one or more schemas that will be served as REST API by PostgREST
    * PGRST_DB_SCHEMAS = "public"
    * 
    * #DB role that will be used for public API access
    * PGRST_DB_ANON_ROLE = "api_anon_user"
    * 
    * #PgAdmin Parameters
    * PGADMIN_DEFAULT_EMAIL=usuario@email.com
    * PGADMIN_DEFAULT_PASSWORD=2HxTJ8YQpb8z4CaVvyP5PKgS
    * 
    * #App API location
    * API="http://localhost:3001"
    * VITE_API_URL="http://localhost:3001"

    5.2. .env.development file under ./app/
    * REACT_APP_WEBSITE_TITLE="School Management Development"
    * VITE_API_URL=http://localhost:3001
    * REACT_APP_API=http://localhost:3001
    
    5.3. .env.production file under ./app/
    * REACT_APP_WEBSITE_TITLE="School Management Development"
    * VITE_API_URL=http://localhost:3001
    * REACT_APP_API=http://localhost:3001

6. run docker compose up