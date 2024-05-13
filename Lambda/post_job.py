import json
import boto3
import uuid

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
job_table = dynamodb.Table('JobsTable')  # Replace 'JobsTable' with your job table name

# Lambda function to post a new job
def lambda_handler(event, context):
    request_body = event
    
    # Extract userId from the request body
    userId = request_body.get('userId')

    if not userId:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Missing userId'})
        }

    # Generate a unique job ID
    job_id = str(uuid.uuid4())

    # Create a new job item with posterId as userId
    job_item = {
        'jobId': job_id,
        'title': request_body['title'],
        'description': request_body['description'],
        'location': request_body['location'],
        'posterId': userId  # Include the userId as the posterId
        # Add more fields as needed
    }

    # Put the job item into the DynamoDB table
    job_table.put_item(Item=job_item)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Job posted successfully'})
    }
