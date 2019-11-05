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
        
        
    // Build network resources

    //   VPC

    //   Security Group

    //   Network Load Balancer

    //   Target Group

    //   Listeners - 80
    

    // Fargate application

    //   ECS Cluster

    //   Docker Image

    //   Fargate Task

    //   Application Container

    //   Execution Role (Module 2 only)

    //   Fargate Service

    //   Autoscaling Capabilities
    

    // Custom VPC Endpoint (Module 2 only)
    
    
  }
}
