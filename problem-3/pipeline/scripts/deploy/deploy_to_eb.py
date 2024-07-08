import boto3
from ..dev_config import DevConfig

def deploy_to_eb(config:DevConfig, object_key, environment_name, application_name,version):
    # Initialize the Elastic Beanstalk client
    eb_client = boto3.client('elasticbeanstalk')

    # Create a new application version
    create_application_response = eb_client.create_application_version(
        ApplicationName=application_name,
        VersionLabel=version,  # Replace with your desired version label
        SourceBundle={
            'S3Bucket': config.artifactory_bucket,
            'S3Key': object_key
        }
    )
    print(create_application_response)
    if create_application_response['ApplicationVersion']['Status'] == 'Failed':
        raise Exception(f"Failed to create application version with result {create_application_response['ApplicationVersion']['Status']}")

    # Deploy the new version to the environment
    update_environment_response = eb_client.update_environment(
        EnvironmentName=environment_name,
        VersionLabel=version  # Same version label as above
    )
    print(update_environment_response)

    print(f"New version {version} deployed to {environment_name}")
