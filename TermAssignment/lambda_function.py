import json
import boto3
import requests

s3 = boto3.client("s3")
open_weather_map_api_key = "895284fb2d2c50a520ea537456963d9c"

def lambda_handler(event, context):
    if 'body' in event:
        request_body = json.loads(event['body'])
        
    else:
        request_body=event
        
    email = request_body['email']
    location = request_body['location']

    try:
        # Fetch weather data from the third-party API (OpenWeatherMap)
        weather_api_url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&units=imperial&appid={open_weather_map_api_key}"
        weather_response = requests.get(weather_api_url)
        weather_data = weather_response.json()

        # Create an object with weather information
        weather_info = {
            "location": weather_data["name"],
            "temperature": round(weather_data["main"]["temp"], 2),
            "description": weather_data["weather"][0]["main"],
            "feelsLike": round(weather_data["main"]["feels_like"], 2),
            "humidity": weather_data["main"]["humidity"],
            "windSpeed": round(weather_data["wind"]["speed"], 2),
        }

        # Convert the weather information to JSON string
        weather_info_string = json.dumps(weather_info)

        # Store the weather information in S3
        bucket_name = "weatheralertdata"  # Replace with your S3 bucket name
        key = f"{location}.json"  # Use the location as the filename
        s3.put_object(Bucket=bucket_name, Key=key, Body=weather_info_string, ContentType="application/json")

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Weather information stored in S3."}),
        }
    except Exception as e:
        print(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "An error occurred. Please try again."}),
        }
