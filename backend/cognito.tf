resource "aws_cognito_user_pool" "user_pool" {
  name = "Stellar Drive User Pool - Dev"

  mfa_configuration          = "OFF"
  
  auto_verified_attributes = ["email"]

  username_configuration {
    case_sensitive = false
  }

  password_policy {
    minimum_length    = 6
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

  schema {
    name = "email"
    attribute_data_type = "String"
    developer_only_attribute = false
    mutable = false
    required = true

    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    name = "name"
    attribute_data_type = "String"
    developer_only_attribute = false
    mutable = false
    required = true

    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "Backend Client - Dev"

  user_pool_id = aws_cognito_user_pool.user_pool.id

  generate_secret     = true
  explicit_auth_flows = ["ALLOW_ADMIN_USER_PASSWORD_AUTH", "ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]

  prevent_user_existence_errors = "ENABLED"

  enable_token_revocation = true
  
  refresh_token_validity = 30
  id_token_validity = 1
  access_token_validity = 24

}

output "user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "app_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "app_client_secret" {
  sensitive = true
  value = aws_cognito_user_pool_client.client.client_secret
}

output "app_client_name" {
  value = aws_cognito_user_pool_client.client.name
}

