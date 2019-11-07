import cdk = require('@aws-cdk/core');
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
import path = require('path');
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import elb = require('@aws-cdk/aws-elasticloadbalancingv2');
import { AwsCustomResource } from '@aws-cdk/custom-resources';

export class AwsEndpointProxyCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
        
    // Build a simple VPC here, for instance with a CIDR of 10.0.0.0/24
    
    
    // Build a SecurityGroup for your Fargate task. 
    // We will deal with a Squid process here, so please choose to open port 3128 
    // on all private CIDR ranges (192.168.0.0/16, 172.16.0.0/12, 10.0.0.0/8).
    
    
    // Build your Docker image, using the Dockerfile you will have in the 'docker-image' 
    // directory.
    // (check https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecr-assets.DockerImageAsset.html).
    
    
    // Prepare a FargateTaskDefinition and add a container with the image created
    // with the DockerImageAsset component and port 3128
    
    
    // Grant the execution role of the FargateTaskDefinition with the ability to pull
    // the docker image from the ECR registry of the DockerImageAsset component
     
    
    // Create a NetworkLoadBalancer and attach to it a NetworkTargetGroup on port 3128
    // with 2 NetworkListeners: one that will listen to port 80 and the other one to port 443.
    
    
    // Build an ECS Cluster
    
    
    // Create a FargateService that will host our proxy layer application
    
    
    // Add the network target group you have created for your load balancer to your
    // FargateService component
    
    
    // Add Fargate service autoscaling capabilities
    
    
    // Bonus: Try implementing here an AwsCustomResource to create VPC Endpoint Service
    // configuration on your Network Load Balancer, or you can also do it with the CLI.

    
  }
}
