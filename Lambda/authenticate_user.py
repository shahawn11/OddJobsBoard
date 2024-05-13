import json
import hashlib
import boto3
import jwt

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('userTable')

def lambda_handler(event, context):
    # Extract request body from event
    if isinstance(event['body'], str):
        body = json.loads(event['body'])
    else:
        body = event['body']
        
    email = body.get("email", "").lower()
    password = body.get("password", "")

    # Query the userTable using the global secondary index on email
    response = table.query(
        IndexName='email-index',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
    )
    # Get the first item from the response
    user_item = response.get('Items')[0] if 'Items' in response else None

    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
    }

    # Check if the user exists
    if not user_item:
        return {
            "isBase64Encoded": "false",
            "statusCode": 404,
            "headers": headers,
            "body": json.dumps({"message": "User not found"})
        }

    # Verify the password
    hashed_password = user_item.get('password')
    if not verify_password(password, hashed_password):
        return {
            "isBase64Encoded": "false",
            "statusCode": 401,
            "headers": headers,
            "body": json.dumps({"message": "Incorrect password"})
        }

    # Generate JWT token
    token = generate_jwt_token(user_item)

    # Return token to client
    return {
        "isBase64Encoded": "false",
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"token": token, "message": "User authenticated successfully"})
    }

def verify_password(password, hashed_password):
    # Hash the provided password and compare it with the stored hashed password
    return hashlib.sha256(password.encode()).hexdigest() == hashed_password

def generate_jwt_token(user_item):
    # Generate JWT token with email and userId as payload
    payload = {
        "email": user_item['email'],
        "userId": user_item['userId']  # Assuming 'userId' is the key for the user ID in your DynamoDB table
        # You can add additional claims as needed
    }
    return jwt.encode(payload, "your_secret_key", algorithm="HS256")
