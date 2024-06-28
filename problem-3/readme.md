# Problem 3

Select an application written in a language that is supported by an application runtime like Google App Engine Standard Environment or AWS Elastic Beanstalk.
Alternatively, create a simple application with a health endpoint.
If the service requires a database or other external connection, set up those resources using whichever tool you prefer.
Create a spec file for the application runtime.
Using the cloud provider’s console or CLI, deploy the application using your spec file.
Verify the deployment and that the application is running as expected.

Deliverables
Create an application runtime spec file for the service you choose.
Create a document containing documentation for this process.
Include a step-by-step process for deploying future versions.
Include a section explaining how to verify the service is running as expected.
If you run into issues, add an FAQ section to help avoid them in the future.

# Solution

I'll start with a simple spring boot app that just says Hello World to make this really easy. I used the spring initializer.

# Initialization

This starts with just a basic spring boot app, without a rest controller or anything:

```java
@SpringBootApplication
public class CorvallisHappeningsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CorvallisHappeningsApplication.class, args);
	}

}
```

```java
public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(CorvallisHappeningsApplication.class);
	}

}
```

running the command `mvn springboot:run` results in a server that is listening, but no resources.

```shell
2024-06-27T17:26:57.428-07:00  INFO 10540 --- [corvallis-happenings] [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8080 (http)
```

```shell
curl http://localhost:8080
curl : The remote server returned an error: (404) Not Found.
```

# Add a rest controller for hello world
```java
@RestController
public class HelloWorldController {
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello World!";
    }
}
```

**Note:** Live upload made it so I don't have to restart!

```shell
2024-06-27T17:36:43.883-07:00  INFO 10540 --- [corvallis-happenings] [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 0 ms
```

```shell
curl http://localhost:8080/hello


StatusCode        : 200
StatusDescription :
Content           : Hello World!
RawContent        : HTTP/1.1 200
                    Keep-Alive: timeout=60
                    Connection: keep-alive
                    Content-Length: 12
                    Content-Type: text/plain;charset=UTF-8
                    Date: Fri, 28 Jun 2024 00:36:43 GMT

                    Hello World!
Forms             : {}
Headers           : {[Keep-Alive, timeout=60], [Connection, keep-alive], [Content-Length,     
                    12], [Content-Type, text/plain;charset=UTF-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 12
```

Commit

# Make a target for AWS ElasticBeanstalk
Make the target for elastic beanstalk by creating a war and deploying to Tomcat locally.

## install tomcat

[Tomcat install](https://tomcat.apache.org/)

I installed mine here: `~\work\software\apache-tomcat-10.1.25`

I like to add it temporarily to my visual studio code workspace:

![tomcat added](image.png)


### Configure Tomcat Users:

Let’s make these changes in `$CATALINA_HOME\conf\tomcat-users:`


```xml
<role rolename="manager-gui"/>
<role rolename="manager-script"/>
<user username="admin" password="password" roles="manager-gui, manager-script"/>
```

### set directory permissions

```shell
chmod 755 webapps
```

### test startup

from $CATALINA_HOME\bin
```shell
.\startup.bat 
...
27-Jun-2024 17:59:18.705 INFO [main] org.apache.catalina.startup.Catalina.start Server startup in [1355] milliseconds
```

```shell
curl http://localhost:8080
...


StatusCode        : 200
StatusDescription : 
Content           : 
                    
                    
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <title>Apache Tomcat/10.1.25</title>
                            <link href="favicon.ico" rel="icon" type="image/x-icon" />...
RawContent        : HTTP/1.1 200 
                    Transfer-Encoding: chunked
                    Keep-Alive: timeout=20
                    Connection: keep-alive
                    Content-Type: text/html;charset=UTF-8
                    Date: Fri, 28 Jun 2024 01:02:25 GMT
                    
                    
                    
                    
                    <!DOCTYPE html>
                    <html la...
Forms             : {}
Headers           : {[Transfer-Encoding, chunked], [Keep-Alive, timeout=20], [Connection, keep-alive], [Content-Type, text/html;charset=UTF-8]...}
Images            : {@{innerHTML=; innerText=; outerHTML=<IMG id=tomcat-logo alt="[tomcat logo]" src="tomcat.svg">; outerText=; tagName=IMG; id=tomcat-logo; alt=[tomcat logo]; src=tomcat.svg}}
InputFields       : {}
Links             : {@{innerHTML=Home; innerText=Home; outerHTML=<A href="https://tomcat.apache.org/">Home</A>; outerText=Home; tagName=A; href=https://tomcat.apache.org/}, 
                    @{innerHTML=Documentation; innerText=Documentation; outerHTML=<A href="/docs/">Documentation</A>; outerText=Documentation; tagName=A; href=/docs/}, 
                    @{innerHTML=Configuration; innerText=Configuration; outerHTML=<A href="/docs/config/">Configuration</A>; outerText=Configuration; tagName=A; href=/docs/config/}, 
                    @{innerHTML=Examples; innerText=Examples; outerHTML=<A href="/examples/">Examples</A>; outerText=Examples; tagName=A; href=/examples/}...}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 11417


```

