#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarBucket = void 0;
const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
/**
 * Stack that defines the bucket
 */
class WarBucket extends cdk.Stack {
    constructor(scope, id, appName, props) {
        super(scope, id, props);
        const bucket = new s3.Bucket(this, `${appName}Bucket`, {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            publicReadAccess: true,
            blockPublicAccess: {
                blockPublicPolicy: false,
                blockPublicAcls: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            },
        });
        this.warBucket = bucket;
    }
}
exports.WarBucket = WarBucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FyLWJ1Y2tldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndhci1idWNrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFHekM7O0dBRUc7QUFDSCxNQUFhLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUd0QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLE9BQWUsRUFBRSxLQUFzQjtRQUMvRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsT0FBTyxRQUFRLEVBQUM7WUFDcEQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLGlCQUFpQixFQUFFO2dCQUNqQixpQkFBaUIsRUFBRSxLQUFLO2dCQUN4QixlQUFlLEVBQUUsS0FBSztnQkFDdEIsZ0JBQWdCLEVBQUUsS0FBSztnQkFDdkIscUJBQXFCLEVBQUUsS0FBSzthQUM3QjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7Q0FDRjtBQWxCRCw4QkFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5cclxuLyoqXHJcbiAqIFN0YWNrIHRoYXQgZGVmaW5lcyB0aGUgYnVja2V0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgV2FyQnVja2V0IGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBwdWJsaWMgcmVhZG9ubHkgd2FyQnVja2V0OiBzMy5CdWNrZXQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGFwcE5hbWU6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcbiAgICBcclxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7YXBwTmFtZX1CdWNrZXRgLHtcclxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgcHVibGljUmVhZEFjY2VzczogdHJ1ZSxcclxuICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHtcclxuICAgICAgICBibG9ja1B1YmxpY1BvbGljeTogZmFsc2UsXHJcbiAgICAgICAgYmxvY2tQdWJsaWNBY2xzOiBmYWxzZSxcclxuICAgICAgICBpZ25vcmVQdWJsaWNBY2xzOiBmYWxzZSxcclxuICAgICAgICByZXN0cmljdFB1YmxpY0J1Y2tldHM6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLndhckJ1Y2tldCA9IGJ1Y2tldDtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iXX0=