from common.command import Command

command = Command()
target_directory = f"prepare-environment/elasticbeanstalk-environment"

commands = [
    'npm.cmd install',
    'npm.cmd run build',
    'npm.cmd install --global cdk',
    'cdk.cmd bootstrap --context environment=dev ',
    'cdk.cmd synth --context environment=dev ',
    'cdk.cmd deploy --require-approval never --context environment=dev --all',
]
for cmd in commands:
    result, last_line = command.execute_with_dir(target_directory, cmd)
    assert result == 0
