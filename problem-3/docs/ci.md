# Continuous Integration using the Runtime Spec

**Make it environmentally aware** You may have realized that so far, this war is very simplistic. It doesn't connect to anything, it isn't environmentally aware. Any application that does anything has a database. It probably has at least one lower environment to test integrations as well, before getting shipped off to prod. Our application is only prints hello world. How would you know if you ever actually deployed a new version correctly? If the new version had an updated bug fix, or domain model, how would you know the fix works to go to production. How would you check your deployment shipped successfully?

So far, there is no way to tell if it shipped correctly. The next level uses the Elastic Beanstalk Runtime Spec **.ebextensions** to make the war environmentally aware and make it so that the deployment can detect and report a deployment failure.

# Smoke check on the version using Spring Actuator
To handle this, we need something that changes with every deploy that we can check. How about the version? Spring has a ready made extension just for this. It's called the actuator. Let's install it!

Add the [actuator as described here](https://docs.spring.io/spring-boot/reference/actuator/enabling.html).

```xml
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-actuator</artifactId>
	</dependency>
</dependencies>
```

[Add the build info information as well as described here](https://howtodoinjava.com/spring-boot/info-endpoint-custom-info/)

After redeploying, you could now see information that changes with every build:

```shell
curl -X GET http://localhost:8080/actuator/info | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   616    0   616    0     0   1330      0 --:--:-- --:--:-- --:--:--  1333
{
...
  "build": {
    "artifact": "corvallis-happenings",
    "name": "corvallis-happenings",
    "time": "2024-06-30T01:38:41.510Z",
    "version": "0.0.1-SNAPSHOT",
    "group": "edu.brent.ik.iac"
  },
}
```

# Check the deployed version automatically
Well that's great that we can see the version of the latest build `"version":"0.0.1-SNAPSHOT"`. We can also see the timestamp `"2024-06-30T01:38:41.510Z"`.  This will be unique for every build and will therefore serve our purpose nicely. But we need our deployment to be able to tell though. 

Let's write a python script that can hit the endpoint and tell us when deployment has completed and the new deployment has the right version and timestamp in the environment.

From a Clean Architecture / TDD perspective. let's first write component that can parse the info and compare metadata.

In pipeline, create a `tests` folder. Create a python test file called `test_deployment_info_validator.py`

```python

```

