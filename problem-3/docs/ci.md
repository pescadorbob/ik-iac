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
