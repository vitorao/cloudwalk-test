## Game Log Analyzer

### 1. Tasks

- **Read the Log File**: Parse the log file containing game data.
- **Group Game Data**: Group the game data of each match for analysis.
- **Collect Kill Data**: Gather information on kills during matches.
- **Generate Reports**: Develop a script to produce a report for each match, including grouped information, and create a player ranking.
- **Death Cause Analysis**: Compile a report detailing deaths grouped by their cause for each match.

### 2. How to Execute

#### 2.1 Requirements
Ensure you have the following installed:
- **Node.js**: Required for running JavaScript applications.
- **ts-node**: TypeScript execution environment and REPL for Node.js.

#### 2.2 Execution Steps
1. Install dependencies:
```
npm install
```
2. Run the development server:
```
npm run dev
```

### 3. Using the API

Once the server is running, access the following endpoints to retrieve data:

- **Game Data Endpoint**: 
- [GET] [http://localhost:8080/game-data](http://localhost:8080/game-data)

- **Deaths Report Endpoint**:
- [GET] [http://localhost:8080/deaths-report](http://localhost:8080/deaths-report)

### 4. Unit Tests

To ensure code quality and functionality, run unit tests using:

```
npm run test
```
