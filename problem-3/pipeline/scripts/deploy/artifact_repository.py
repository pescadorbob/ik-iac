import boto3
import botocore
class ArtifactRepository:

    def __init__(self,bucket_name):
        self.bucket_name = bucket_name

    def exists(self,  key):
        s3 = boto3.resource('s3')        
        bucket_name = self.bucket_name
        try:
            s3.Object(bucket_name, key).load()
            print(f"File '{key}' exists in bucket '{bucket_name}'.")
            return True
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == '404':
                print(f"File '{key}' does not exist in bucket '{bucket_name}'.")
                return False
            else:
                print(f"An error occurred: {e}")
                raise e
    
    def delete(self,  key):
        bucket_name = self.bucket_name
        s3 = boto3.client('s3')

        # select the S3 bucket
        print(f"deleting {key} from S3 bucket: {bucket_name}")

        # delete the file
        s3.delete_object(Bucket=bucket_name, Key=key)

        print(f"file deleted from S3 bucket: {bucket_name}")

        return True
    
    def publish(self,  key, file_location):
        bucket_name = self.bucket_name
        s3 = boto3.client('s3')

        # select the S3 bucket
        print(f"uploading {key} to S3 bucket: {bucket_name} from {file_location}")

        # Upload your WAR file to the bucket
        s3.upload_file(file_location, bucket_name, key)

        print(f"file uploaded to S3 bucket: {bucket_name}")

        return True
                
