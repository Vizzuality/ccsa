module "github_values" {
  source    = "./modules/github_values"
  repo_name = var.repo_name
  secret_map = {
    TF_PROJECT_NAME                    = var.project_name
    TF_CMS_REPOSITORY_NAME             = module.cms_ecr.repository_name
    TF_CLIENT_REPOSITORY_NAME          = module.client_ecr.repository_name
    TF_PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
    TF_PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
  }
  variable_map = {
    TF_AWS_REGION = var.aws_region
  }
}