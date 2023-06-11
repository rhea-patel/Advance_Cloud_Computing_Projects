import grpc
from concurrent import futures
import computeandstorage_pb2
import computeandstorage_pb2_grpc
import boto3

AWS_ACCESS_KEY = 'ASIA5IKR2KVY4YRMCAOD'
AWS_SECRET_KEY = 'HsqG5kWZOQcl+STfVxb0A+9NDhVFwfGngWMAwGb9'
AWS_SESSION_TOKEN = 'FwoGZXIvYXdzEI7//////////wEaDAYQDvNNmJzrD7Ro/CK7AfcrD9qAMCvJpXowxenBXgFags1vw8xwN3H6oB2ucKhKM2W0lVSHFVlAWe1xPwcuquhBIie4DuVSySI8FIPpBWr7Bgm7WIbRy43Q1xAUv5hep/WBYYMHZwDn9WAd6YP5y9g8ErNo0ulwONjsdF2HjaIiCQs4Hp/MGCgkuaJbsmU26rTPXRdyJ74VqrmM6PHFvk4enxAlJwqNXJGC1vP/S5k5E/fiESobisNzt7fb+9lHQ8ImADW8tRgYUHsonOSYpAYyLXPWbAQ6HddM98WDG/2f3pDxRkoFQvRo2g0fKchZVQz+7F24/kUooVFsTvEE0g=='

S3_BUCKET_NAME = 'csci5409'
S3_FILE_NAME = 's3.txt'


def store_data(data):
    s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY,
                             aws_session_token=AWS_SESSION_TOKEN)

    response = s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=S3_FILE_NAME, Body=data)

    url = s3_client.generate_presigned_url('get_object', Params={'Bucket': S3_BUCKET_NAME, 'Key': S3_FILE_NAME})

    return url


def append_data(data):
    s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY,
                             aws_session_token=AWS_SESSION_TOKEN)

    response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=S3_FILE_NAME)
    existing_data = response['Body'].read().decode('utf-8')

    updated_data = existing_data + data

    response = s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=S3_FILE_NAME, Body=updated_data)
    url = s3_client.generate_presigned_url('get_object', Params={'Bucket': S3_BUCKET_NAME, 'Key': S3_FILE_NAME})

    return url


def delete_file(url):
    file_name = url.split('/')[-1].split('?')[0]
    s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY,
                             aws_session_token=AWS_SESSION_TOKEN)
    response = s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=file_name)


class EC2OperationsServicer(computeandstorage_pb2_grpc.EC2OperationsServicer):
    def StoreData(self, request, context):
        data = request.data
        url = store_data(data)
        return computeandstorage_pb2.StoreReply(s3uri=url)

    def AppendData(self, request, context):
        data = request.data
        url = append_data(data)
        return computeandstorage_pb2.AppendReply()

    def DeleteFile(self, request, context):
        url = request.s3uri.strip('{}')
        delete_file(url)
        return computeandstorage_pb2.DeleteReply()


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    computeandstorage_pb2_grpc.add_EC2OperationsServicer_to_server(EC2OperationsServicer(), server)
    server.add_insecure_port('0.0.0.0:50051')
    print("Server started, listening on 0.0.0.0:50051")
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
