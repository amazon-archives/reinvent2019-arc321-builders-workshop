#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AwsEndpointProxyCdkStack } from '../lib/aws_endpoint_proxy_cdk-stack';

const app = new cdk.App();
new AwsEndpointProxyCdkStack(app, 'AwsEndpointProxyCdkStack');
