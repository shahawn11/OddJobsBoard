import json
import boto3

# Initialize AWS SDK
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('chatTable') 

def lambda_handler(event, context):
    #print("Event:", json.dumps(event))
    # Extract user ID from the request
    user_id = event['pathParameters']['user-id']
    print(user_id)
    
    # Query the database for chats associated with the user
    response = table.scan(
        FilterExpression="posterId = :userId or accepterId = :userId",
        ExpressionAttributeValues={":userId": user_id}
    )
    
    # Extract the list of chats from the response
    chats = response['Items']
    
    headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST"
}
    
    # Prepare the response object
    response_body = {
        "isBase64Encoded": "false",
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps(chats)
    }
    
    return response_body
