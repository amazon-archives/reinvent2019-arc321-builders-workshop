# Re:Invent 2019 ARC321  Builders Workshop
## Enabling AWS PrivateLink with the AWS Cloud Development Kit
---
## Overview

AWS PrivateLink provides private network access to AWS services and your own SaaS-style services. In this solution, learn how to use the AWS Cloud Development Kit ([CDK](https://aws.amazon.com/cdk/)) to create a reusable component that sets up a proxy layer for resources that don’t natively support AWS PrivateLink.

You will need an AWS account to complete this soluton.  In this example, we will be using [Cloud9](https://aws.amazon.com/cloud9/)  as our development enviornment.   If you would like to use a local development enviornment and need guidance with setting up permission, please refer to the [AWS CLI Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)


## Getting Started
If you do not have an existing Cloud9 environment go ahead and set one up following the [AWS Cloud9  Cloud Based IDE QuickStart](https://aws-quickstart.s3.amazonaws.com/quickstart-cloud9-ide/doc/aws-cloud9-cloud-based-ide.pdf)  

Here is the architecture schema of what we want to achieve with CDK:  

![Proxy layer](https://github.com/aws-samples/reinvent2019-arc321-builders-workshop/raw/lePaulo-preparing-builder-session/architecture.png)  

We have: 
 * One VPC to configure. You can build a simple one here, for instance with a CIDR of 10.0.0.0/24  
 * Build a security group for your Fargate task. We will deal with a Squid process here, so please choose to open port 3128 on all private CIDR ranges (192.168.0.0/16, 172.16.0.0/12, 10.0.0.0/8).
 * Build your Docker image, using the Dockerfile you will have in the 'docker-image' directory (check [DockerImageAsset](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecr-assets.DockerImageAsset.html)).
 * Build an ECS Cluster
 * Prepare a FargateTaskDefinition and add a container with the image created with the DockerImageAsset component and port 3128
 * Grant the execution role of the FargateTaskDefinition with the ability to pull the docker image from the ECR registry of the DockerImageAsset component
 * Create a FargateService that will host our proxy layer application
 * Create a Network Load Balancer and attach to it a target group on port 3128 with 2 network listeners: one that will listen to port 80 and the other one to port 443.
 * Add Fargate service autoscaling capabilities
 * `npm run build`
 * `cdk bootstrap aws://946534826477/us-west-2`
 * `cdk deploy`
And we're done!

Now we can create our VPC Endpoint Service configuration on the Network Load Balancer and mount it as a proxy on any other VPC (TODO details).

## References for CDK components to be used within our session

 * Vpc
 * SecurityGroup
 * [DockerImageAsset](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecr-assets.DockerImageAsset.html)
 * Cluster
 * FargateTaskDefinition
 * NetworkLoadBalancer
 * NetworkTargetGroup
 * NetworkListener
 * FargateService
 * AwsCustomResource


## License

This library is licensed under the MIT-0 License. See the LICENSE file.

