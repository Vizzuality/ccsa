aws_region         = "us-east-1"
allowed_account_id = "450075258684"
project_name       = "ccsa"
repo_name          = "ccsa"

staging_domain                      = "staging.ccsa.dev-vizzuality.com"
staging_ec2_instance_type           = "m5a.large"
staging_rds_backup_retention_period = 3

production_domain                      = "map.caribbeanaccelerator.org"
production_ec2_instance_type           = "c6a.large"
production_rds_backup_retention_period = 7

beanstalk_platform = "64bit Amazon Linux 2023 v4.1.0 running Docker"
beanstalk_tier     = "WebServer"

rds_engine_version = "15.5"
rds_instance_class = "db.t3.micro"
