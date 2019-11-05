import cdk = require('@aws-cdk/core');
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
import path = require('path');
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import elb = require('@aws-cdk/aws-elasticloadbalancingv2');

export class AwsEndpointProxyCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "SquidVPC", {
      cidr: "10.0.0.0/26", // CIDR of the desired VPC (/28 is sufficient here)
      maxAzs: 3 // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "AWSEndpointProxyCluster", {
      vpc: vpc
    });
    
    //Build the image from the right directory
    const __dirname = path.resolve();
    const dockerImageAsset = new DockerImageAsset(this, "AWSEndpointProxyDockerImageAsset", {
      directory: path.join(__dirname, 'docker-image'),
    });
    
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, "AWSEndpointProxyFargateTaskDefinition", {
            memoryLimitMiB: 512,
            cpu: 256
    });
    
    const appContainer = fargateTaskDefinition.addContainer("Container", {
            image: ecs.ContainerImage.fromRegistry(dockerImageAsset.imageUri)
    });
    
    appContainer.addPortMappings({
            containerPort: 3128
        });
        
    const executionRole = fargateTaskDefinition.obtainExecutionRole()
    dockerImageAsset.repository.grantPull(executionRole.grantPrincipal)
    
    const loadBalancer = new elb.NetworkLoadBalancer(this, "AWSEndpointProxyNetworkLoadBalancer", {
      vpc: vpc,
      crossZoneEnabled: true,
      internetFacing: true // Default is false
    })
    
    const securityGroup = new ec2.SecurityGroup(this, "TaskSecurityGroup", {
      vpc: vpc,
    })
    securityGroup.addIngressRule(ec2.Peer.ipv4("192.168.0.0/16"), ec2.Port.tcp(3128))
    securityGroup.addIngressRule(ec2.Peer.ipv4("172.16.0.0/12"), ec2.Port.tcp(3128))
    securityGroup.addIngressRule(ec2.Peer.ipv4("10.0.0.0/8"), ec2.Port.tcp(3128))
    
    const fargateService = new ecs.FargateService(this, "AWSEndpointProxyFargateService", {
      cluster: cluster,
      desiredCount: 2,
      taskDefinition: fargateTaskDefinition,
      securityGroup: securityGroup
    });
    
    const targetGroupSquid = new elb.NetworkTargetGroup(this, "NetNetworkTargetGroupSquid", {
      port: 3128,
      vpc: vpc,
      targetType: elb.TargetType.IP
    });
    
    const networkListener80 = new elb.NetworkListener(this, "NetworkListenerHTTP", {
      loadBalancer: loadBalancer,
      port: 80
    });
    
    networkListener80.addTargetGroups("DefaultTargetGroup", targetGroupSquid)
    
    const networkListener443 = new elb.NetworkListener(this, "NetworkListenerHTTPS", {
      loadBalancer: loadBalancer,
      port: 443
    });
    
    networkListener443.addTargetGroups("DefaultTargetGroup", targetGroupSquid)
    
    fargateService.attachToNetworkTargetGroup(targetGroupSquid)
    
    const scaling = fargateService.autoScaleTaskCount({
      minCapacity: 2,
      maxCapacity: 10 
    });
    
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(10),
      scaleOutCooldown: cdk.Duration.seconds(10)
    });
    
  }
}
