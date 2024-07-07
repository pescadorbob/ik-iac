import boto3

def deploy_to_eb(bucket_name, object_key, environment_name, application_name,version):
    try:
        # Initialize the Elastic Beanstalk client
        eb_client = boto3.client('elasticbeanstalk')

        # Create a new application version
        response = eb_client.create_application_version(
            ApplicationName=application_name,
            VersionLabel=version,  # Replace with your desired version label
            SourceBundle={
                'S3Bucket': bucket_name,
                'S3Key': object_key
            }
        )

        # Deploy the new version to the environment
        eb_client.update_environment(
            EnvironmentName=environment_name,
            VersionLabel=version  # Same version label as above
        )

        print(f"New version {version} deployed to {environment_name}")
    except Exception as e:
        print(f"Error deploying: {str(e)}")

if __name__ == "__main__":
    bucket_name = 'dev-hello-world-war-bucke-devhelloworldbucket2aaee-wwaurlhxofux'
    object_key = 'hello-world.war'
    environment_name = 'hello-worldEnvironment'
    application_name = 'hello-world'

    deploy_to_eb(bucket_name, object_key, environment_name, application_name)
