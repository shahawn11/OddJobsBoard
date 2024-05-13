import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
chat_table = dynamodb.Table('chatTable')
message_table = dynamodb.Table('ChatMessagesTable')

def lambda_handler(event, context):
    try:
        # Extract necessary information from the event
        chat_id = event['chatId']
        sender_id = event['userId']
        message_content = event['content']
        
        # Generate unique message ID
        message_id = str(uuid.uuid4())
        
        # Get current timestamp
        timestamp = int(datetime.now().timestamp())
        
        # Construct message item
        message_item = {
            'chatId': chat_id,
            'messageId': message_id,
            'timestamp': timestamp,
            'senderId': sender_id,
            'content': message_content
        }
        
        # Put the message into the DynamoDB table
        message_table.put_item(Item=message_item)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Message sent successfully'})
        }
    except KeyError as e:
        # Handle missing key error
        error_message = f'Missing key in event: {str(e)}'
        return {
            'statusCode': 400,
            'body': json.dumps({'error': error_message})
        }
    except Exception as e:
        # Handle other exceptions
        error_message = f'An error occurred: {str(e)}'
        return {
            'statusCode': 500,
            'body': json.dumps({'error': error_message})
        }
