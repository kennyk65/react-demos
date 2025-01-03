## Quick Guide to GitHub Actions: ##

GitHub Actions is used to perform automated actions in response to commits.

### Script Location

GitHub actions looks inside the `.github/workflows` folder.  It automatically processes and executes the files it finds there.  The name and number of files there isn't relevant; each is used to define a _job_.

Useful syntax cheat sheet:  https://github.github.io/actions-cheat-sheet/actions-cheat-sheet.html 

### Script Elements

#### On Element ####
The "on" element describes what repository action you want the script to respond to.  For example, the following section tells the script to respond to any commit on the main branch, but only for files in the `abc/` folder:

```
on:
  push:
    branches:
      - main
    paths:
      - 'abc/**'
```

#### Job Element ####

This describes one or more jobs to execute.  A job is the actual sequence of steps to run.  

Each `step` has a `name` and `uses`.  The name is whatever you want to describe the step.  Uses comes from [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

#### Accessing AWS ####

The overall process to access AWS from GitHub actions is [described here](https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/), but this article is a bit outdated and relies on some manual steps.

The basic process to access AWS is to 1) define an IAM Role (below) and 2) Use the `aws-actions/configure-aws-credentials@v3` to assume it [details](https://github.com/aws-actions/configure-aws-credentials). This is an example of assuming a role called "AbcRole":

```
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v3
      with:
        aws-region: us-east-1  # Replace with your AWS region
        role-to-assume: AbcRole
```

For security purposes, it is best not to expose the name of the Role.  You can replace this with a _secret_ defined in your GitHub repository:

```
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v3
      with:
        aws-region: us-east-1  # Replace with your AWS region
        role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
```
The secret is defined within your GitHub repository.  Go to Settings / Secrets and variables / actions / Repository Secrets

#### Defining the IAM Role ####

To define the IAM Role, you first need to establish GitHub as an OIDC identity provider within your AWS Account.  Create one through CloudFormation like this:

```
  MyOIDCProvider:
    Type: AWS::IAM::OIDCProvider
    Properties:
      Url: "https://token.actions.githubusercontent.com"
      ThumbprintList:
      - d89e3bd43d5d909b47a18977aa9d5ce36cee184c  # Complex process to get this from GitHub.
      ClientIdList:
      - "sts.amazonaws.com"

```

That URL and ThumbprintList are GitHub specific.  One way to get the thumbprint is to first create the OIDC provider through the management console, then run a CLI command to read it.

```
aws iam get-open-id-connect-provider --open-id-connect-provider-arn arn:aws:iam::<ACCOUNT#>:oidc-provider/token.actions.githubusercontent.com
```
Once this OIDC provider is established, the Role can be created which references it.  

```
  # IAM Role
  IAMRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: GitHubActionsS3Role
      Description: Role for GitHub Actions to access S3
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
        - Effect: Allow
          Principal: 
            Federated: !Sub arn:aws:iam::${AWS::AccountId}:oidc-provider/token.actions.githubusercontent.com
          Action: 
          - "sts:AssumeRoleWithWebIdentity" 
          Condition:
            StringEquals:
              token.actions.githubusercontent.com:aud: sts.amazonaws.com
              token.actions.githubusercontent.com:sub: "repo:<GITHUB-ACCOUNT>/<GITHUB-REPOSITORY>:ref:refs/heads/main"

```

The tricky parts are the trust policy's principal and conditions.  The principal limits the Role assumption to GitHub users.  The condition limits the "subject" to commits from your given GitHub repository and branch.

The final piece is to assign only the bare minimum permissions to this role.  For example, to allow a GitHub action to copy files to a specific S3 bucket, the minimum required permission would be:

```
  IAMPolicy:
    Type: AWS::IAM::ManagedPolicy
    Properties:
      ManagedPolicyName: GitHubActionsS3Policy
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
        - Effect: Allow
          Action:
          - s3:PutObject
          - s3:ListBucket
          Resource: 
          - !Sub arn:aws:s3:::${BucketName}
          - !Sub arn:aws:s3:::${BucketName}/*
      Roles:
      - !Ref IAMRole
```