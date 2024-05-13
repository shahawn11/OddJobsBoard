import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
job_table = dynamodb.Table('JobsTable')
chat_table = dynamodb.Table('chatTable')

def lambda_handler(event, context):
    job_id = event['jobId']
    accepter_id = event['userId']  # Get the accepter's user ID from the request context
    
    chat_id = str(uuid.uuid4())
    
    # Retrieve job details from DynamoDB
    response = job_table.get_item(Key={'jobId': job_id})
    job = response['Item']
    
    # Create a chat between job poster and accepter
    create_chat(chat_id, job['posterId'], accepter_id, job_id, job['title'])
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Job accepted successfully', 'chatId': chat_id, 'title': job['title']})
    }


def create_chat(chat_id, poster_id, accepter_id, job_id, job_title):
    # Add logic to create a chat in DynamoDB
    chat = {
        'chatId': chat_id,
        'posterId': poster_id,
        'accepterId': accepter_id,
        'jobId': job_id,
        'title': job_title,
        # Add additional chat attributes as needed
    }
    chat_table.put_item(Item=chat)
