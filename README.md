# API Builder Application

A React-based application for building and managing database APIs with a user-friendly interface.

## Features

- Database connection management
- Table selection and column inspection
- API endpoint builder with parameter configuration
- SQL query generation
- API categorization and management
- Modern Material-UI interface

## Prerequisites

- Node.js 14.16.0
- MySQL or compatible database server

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd api-build-example
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
npm run server
```

2. In a new terminal, start the React development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Database Connection**
   - Enter your database credentials
   - Test the connection
   - Select the database to work with

2. **Table Selection**
   - Browse available tables
   - View table structure
   - Select a table for API creation

3. **API Builder**
   - Define API name and HTTP method
   - Configure API path
   - Select columns to include
   - Add request parameters
   - Choose API category
   - Generate SQL query

4. **API Management**
   - View all created APIs
   - Inspect API details
   - Delete unwanted APIs
   - Test generated endpoints

## Project Structure

```
api-build-example/
├── src/
│   ├── components/
│   │   ├── Navigation.js
│   │   ├── DatabaseConnection.js
│   │   ├── TableSelection.js
│   │   ├── ApiBuilder.js
│   │   └── ApiList.js
│   └── App.js
├── server/
│   └── index.js
├── package.json
└── README.md
```

## Dependencies

- React 17.x.x
- Material-UI v4.x.x
- Express.js
- MySQL2
- Axios
- React Router

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 