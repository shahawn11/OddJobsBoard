# OddJobsBoard
Website link: http://oddjobs123.s3-website-us-east-1.amazonaws.com

Odd Jobs Board is a web application that allows users to post odd jobs they need assistance with and browse through existing job listings to find opportunities.

**Features**
* User Authentication: Users can sign up for an account or log in to an existing account to access the platform.
* Post Jobs: Logged-in users can post new job listings, including job title, description, and location.
* Search Jobs: Users can search for specific jobs using keywords.
* View Jobs: Users can view all existing job listings.
* Chat Integration: Users can communicate with job posters via chat for further details or inquiries.


It is a serverless web application leveraging the power of AWS services, the application provides a scalable and cost-effective solution for job management and communication.

## Architecture Overview
The architecture of Odd Jobs Board utilizes several key AWS services:

* **Amazon S3 (Simple Storage Service)**: S3 is used to host the static assets of the web application, including HTML, CSS, and JavaScript files.
The frontend of the application is served directly from S3 buckets, ensuring fast and reliable content delivery to users.
* **Amazon API Gateway**: API Gateway serves as the entry point for client requests to the backend of the application.
It provides RESTful APIs that integrate with Lambda functions to handle various operations such as job posting, job search, and user authentication.
* **AWS Lambda**: Lambda functions are used to implement the business logic of the application.
Each API endpoint defined in API Gateway is associated with a Lambda function, which executes the necessary code to fulfill the request.
For example, a Lambda function might handle job posting requests by storing job details in DynamoDB or retrieving job listings from the database.
* **Amazon DynamoDB**: DynamoDB is used as the NoSQL database to store job listings, user data, and other application-related information.
It provides a highly scalable and fully managed database solution, allowing the application to handle a large volume of data and concurrent requests.

### Benefits of Serverless Architecture

* **Scalability**: With AWS Lambda and DynamoDB, the application can automatically scale to handle varying levels of traffic without the need for manual intervention. This ensures optimal performance and responsiveness for users.

* **Cost-effectiveness**: Serverless architecture follows a pay-as-you-go model, where you only pay for the resources consumed during execution. This eliminates the need for provisioning and maintaining servers, resulting in cost savings for the organization.

* **High Availability**: AWS services are designed to be highly available and fault-tolerant. By leveraging services like S3, API Gateway, Lambda, and DynamoDB, the application can achieve high availability and durability of data.

* **Developer Productivity**: Serverless architecture simplifies infrastructure management and allows developers to focus on writing code rather than managing servers. This accelerates development cycles and enables faster time-to-market for new features and updates.

### Deployment Process
1. **Frontend Deployment:**

   - Static assets (HTML, CSS, JavaScript) are uploaded to an S3 bucket and configured for static website hosting.
   - The S3 bucket is configured with appropriate permissions to allow public access to the frontend assets.
    
2. **Backend Deployment:**

   - Lambda functions are deployed using AWS SAM (Serverless Application Model) or the AWS Management Console.
   - API Gateway is configured to integrate with Lambda functions using HTTP methods and resource paths.
   - DynamoDB tables are provisioned with the required read and write capacity to support the application workload.
    
3. **Configuration and Testing:**

   - Integration tests are conducted to verify the functionality of API endpoints and data persistence in DynamoDB.
   - Monitoring and logging are configured using AWS CloudWatch to track application performance and troubleshoot issues.
    
### Conclusion
Odd Jobs Board demonstrates the power and flexibility of serverless architecture on AWS. By leveraging services like S3, API Gateway, Lambda, and DynamoDB, the application delivers a scalable, cost-effective, and highly available solution for managing odd jobs and facilitating communication between users.
