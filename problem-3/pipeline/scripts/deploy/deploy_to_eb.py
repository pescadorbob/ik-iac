import boto3
from ..dev_config import DevConfig

def deploy_to_eb(config:DevConfig, object_key, environment_name, application_name,version):
    # Initialize the Elastic Beanstalk client
    eb_client = boto3.client('elasticbeanstalk')

    # Create a new application version
    response = eb_client.create_application_version(
        ApplicationName=application_name,
        VersionLabel=version,  # Replace with your desired version label
        SourceBundle={
            'S3Bucket': config.artifactory_bucket,
            'S3Key': object_key
        }
    )

    # Deploy the new version to the environment
    eb_client.update_environment(
        EnvironmentName=environment_name,
        VersionLabel=version  # Same version label as above
    )

    print(f"New version {version} deployed to {environment_name}")
