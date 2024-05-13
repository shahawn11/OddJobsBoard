import json
import boto3
import hashlib
import uuid  # Import the uuid module for generating unique IDs

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('userTable')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    email = body.get("email", "").lower()
    password = body.get("password", "")
    
    headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST"
}
    
    # Check if the user already exists
    response = table.query(
        IndexName='email-index',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
    )
    
    if response.get('Count'):
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'User already exists'})
        }

    # Generate a unique ID for the user
    user_id = str(uuid.uuid4())

    # Hash the password before storing it
    hashed_password = hash_password(password)

    # Store the user's ID, email, and hashed password in DynamoDB
    table.put_item(Item={'userId': user_id, 'email': email, 'password': hashed_password})

    return {
        'statusCode': 201,
        'headers': headers,
        'body': json.dumps({'message': 'User registered successfully'})
    }

def hash_password(password):
    # Hash the password using SHA-256 algorithm
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    return hashed_password
