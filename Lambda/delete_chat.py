import json
import boto3
from boto3.dynamodb.conditions import Key

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
message_table = dynamodb.Table('ChatMessagesTable')
chat_table = dynamodb.Table('chatTable')

def lambda_handler(event, context):
    # Parse request body
    body = json.loads(event['body'])
    userId = body['userId']
    chatId = event['pathParameters']['chatId']
    
    # Set CORS headers
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "DELETE"
    }

    try:
        # Delete the chat from DynamoDB
        response = chat_table.delete_item(
            Key={
                'chatId': chatId
            },
            ConditionExpression='posterId = :userId OR accepterId = :userId',  
            ExpressionAttributeValues={
                ':userId': userId
            }
        )
        
        # Query for all messages associated with the chat ID
        messages_response = message_table.query(
            KeyConditionExpression=Key('chatId').eq(chatId)
        )
        
        # Iterate over the messages and delete them one by one
        for item in messages_response['Items']:
            timestamp = item['timestamp']
            # Delete the message from the DynamoDB table
            message_response = message_table.delete_item(
                Key={
                    'chatId': chatId,
                    'timestamp': timestamp
                }
            )

        # Return success response
        return {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": headers,
            'body': json.dumps({'message': 'chat deleted successfully'})
        }
    except Exception as e:
        # Return error response if deletion fails
        print(e)
        return {
            "isBase64Encoded": False,
            "statusCode": 500,
            "headers": headers,
            'body': json.dumps({'error': str(e)})
        }
