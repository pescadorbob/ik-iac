# Troubleshooting

If it won't start, attempt to create the stack manually.

## Create the ElasticBeanstalk Role and Instance Profile

Create an IAM role, similar to the one in the cdk index.ts file. E.g.

- Name: AWSElasticBeanstalkWorkerTier
- ServicePrincipal: 'ec2.amazonaws.com'
- Permissions:
  - AWSElasticBeanstalkWebTier
  - AWSElasticBeanstalkMulticontainerDocker
  - AWSElasticBeanstalkWorkerTier

**Notice the instance profile**
![Instance Profile](image-3.png)

Creating the role creates an instance profile with an ARN that can be used for creating the ElasticBeanstalk environment.

**ARN:** arn:aws:iam::905418093247:instance-profile/HelloWorldElasticBeanstalkControllerRole

## Configure service access

to help troubleshoot, you'll need an EC2 key pair and an EC2 instance profile
unrelated to any cdk generated instance profile to ensure you can manage
their lifecycles separately. I.e. you don't want the dependency or else you won't be able to delete the stack without finding all the references first.
![Service Access](image-4.png)

After you start up your service and check you still can't connect, connect through the ssh.

![ec2-login](image-5.png)
![Success!](image-6.png)

### Find the tomcat instance

```shell
$ ps -ef | grep tomcat
tomcat      2012       1  0 15:56 ?        00:00:08 /usr/lib/jvm/jre/bin/java -DJDBC_CONNECTION_STRING= -Xms256m -Xmx256m -classpath /usr/share/tomcat10/bin/bootstrap.jar:/usr/share/tomcat10/bin/tomcat-juli.jar: -Dcatalina.base=/usr/share/tomcat10 -Dcatalina.home=/usr/share/tomcat10 -Djava.endorsed.dirs= -Djava.io.tmpdir=/var/cache/tomcat10/temp -Djava.util.logging.config.file=/usr/share/tomcat10/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager org.apache.catalina.startup.Bootstrap start
```

### check where it's deployed to

```shell
cd /usr/share/tomcat10
ls
bin  conf  lib  logs  temp  webapps  work
$ cd webapps/
$ ls
ROOT
$ cd ROOT
$ ls
META-INF  org  WEB-INF
$ ls WEB-INF/classes/edu/brent/ik/iac/corvallis_happenings/
CorvallisHappeningsApplication.class  HelloWorldController.class  ServletInitializer.class
```

this verifies all the files arrived.

### Verify tomcat is listening with curl

```shell
$ curl -X GET http://localhost:8080/hello
<!doctype html><html lang="en"><head><title>HTTP Status 404 – Not Found</title><style type="text/css">body {font-family:Tahoma,Arial,sans-serif;} h1, h2, h3, b {color:white;background-color:#525D76;} h1 {font-size:22px;} h2 {font-size:16px;} h3 {font-size:14px;} p {font-size:12px;} a {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 404 – Not Found</h1><hr class="line" /><p><b>Type</b> Status Report</p><p><b>Message</b> The requested resource [&#47;hello] is not available</p><p><b>Description</b> The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.</p><hr class="line" /><h3>Apache Tomcat/10.1.24</h3></body></html>
```

So, even though this has deployed to root, and all the classes are there. Tomcat still isn't serving this. Let's check the logs!

### Check the logs

```shell
]$ more catalina.2024-06-29.log
29-Jun-2024 15:56:55.992 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server version name:   Apache Tomcat/10.1.24
29-Jun-2024 15:56:56.001 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server built:          Aug 8 2023 00:00:00 UTC
29-Jun-2024 15:56:56.001 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server version number: 10.1.24.0
29-Jun-2024 15:56:56.002 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log OS Name:               Linux
29-Jun-2024 15:56:56.002 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log OS Version:            6.1.92-99.174.amzn2023.x86
_64
29-Jun-2024 15:56:56.002 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Architecture:          amd64
29-Jun-2024 15:56:56.002 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Java Home:             /usr/lib/jvm/java-17-amazo
n-corretto.x86_64
29-Jun-2024 15:56:56.002 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log JVM Version:           17.0.11+9-LTS
29-Jun-2024 15:56:56.003 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log JVM Vendor:            Amazon.com Inc.
29-Jun-2024 15:56:56.003 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log CATALINA_BASE:         /usr/share/tomcat10
29-Jun-2024 15:56:56.003 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log CATALINA_HOME:         /usr/share/tomcat10
29-Jun-2024 15:56:56.005 INFO [main] org.apache.catalina.core.AprLifecycleListener.lifecycleEvent The Apache Tomcat Native library which all
ows using OpenSSL was not found on the java.library.path: [/usr/java/packages/lib:/usr/lib64:/lib64:/lib:/usr/lib]
29-Jun-2024 15:56:56.564 INFO [main] org.apache.coyote.AbstractProtocol.init Initializing ProtocolHandler ["http-nio-8080"]
29-Jun-2024 15:56:56.635 INFO [main] org.apache.catalina.startup.Catalina.load Server initialization in [1066] milliseconds
29-Jun-2024 15:56:56.730 INFO [main] org.apache.catalina.core.StandardService.startInternal Starting service [Catalina]
29-Jun-2024 15:56:56.732 INFO [main] org.apache.catalina.core.StandardEngine.startInternal Starting Servlet engine: [Apache Tomcat/10.1.24]
29-Jun-2024 15:56:56.746 INFO [main] org.apache.catalina.startup.HostConfig.deployDirectory Deploying web application directory [/var/lib/to
mcat10/webapps/ROOT]
29-Jun-2024 15:56:59.552 INFO [main] org.apache.jasper.servlet.TldScanner.scanJars At least one JAR was scanned for TLDs yet contained no TL
Ds. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JAR
s during scanning can improve startup time and JSP compilation time.
29-Jun-2024 15:56:59.782 INFO [main] org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory [/var/li
b/tomcat10/webapps/ROOT] has finished in [3,036] ms
29-Jun-2024 15:56:59.790 INFO [main] org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler ["http-nio-8080"]
29-Jun-2024 15:56:59.809 INFO [main] org.apache.catalina.startup.Catalina.start Server startup in [3172] milliseconds
```

From the logs, it seems like it was started up successfully listening to port 8080, and that it deployed the web application to the ROOT.

Locally this means I can hit the root directory **http://localhost:8080** and get a response.

#### check the access logs then

```shell
[ec2-user@ip-172-31-47-1 logs]$ more localhost_access_log.txt
127.0.0.1 - - [29/Jun/2024:16:05:19 +0000] "GET / HTTP/1.1" 404 752
127.0.0.1 - - [29/Jun/2024:16:05:19 +0000] "GET /favicon.ico HTTP/1.1" 404 763
127.0.0.1 - - [29/Jun/2024:16:05:29 +0000] "GET /hello HTTP/1.1" 404 757
127.0.0.1 - - [29/Jun/2024:16:05:40 +0000] "GET / HTTP/1.1" 404 752
0:0:0:0:0:0:0:1 - - [29/Jun/2024:16:13:25 +0000] "GET /hello HTTP/1.1" 404 757
0:0:0:0:0:0:0:1 - - [29/Jun/2024:16:13:44 +0000] "GET / HTTP/1.1" 404 752
0:0:0:0:0:0:0:1 - - [29/Jun/2024:16:19:58 +0000] "GET /hello HTTP/1.1" 404 757
```

all **404s**

### check the spring logs

**Elastic Beanstalk Instance**

```shell
$ more localhost.2024-06-29.log
29-Jun-2024 15:56:59.704 INFO [main] org.apache.catalina.core.ApplicationContext.log 1 Spring WebApplicationInitializers detected on classpath
```

This shows that spring isn't starting up in elastic beanstalk! Compare this log the a fresh deployment in the local tomcat.

**Local Tomcat Instance**

```shell
28-Jun-2024 14:16:14.196 INFO [Catalina-utility-1] org.apache.catalina.core.ApplicationContext.log 2 Spring WebApplicationInitializers detected on classpath
28-Jun-2024 14:16:17.572 INFO [Catalina-utility-1] org.apache.catalina.core.ApplicationContext.log Initializing Spring embedded WebApplicationContext
```

This gives us something to go on. the WebApplicationInitializers were detected in EB, but then didn't proceed. Why not?

** Check Java Versions **

In my case, I see that I'm building the jar with java 22, and the platform is using Corretto 17 with the Tomcat 10 instance. This will not work. I would have thought I'd see some sort of error somewhere, but, even so.

Let's rebuild the jar with corretto 17, rather than 22 and see if that fixes our error!

That solves it!

**Tear down the manual instance**
