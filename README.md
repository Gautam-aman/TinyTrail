# TinyTrail: A Simple URL Shortener

![Java](https://img.shields.io/badge/Java-28.2%25-E00000?style=for-the-badge&logo=java)
![JavaScript](https://img.shields.io/badge/JavaScript-70.9%25-F7DF1E?style=for-the-badge&logo=javascript)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven)

A simple and efficient URL shortener built using Java. This project allows you to shorten long URLs into compact, easy-to-share links and track their usage.

Perfect for learning backend development, REST APIs, and database integration with Java.

## Features

* **Shorten Long URLs:** Convert any long URL into a compact TinyTrail link.
* **Link Redirection:** Automatically redirects the short link to the original destination.
* **Usage Tracking:**  Track the number of clicks for each shortened link.
* **REST API:** A clean and simple API for creating and managing links.

## Tech Stack

### Backend (Java)
* **Java:** Java 20
* **Framework:** Spring Boot
* **Build Tool:** Maven
* **Database:** PostgreSQL

### Frontend (JavaScript)
* **Framework:** React
* **Package Manager:** npm

## Installation and Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Java JDK 20
* Maven
* npm
* MySQL

### 1. Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Gautam-aman/TinyTrail.git](https://github.com/Gautam-aman/TinyTrail.git)
    cd TinyTrail/Backend
    ```

2.  **Configure Database:**
    * Navigate to `src/main/resources/application.properties` (or `.yml`).
    * Update the database connection settings (URL, username, password).
    ```properties
    
    # spring.datasource.url= ${DATABASE_UR}
    # spring.datasource.username=root
    # spring.datasource.password=your_password
    # spring.jpa.hibernate.ddl-auto=update
    # spring.jpa.show-sql=true
    # spring.jpa.database-platform= ${DATABASE_DIALECT}
    # jwt_expiration = ${JWT_EXPIRATION}
    # jwt_secret = ${JWT_SECRET}
    # FRONTEND_URL = ${FRONTEND_URL}
    ```

3.  **Install Dependencies and Build:**
    ```sh
    mvn clean install
    ```

4.  **Run the application:**
    ```sh
    
    mvn spring-boot:run
    ```
    The backend server will start on `http://localhost:8080` (or as configured).

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The frontend application will open in your browser at `http://localhost:3000`.


### Create a Short URL

* **POST** `/api/v1/shorten`
* **Body (JSON):**
    ```json
    {
      "originalUrl": "[https://www.very-long-url-to-shorten.com/example](https://www.very-long-url-to-shorten.com/example)"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "shortUrl": "http://localhost:8080/aB12Cd"
    }
    ```

### Redirect URL

* **GET** `/{shortCode}`
* **Example:** `GET http://localhost:8080/aB12Cd`
* **Response:**
    * Redirects (302) to `https://www.very-long-url-to-shorten.com/example`

## License

This project does not currently have a license. 
