import boto3


# Initialize the S3 client
s3 = boto3.client('s3')

# select the S3 bucket
bucket_name = 'elasticbeanstalk-helloworldbucket04224f88-akmbpvnn1hxb'
print(f"WAR file uploading to S3 bucket: {bucket_name}")

# Upload your WAR file to the bucket
war_file_path = '../../corvallis-happenings/target/corvallis-happenings-0.0.1-SNAPSHOT.war'
s3.upload_file(war_file_path, bucket_name, 'hello-world.war')

print(f"WAR file uploaded to S3 bucket: {bucket_name}")
