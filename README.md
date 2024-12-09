# EHR Dashboard

The **EHR Dashboard** is a web application designed to provide a visual interface for Electronic Health Records (EHR). This dashboard allows healthcare professionals and patients to view, analyze, and interact with patient health data efficiently. It offers distinct views for both patients and clinicians, enhancing accessibility and usability for each user group.

## Features

- **Patient View**: Allows patients to securely access and view their own medical data, including recent test results, medical history, and health trends over time.
- **Clinician View**: Enables clinicians to view and manage health data for their assigned patients. Clinicians can quickly access patient records, monitor health metrics, and view historical data to support informed decision-making.
- **Data Visualization**: Provides graphs and charts to display trends in health metrics, helping both patients and clinicians track health changes over time.
- **Interactive Interface**: Designed with a user-friendly and responsive interface for easy navigation and data retrieval.

## Tech Stack

- **Framework**: Meteor.js
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Data Visualization**: Chart.js 
- **Database**: MongoDB (default with Meteor)


## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version >= 16.x)
- **Meteor CLI**  
  Install Meteor CLI globally:
  ```bash
  curl https://install.meteor.com/ | sh
  ```
  


### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lattln/EHR-Dashboard.git
   ```
   ```bash
   cd EHR-Dashboard
   ```

3. Install dependencies:  
   ```bash
   meteor npm install
   ```

4. Run the app:  
   ```bash
   meteor run
   ```

6. Open the app in your browser:
   ```bash
   http://localhost:3000
   ```

## Folder Structure

"EHR-Dashboard/"
├── "client/"            # Client-side code  
├── "server/"            # Server-side code  
├── "imports/"           # Shared imports (UI, APIs, methods)  
│   ├── "ui/"            # React components  
│   ├── "api/"           # Meteor methods and publications  
│   └── "startup/"       # Initialization code (client/server)  
├── "public/"            # Static assets  
├── "private/"           # Private assets  
├── ".env.example"       # Environment variable template  
├── "Dockerfile"         # Docker configuration  
├── "README.md"          # Project documentation  
└── "package.json"       # Project dependencies  


## License

This project is licensed under the MIT License.

## Contact

For inquiries, reach out to the maintainers:

**Lin Latt**  
[GitHub Profile](https://github.com/lattln)  
[LinkedIn Profile](https://linkedin.com/in/lin-latt)
