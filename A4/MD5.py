import hashlib
import json

def lambda_handler(event, context):
    try:
        # Parse the JSON input data
        input_data = json.loads(event['body'])

        # Perform the hashing operation (MD5) on the provided input data
        hashed_data = hashlib.md5(input_data['data'].encode('utf-8')).hexdigest()

        # Return the hashed result as the response
        return {
            'statusCode': 200,
            'body': json.dumps({'hashed_data': hashed_data})
        }
    except Exception as e:
        print('Error during MD5 hashing:', e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error'})
        }
