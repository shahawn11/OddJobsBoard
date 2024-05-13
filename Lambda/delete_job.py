import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = 'JobsTable'  # Replace 'YourTableName' with the actual name of your DynamoDB table
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    # Parse request body
    body = json.loads(event['body'])
    userId = body['userId']
    jobId = event['pathParameters']['jobId']
    
    # Set CORS headers
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE"
    }

    try:
            # Check if the user is authorized to delete the job
            # For example, check if the userId matches the userId associated with the job

            # Delete the job from DynamoDB
        response = table.delete_item(
            Key={
                'jobId': jobId
            },
            ConditionExpression='posterId = :userId',  # Ensure that only the user who posted the job can delete it
            ExpressionAttributeValues={
                ':userId': userId
            }
        )

        # Return success response
        return {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": headers,
            'body': json.dumps({'message': 'Job deleted successfully'})
        }
    except Exception as e:
        # Return error response if deletion fails
        return {
            "isBase64Encoded": False,
            "statusCode": 500,
            "headers": headers,
            'body': json.dumps({'error': str(e)})
        }

