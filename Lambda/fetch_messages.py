import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
message_table = dynamodb.Table('ChatMessagesTable')

def lambda_handler(event, context):
    # Extract chat ID from the event
    chat_id = event['pathParameters']['chatId']
    
    # Query chat messages from DynamoDB
    response = message_table.query(
        KeyConditionExpression='chatId = :chat_id',
        ExpressionAttributeValues={':chat_id': chat_id}
    )
    
    # Extract messages from the response
    messages = response['Items']
    
    # Convert Decimal objects to string for serialization
    for message in messages:
        for key, value in message.items():
            if isinstance(value, Decimal):
                message[key] = str(value)
                
    # Set CORS headers
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
    }
    
    # Prepare the response object
    response_body = {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(messages)
    }
    
    return response_body
