import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('JobsTable')  # Replace 'JobsTable' with your table name

# Lambda function to fetch all jobs
def lambda_handler(event, context):
    try:
        response = table.scan()
        items = response['Items']  # Extract the 'Items' array from the response
        return {
            'statusCode': 200,
            'body': json.dumps(items)  # Return the 'Items' array directly
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to fetch jobs'})
        }
