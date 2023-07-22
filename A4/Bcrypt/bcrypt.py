import bcrypt
import json

def lambda_handler(event, context):
    try:
        # Parse the JSON input data
        input_data = json.loads(event['body'])

        # Perform the Bcrypt hashing operation on the provided input data
        salt = bcrypt.gensalt()
        hashed_data = bcrypt.hashpw(input_data['data'].encode('utf-8'), salt).decode()

        # Return the hashed result as the response
        return {
            'statusCode': 200,
            'body': json.dumps({'hashed_data': hashed_data})
        }
    except Exception as e:
        print('Error during Bcrypt hashing:', e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error'})
        }