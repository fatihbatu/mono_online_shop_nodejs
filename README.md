# Mono E-Shop API

Mono E-Shop API is a Node.js based RESTful API for a simple e-commerce platform. The project is structured to follow a clean architecture with separation of concerns among different modules.

## Project Structure

The project follows a modular structure organized as follows:

- `src/`: Source code directory.
  - `api/`: Contains route handlers and middlewares.
  - `config/`: Contains configuration files.
  - `database/`: Contains database connection, models, and repositories.
  - `services/`: Contains business logic.
  - `utils/`: Contains utility files for error handling and other common utilities.
- Root directory contains essential configuration and log files.

## Prerequisites

- Node.js v14 or later.
- A MongoDB database.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fatihbatu/mono_online_shop_nodejs
   cd mono-e-shop
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Update the `.env` file with your database credentials and other configurations.

## Running the Application

1. To start the development server:

   ```bash
   npm run dev
   ```

2. Access the API on `http://localhost:8000/`.

## Database Seeding

1. To seed the database with sample data:
   ```bash
   npm run seed
   ```

## Testing

1. Import the Postman collection `mono e-shop.postman_collection.json` to test the API endpoints.

## API Documentation

The project's API documentation is available via Postman collection.

## Error Logs

Error logs are captured in the `app_error.log` file at the root of the project.

## Contributing

If you'd like to contribute, please fork the repository, create a new branch for your feature or bugfix, and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
